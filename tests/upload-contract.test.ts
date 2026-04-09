import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

console.log('🧪 Testing upload-contract...');

let allPassed = true;
function assert(condition: unknown, message: string) {
  if (condition) {
    console.log(`✅ ${message} passed`);
  } else {
    console.error(`❌ ${message} failed`);
    allPassed = false;
  }
}

// Global state for mocks
let mockMerchantId: string | null = 'test-merchant-id';
let mockStorageUploadError: Error | null = null;
let mockContractInsertError: Error | null = null;
let mockExtractTextResult: unknown = { text: 'Valid extracted PDF text' };
let mockExtractTextThrows: Error | null = null;
let mockGenerateEmbeddingThrows: Error | null = null;

// Mock next/cache
const nextCachePath = require.resolve('next/cache');
require.cache[nextCachePath] = {
  id: nextCachePath,
  filename: nextCachePath,
  loaded: true,
  exports: {
    revalidatePath: () => {}
  }
} as unknown;

// Mock @/lib/supabase-admin
const supabaseAdminPath = require.resolve('../lib/supabase-admin');
require.cache[supabaseAdminPath] = {
  id: supabaseAdminPath,
  filename: supabaseAdminPath,
  loaded: true,
  exports: {
    supabaseAdmin: {
      storage: {
        from: () => ({
          upload: async () => {
            if (mockStorageUploadError) return { error: mockStorageUploadError };
            return { error: null };
          }
        })
      },
      from: (table: string) => ({
        insert: (data: unknown) => {
          return {
            select: () => ({
              single: async () => {
                if (table === 'contracts' && mockContractInsertError) {
                  return { data: null, error: mockContractInsertError };
                }
                return { data: { id: 'contract-123' }, error: null };
              }
            })
          };
        }
      })
    }
  }
} as unknown;

// Mock @/lib/ai-provider
const aiProviderPath = require.resolve('../lib/ai-provider');
require.cache[aiProviderPath] = {
  id: aiProviderPath,
  filename: aiProviderPath,
  loaded: true,
  exports: {
    generateEmbedding: async (chunk: string) => {
      if (mockGenerateEmbeddingThrows) throw mockGenerateEmbeddingThrows;
      return [0.1, 0.2, 0.3];
    }
  }
} as unknown;

// Mock @/lib/merchant
const merchantPath = require.resolve('../lib/merchant');
require.cache[merchantPath] = {
  id: merchantPath,
  filename: merchantPath,
  loaded: true,
  exports: {
    ensureMerchant: async () => mockMerchantId
  }
} as unknown;

// Mock unpdf
const unpdfPath = require.resolve('unpdf');
require.cache[unpdfPath] = {
  id: unpdfPath,
  filename: unpdfPath,
  loaded: true,
  exports: {
    getDocumentProxy: async () => ({}),
    extractText: async () => {
      if (mockExtractTextThrows) throw mockExtractTextThrows;
      return mockExtractTextResult;
    }
  }
} as unknown;

// Mock chunking
const chunkingPath = require.resolve('../lib/chunking');
require.cache[chunkingPath] = {
  id: chunkingPath,
  filename: chunkingPath,
  loaded: true,
  exports: {
    chunkText: (text: string) => [text]
  }
} as unknown;

// Reset mocks helper
function resetMocks() {
  mockMerchantId = 'test-merchant-id';
  mockStorageUploadError = null;
  mockContractInsertError = null;
  mockExtractTextResult = { text: 'Valid extracted PDF text' };
  mockExtractTextThrows = null;
  mockGenerateEmbeddingThrows = null;
}

// Generate valid PDF magic number buffer
function createPdfBuffer(size = 100) {
  const buffer = Buffer.alloc(size);
  buffer[0] = 0x25; // %
  buffer[1] = 0x50; // P
  buffer[2] = 0x44; // D
  buffer[3] = 0x46; // F
  return buffer;
}

