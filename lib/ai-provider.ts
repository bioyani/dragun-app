import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed } from 'ai';

/**
 * Google AI — direct connection using GOOGLE_GENERATIVE_AI_API_KEY.
 * The Vercel AI Gateway (VERCEL_AI_GATEWAY_KEY) can be wired in here
 * as a proxy when deploying to Vercel production.
 */
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

/**
 * Gemini 2.0 Flash for sub-second latency and 1M context.
 */
export const getChatModel = () => google('gemini-2.0-flash-001');

/**
 * Gemini Text-Embedding-004
 * Matches the 768-dimension vector column in Supabase.
 */
export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: text,
  });
  return embedding;
}
