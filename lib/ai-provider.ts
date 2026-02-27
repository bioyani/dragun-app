import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://dragun.app',
    'X-Title': process.env.OPENROUTER_SITE_NAME ?? 'Dragun.app',
  },
});

/**
 * Free models via OpenRouter, ordered by quality for recovery conversations.
 * Uses OPENROUTER_MODEL env var if set, otherwise walks the free tier list.
 * All :free suffixed models have $0 cost on OpenRouter.
 */
const FREE_MODELS = [
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemini-2.5-flash-preview-05-20:free',
  'meta-llama/llama-3.3-8b-instruct:free',
  'qwen/qwen3-8b:free',
] as const;

export const getChatModel = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is required. Get one free at openrouter.ai');
  }

  const explicit = process.env.OPENROUTER_MODEL;
  if (explicit) {
    return openrouter(explicit);
  }

  return openrouter(FREE_MODELS[0]);
};

/**
 * Embeddings for RAG via OpenRouter (free nomic-embed model).
 * Returns null if no API key -- RAG simply skips context retrieval.
 */
export async function generateEmbedding(text: string) {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }

  try {
    const { embedding } = await embed({
      model: openrouter.embedding('nomic-ai/nomic-embed-text-v1.5'),
      value: text,
    });
    return embedding;
  } catch (e) {
    console.error('Embedding generation failed:', e);
    return null;
  }
}
