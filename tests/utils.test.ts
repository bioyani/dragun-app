import { cn } from '../lib/utils';

console.log('🧪 Testing cn...');

function assertEqual(actual: string, expected: string, testName: string) {
  if (actual === expected) {
    console.log(`✅ ${testName} passed`);
  } else {
    console.error(`❌ ${testName} failed`);
    console.error(`   Expected: "${expected}"`);
    console.error(`   Actual:   "${actual}"`);
    process.exit(1);
  }
}

// Test 1: Basic string merging
assertEqual(cn('text-red-500', 'bg-blue-500'), 'text-red-500 bg-blue-500', 'Basic string merging');

// Test 2: Handling of undefined, null, false
assertEqual(cn('text-red-500', undefined, 'bg-blue-500', null, 'p-4', false), 'text-red-500 bg-blue-500 p-4', 'Handling of undefined, null, false');

// Test 3: Empty strings
assertEqual(cn('text-red-500', '', 'bg-blue-500'), 'text-red-500 bg-blue-500', 'Empty strings');

// Test 4: No arguments
assertEqual(cn(), '', 'No arguments');

// Test 5: Only falsy values
assertEqual(cn(undefined, null, false, ''), '', 'Only falsy values');

// Test 6: Single string
assertEqual(cn('text-red-500'), 'text-red-500', 'Single string');

console.log('🎉 All cn tests passed!');
