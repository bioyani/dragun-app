import { describe, it, expect } from 'vitest';
import { chunkText } from '../lib/chunking';

describe('chunkText', () => {
  it('should perform basic chunking', () => {
    const text = "This is a sentence. " + "Word ".repeat(100) + "\nAnother paragraph.";
    const chunks = chunkText(text, 50, 10);
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('should overlap chunks', () => {
    const chunks = chunkText("1234567890", 5, 2);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle empty text', () => {
    const chunks = chunkText("");
    expect(chunks.length).toBe(0);
  });
});
