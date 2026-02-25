import { streamText, convertToModelMessages } from 'ai';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateEmbedding, getChatModel } from '@/lib/ai-provider';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages, debtorId } = await req.json();

    // Basic input validation
    if (!debtorId || typeof debtorId !== 'string') {
      return new Response('Invalid request', { status: 400 });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid messages', { status: 400 });
    }

    const convertedMessages = await convertToModelMessages(messages);
    const lastUserMessage = convertedMessages[convertedMessages.length - 1];
    let lastMessageText = '';
    
    if (lastUserMessage.role === 'user') {
      if (typeof lastUserMessage.content === 'string') {
        lastMessageText = lastUserMessage.content;
      } else if (Array.isArray(lastUserMessage.content)) {
        lastMessageText = lastUserMessage.content
          .filter(p => p.type === 'text')
          .map(p => (p as { type: 'text'; text: string }).text)
          .join('');
      }
    }

    if (!lastMessageText || lastMessageText.trim().length === 0) {
      return new Response('Invalid message content', { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY missing');
      return new Response('OPENROUTER_API_KEY missing', { status: 500 });
    }

    // 1. Get debtor info and their merchant's contract
    const { data: debtor, error: debtorError } = await supabaseAdmin
      .from('debtors')
      .select('*, merchant:merchants(*)')
      .eq('id', debtorId)
      .single();

    if (debtorError || !debtor) {
      return new Response('Debtor not found', { status: 404 });
    }

    const merchant = debtor.merchant;

    // 2. Retrieval (RAG)
    // We only search if there's a contract.
    const { data: contract } = await supabaseAdmin
      .from('contracts')
      .select('id')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let context = '';
    if (contract) {
      // Create a search query based on the last message
      const queryEmbedding = await generateEmbedding(lastMessageText);

      const { data: matches, error: matchError } = await supabaseAdmin.rpc('match_contract_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5,
        p_contract_id: contract.id
      });

      if (matchError) {
          console.error('Vector search error:', matchError);
      } else if (matches && matches.length > 0) {
        context = (matches as Array<{ content: string }>).map((m) => m.content).join('\n---\n');
      }
    }

    // 3. System Prompt (The Meziani AI Policy for Dragun.app)
    const systemPrompt = `
    You are Meziani AI, the expert recovery intelligence operating the Dragun.app platform.
    You are representing ${merchant.name} to recover an outstanding balance via the Dragun.app settlement interface.

    # OPERATIONAL HIERARCHY
    - Platform: Dragun.app (Product)
    - Operator: Meziani AI (Parent Company/Intelligence)
    
    # MEZIANI AI OPERATIONAL POLICY
    1. IDENTITY: You are Meziani AI. You use the Dragun.app platform to facilitate resolution.
    2. FIRM EMPATHY: If ${debtor.name} expresses hardship, acknowledge it ("I understand this is a difficult time") but pivot back to resolution ("We still need to address the balance per your agreement").
    3. CONTRACTUAL AUTHORITY: You have access to the signed agreement. Use the provided context to cite specific clauses (e.g., "The contract signed on [Date] requires a 30-day notice").
    4. SETTLEMENT LADDER: 
       - Tier 1: Seek payment in full.
       - Tier 2: Offer a 3-month installment plan.
       - Tier 3: Offer a lump-sum settlement (Minimum: ${Math.round(merchant.settlement_floor * 100)}%).
    5. COMPLIANCE: Do not threaten legal action you aren't authorized to take. Do not use aggressive or shaming language. 

    # DEBTOR PROFILE
    Name: ${debtor.name}
    Debt: ${debtor.currency} ${debtor.total_debt}
    Merchant Strictness: ${merchant.strictness_level}/10

    # RELEVANT CONTEXT (RAG)
    ${context || 'Standard recovery principles apply. No specific contract clauses found.'}

    # CONCISE RESPONSES
    Keep messages under 3 sentences. Focus on getting a "Yes" to a specific payment option.
  `;

    // 4. Call Gemini 2.0 Flash
    const result = streamText({
      model: getChatModel(),
      system: systemPrompt,
      messages: convertedMessages,
      onFinish: async ({ text }) => {
        // 5. Save messages to Supabase (fire and forget)
        await supabaseAdmin.from('conversations').insert([
          { debtor_id: debtorId, role: 'user', message: lastMessageText },
          { debtor_id: debtorId, role: 'assistant', message: text },
        ]);
        
        // Update last contacted
        await supabaseAdmin.from('debtors').update({ last_contacted: new Date().toISOString() }).eq('id', debtorId);
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[/api/chat]', error);
    return new Response('Internal server error', { status: 500 });
  }
}