function createFormDataWithFile(buffer: Buffer, name: string) {
  const formData = new FormData();
  const file = new File([buffer], name, { type: 'application/pdf' });
  formData.append('contract', file);
  return formData;
}

// Disable console output for expected errors to keep test output clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && (args[0].includes('Upload Error:') || args[0].includes('Embedding generation failed'))) {
    return;
  }
  originalConsoleError(...args);
};
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('No embeddings generated')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Load function under test AFTER cache is poisoned
const { uploadContract } = require('../app/actions/upload-contract');

async function runTests() {
  // Test 1: Happy path
  resetMocks();
  let validBuffer = createPdfBuffer();
  let validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  let res = await uploadContract(validFormData);
  assert(res.success === true && res.contractId === 'contract-123', 'Happy path successful upload');

  // Test 2: Unauthorized
  resetMocks();
  mockMerchantId = null;
  validBuffer = createPdfBuffer();
  validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  res = await uploadContract(validFormData);
  assert(res.success === false && res.error === 'Unauthorized', 'Unauthorized error handled');

  // Test 3: No file provided
  resetMocks();
  res = await uploadContract(new FormData());
  assert(res.success === false && res.error === 'No file provided', 'Missing file error handled');

  // Test 4: File too large
  resetMocks();
  const hugeFormData = new FormData();
  // We can patch the File class just for this test, or intercept size getter
  const hugeFile = new File([], 'huge.pdf');
  Object.defineProperty(hugeFile, 'size', { value: 11 * 1024 * 1024 });
  hugeFormData.append('contract', hugeFile);
  res = await uploadContract(hugeFormData);
  assert(res.success === false && res.error === 'File too large (max 10 MB)', 'File too large error handled');

  // Test 5: Not a PDF
  resetMocks();
  const badBuffer = Buffer.alloc(10);
  const badFormData = createFormDataWithFile(badBuffer, 'test.txt');
  res = await uploadContract(badFormData);
  assert(res.success === false && res.error === 'Only PDF files are accepted', 'Non-PDF file error handled');

  // Test 6: Storage upload error
  resetMocks();
  mockStorageUploadError = new Error('S3 offline');
  validBuffer = createPdfBuffer();
  validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  res = await uploadContract(validFormData);
  assert(res.success === false && res.error === 'Storage error: S3 offline', 'Storage error handled');

  // Test 7: PDF extract text returns empty string
  resetMocks();
  mockExtractTextResult = { text: '   \n  ' };
  validBuffer = createPdfBuffer();
  validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  res = await uploadContract(validFormData);
  assert(res.success === false && res.error === 'Could not extract text from PDF.', 'Empty extracted text error handled');

  // Test 8: PDF extract text throws an error
  resetMocks();
  mockExtractTextThrows = new Error('Corrupted PDF dictionary');
  validBuffer = createPdfBuffer();
  validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  res = await uploadContract(validFormData);
  assert(res.success === false && res.error === 'Corrupted PDF dictionary', 'PDF extraction exception handled');

  // Test 9: Text extraction returns array (unpdf handles both)
  resetMocks();
  mockExtractTextResult = { text: ['Page 1 text', 'Page 2 text'] };
  validBuffer = createPdfBuffer();
  validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  res = await uploadContract(validFormData);
  assert(res.success === true, 'Array of text chunks from unpdf handled');

  // Test 10: Embedding failure shouldn't fail the whole contract upload
  resetMocks();
  mockGenerateEmbeddingThrows = new Error('OpenAI rate limit');
  validBuffer = createPdfBuffer();
  validFormData = createFormDataWithFile(validBuffer, 'test.pdf');
  res = await uploadContract(validFormData);
  assert(res.success === true && res.contractId === 'contract-123', 'Embedding failure swallowed gracefully');

  if (!allPassed) {
    process.exit(1);
  } else {
    console.log('🎉 All upload-contract tests passed!');
  }
}

runTests().catch(e => {
  originalConsoleError('Test execution failed:', e);
  process.exit(1);
});
