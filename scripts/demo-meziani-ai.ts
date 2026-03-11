import { createClient } from '@supabase/supabase-js';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if present (for Supabase and Groq keys)
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) {
        const key = m[1].trim();
        const val = m[2].trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch (_) {
    console.warn('⚠️ No .env.local found – ensure required env vars are exported.');
  }
}

async function demoAI() {
  loadEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Supabase credentials missing.');
    process.exit(1);
  }
  if (!groqApiKey) {
    console.error('❌ GROQ_API_KEY missing.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Pull a random debtor for the demo (limit 1)
  const { data: debtors, error } = await supabase
    .from('debtors')
    .select('id, name, email, total_debt, status, days_overdue')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('❌ Error fetching debtor:', error.message);
    process.exit(1);
  }
  if (!debtors || debtors.length === 0) {
    console.log('⚠️ No debtor records found – run the pilot seed first.');
    return;
  }

  const debtor = debtors[0];

  // Use Groq LLaMA model (or any model you have configured) to craft a friendly outreach email.
  const model = groq('llama-3.3-70b-versatile');

  const prompt = `You are a collections agent for Meziani AI. Write a concise, empathetic email to the debtor named ${debtor.name} (email: ${debtor.email}) who owes $${debtor.total_debt.toFixed(2)} USD. Their status is "${debtor.status}" and they are ${debtor.days_overdue} days overdue. Keep the tone professional but friendly, suggest a payment plan, and include a call‑to‑action with a link placeholder (https://pay.meziani.ai).`; 

  const result = await generateText({ model, prompt });

  console.log('\n--- AI‑Generated Outreach Email ---\n');
  console.log(result.text);
  console.log('\n--- End of Email ---\n');
}

demoAI().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
