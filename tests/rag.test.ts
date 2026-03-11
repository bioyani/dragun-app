import { mock } from "bun:test";
import { getRagContext } from "../lib/rag";

// Mock the ai-provider to control generateEmbedding
mock.module("../lib/ai-provider", () => ({
  generateEmbedding: mock(async (text: string) => {
    if (text === "empty-embedding") return [];
    if (text === "null-embedding") return null;
    return [0.1, 0.2, 0.3]; // dummy embedding
  }),
}));

// Mock supabase-admin to control getMerchantContractId and supabaseAdmin.rpc
mock.module("../lib/supabase-admin", () => {
  const mockRpc = mock(async (rpcName: string, params: any) => {
    if (params.query_embedding && params.query_embedding.length > 0) {
      if (params.query_embedding[0] === 0.999) {
         return { data: null, error: new Error("RPC Error") };
      }
      if (params.query_embedding[0] === 0.888) {
         return { data: [], error: null };
      }
    }
    // Default success
    return { data: [{ content: "match 1" }, { content: "match 2" }], error: null };
  });

  const mockSingle = mock(async () => ({ data: { id: "contract-123" }, error: null }));
  const mockLimit = mock(() => ({ single: mockSingle }));
  const mockOrder = mock(() => ({ limit: mockLimit }));
  const mockEq = mock(() => ({ order: mockOrder }));
  const mockSelect = mock(() => ({ eq: mockEq }));
  const mockFrom = mock(() => ({ select: mockSelect }));

  return {
    supabaseAdmin: {
      from: mockFrom,
      rpc: mockRpc,
    },
    hasSupabaseAdminConfig: true,
  };
});

console.log("Mocks configured.");

console.log('🧪 Testing RAG fallback behavior...');

// Test 1: Empty embedding fallback
async function testEmptyEmbeddingFallback() {
  const result = await getRagContext("merchant-123", "empty-embedding", {
    fallbackContext: "empty fallback",
  });

  if (result.context === "empty fallback" && result.chunks.length === 0) {
    console.log('✅ Empty embedding fallback passed');
  } else {
    console.error('❌ Empty embedding fallback failed', result);
    process.exit(1);
  }
}

// Test 2: Null embedding fallback
async function testNullEmbeddingFallback() {
  const result = await getRagContext("merchant-123", "null-embedding", {
    fallbackContext: "null fallback",
  });

  if (result.context === "null fallback" && result.chunks.length === 0) {
    console.log('✅ Null embedding fallback passed');
  } else {
    console.error('❌ Null embedding fallback failed', result);
    process.exit(1);
  }
}

// Mock ai-provider to handle specific queries for RPC tests
mock.module("../lib/ai-provider", () => ({
  generateEmbedding: mock(async (text: string) => {
    if (text === "empty-embedding") return [];
    if (text === "null-embedding") return null;
    if (text === "rpc-error") return [0.999];
    if (text === "rpc-empty") return [0.888];
    if (text === "catch-error") throw new Error("Embedding throw");
    return [0.1, 0.2, 0.3]; // dummy embedding
  }),
}));

// Test 3: RPC error fallback
async function testRpcErrorFallback() {
  const result = await getRagContext("merchant-123", "rpc-error", {
    fallbackContext: "error fallback",
  });

  if (result.context === "error fallback" && result.chunks.length === 0) {
    console.log('✅ RPC error fallback passed');
  } else {
    console.error('❌ RPC error fallback failed', result);
    process.exit(1);
  }
}

// Test 4: RPC empty fallback
async function testRpcEmptyFallback() {
  const result = await getRagContext("merchant-123", "rpc-empty", {
    fallbackContext: "empty matches fallback",
  });

  if (result.context === "empty matches fallback" && result.chunks.length === 0) {
    console.log('✅ RPC empty fallback passed');
  } else {
    console.error('❌ RPC empty fallback failed', result);
    process.exit(1);
  }
}

// Test 5: Catch block fallback (Exception thrown)
async function testCatchBlockFallback() {
  const result = await getRagContext("merchant-123", "catch-error", {
    fallbackContext: "catch fallback",
  });

  if (result.context === "catch fallback" && result.chunks.length === 0) {
    console.log('✅ Catch block fallback passed');
  } else {
    console.error('❌ Catch block fallback failed', result);
    process.exit(1);
  }
}

async function runAll() {
  await testEmptyEmbeddingFallback();
  await testNullEmbeddingFallback();
  await testRpcErrorFallback();
  await testRpcEmptyFallback();
  await testCatchBlockFallback();
  console.log('🎉 All RAG tests passed!');
}

runAll().catch(err => {
  console.error(err);
  process.exit(1);
});
