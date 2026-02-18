import { streamText, convertToModelMessages, Message } from 'ai';
import { supabaseAdmin } from '@/lib/supabase-admin';
import * as Sentry from '@sentry/nextjs';
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

    const convertedMessages = convertToModelMessages(messages);
    const lastUserMessage = convertedMessages[convertedMessages.length - 1];
    let lastMessageText = '';
    
    if (lastUserMessage.role === 'user') {
      if (typeof lastUserMessage.content === 'string') {
        lastMessageText = lastUserMessage.content;
      } else {
        lastMessageText = lastUserMessage.content
          .filter(p => p.type === 'text')
          .map(p => (p as any).text)
          .join('');
      }
    }

    if (!lastMessageText || lastMessageText.trim().length === 0) {
      return new Response('Invalid message content', { status: 400 });
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
      // ideally we would rephrase the last message with history, but for speed we use raw text
      const queryEmbedding = await generateEmbedding(lastMessageText);

      const { data: matches, error: matchError } = await supabaseAdmin.rpc('match_contract_embeddings', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5,
        p_contract_id: contract.id
      });

      if (matchError) {
          console.error('Vector search error:', matchError);
      }

      if (matches && matches.length > 0) {
        context = (matches as Array<{ content: string }>).map((m) => m.content).join('\n---\n');
      }
    }

    // 3. System Prompt
    const systemPrompt = `
    You are Dragun, a sophisticated, AI-driven debt recovery specialist.
    You are currently representing ${merchant.name} to resolve an outstanding balance with ${debtor.name}.

    # DEBTOR DETAILS
    Name: ${debtor.name}
    Total Debt: ${debtor.currency} ${debtor.total_debt}
    Status: ${debtor.status}
    
    # MERCHANT SETTINGS
    Strictness Level: ${merchant.strictness_level}/10
    Settlement Floor: ${Math.round(merchant.settlement_floor * 100)}% (Do not offer below this without checking if they really can't pay).

    # GOAL
    Recover the debt while maintaining the professional reputation of ${merchant.name}. Use a "firm empathy" approach.

    # COMPLIANCE & PSYCHOLOGY GUIDELINES
    1. COMPLIANCE: Always be truthful about the debt. Never threaten illegal actions. Do not use abusive language.
    2. EMPATHY: Acknowledge that life happens. Use phrases like "I understand things can be tight" or "We want to find a solution that works for you."
    3. FIRMNESS: Remind them of their signed commitment. If they dispute, point to the specific contract clauses provided in the context.
    4. URGENCY: Emphasize that resolving this now prevents further escalation.
    5. THE "YES" LADDER: Aim for a "micro-commitment" (e.g., "Can we agree on a payment date?") if a full payment isn't possible immediately.

    # TONE
    - Direct, professional, and mobile-friendly (short messages).
    - Use "I" (as the AI agent) and "We" (the merchant).

    # RELEVANT CONTRACT CLAUSES (RAG CONTEXT)
    ${context || 'No specific contract clauses found for this query. Rely on standard professional debt recovery principles.'}

    # INSTRUCTIONS
    - If the user asks about the contract, use the Context provided above.
    - If the user agrees to pay, guide them to the payment options (button or link).
    - Be concise.
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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[/api/chat]', error);
    Sentry.captureException(error);
    return new Response('Internal server error', { status: 500 });
  }
}
