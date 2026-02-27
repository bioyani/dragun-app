import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';

/**
 * OpenRouter — used for any model via OPENROUTER_API_KEY.
 * Supports DeepSeek, Llama, Mistral, Qwen, Gemma, etc.
 */
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://dragun.app',
    'X-Title': process.env.OPENROUTER_SITE_NAME ?? 'Dragun.app',
  },
});

/**
 * Google AI — direct access to Gemini models (free tier generous).
 * Also used for embeddings.
 */
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

/**
 * Model priority for the recovery agent:
 *
 * 1. OPENROUTER_MODEL env var — any model the operator chooses
 * 2. Google Gemini 2.5 Flash (free, fast, strong reasoning)
 * 3. DeepSeek Chat via OpenRouter (dirt cheap, excellent instruction following)
 * 4. Free fallback: Llama 3.1 8B via OpenRouter
 */
export const getChatModel = () => {
  const explicitModel = process.env.OPENROUTER_MODEL;

  if (explicitModel && process.env.OPENROUTER_API_KEY) {
    return openrouter(explicitModel);
  }

  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google('gemini-2.5-flash-preview-05-20');
  }

  if (process.env.OPENROUTER_API_KEY) {
    return openrouter('deepseek/deepseek-chat-v3-0324:free');
  }

  throw new Error(
    'No AI provider configured. Set GOOGLE_GENERATIVE_AI_API_KEY or OPENROUTER_API_KEY.'
  );
};

/**
 * Gemini Text-Embedding-004 — 768-dimension vectors for RAG.
 */
export async function generateEmbedding(text: string) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return null;
  }

  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: text,
  });
  return embedding;
}
