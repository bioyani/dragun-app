import { mock, test, expect, beforeEach, afterEach } from "bun:test";

const mockHeadersData = new Map<string, string>();

mock.module("next/headers", () => {
  return {
    headers: async () => {
      return {
        get: (key: string) => mockHeadersData.get(key) ?? null,
      };
    },
  };
});

mock.module("next/navigation", () => {
  return {
    redirect: () => {}
  }
});

// Mock Supabase admin and Stripe to avoid initialization issues
mock.module("@/lib/supabase-admin", () => ({ supabaseAdmin: {} }));
mock.module("@/lib/merchant", () => ({ ensureMerchant: async () => "mock-id" }));
mock.module("@/lib/stripe", () => ({ stripe: {} }));

import { resolveBaseUrl } from "../../app/actions/stripe-connect";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  // Clear any existing relevant env vars
  delete process.env.NEXT_PUBLIC_URL;
  delete process.env.VERCEL_URL;
  mockHeadersData.clear();
});

afterEach(() => {
  process.env = originalEnv;
});

console.log('🧪 Testing resolveBaseUrl...');

test("NEXT_PUBLIC_URL priority (valid)", async () => {
  process.env.NEXT_PUBLIC_URL = "https://custom.app";
  const url = await resolveBaseUrl();
  expect(url).toBe("https://custom.app");
});

test("NEXT_PUBLIC_URL priority (http allowed)", async () => {
  process.env.NEXT_PUBLIC_URL = "http://localhost:3000/some/path";
  const url = await resolveBaseUrl();
  expect(url).toBe("http://localhost:3000");
});

test("NEXT_PUBLIC_URL invalid fallthrough to origin header", async () => {
  process.env.NEXT_PUBLIC_URL = "not-a-url";
  mockHeadersData.set("origin", "https://origin.app");
  const url = await resolveBaseUrl();
  expect(url).toBe("https://origin.app");
});

test("origin header fallback", async () => {
  mockHeadersData.set("origin", "https://origin.app/path");
  const url = await resolveBaseUrl();
  expect(url).toBe("https://origin.app");
});

test("x-forwarded-host and x-forwarded-proto fallback", async () => {
  mockHeadersData.set("x-forwarded-host", "forwarded.app");
  mockHeadersData.set("x-forwarded-proto", "http");
  const url = await resolveBaseUrl();
  expect(url).toBe("http://forwarded.app");
});

test("host header fallback (defaulting to https)", async () => {
  mockHeadersData.set("host", "host.app");
  const url = await resolveBaseUrl();
  expect(url).toBe("https://host.app");
});

test("VERCEL_URL fallback", async () => {
  process.env.VERCEL_URL = "vercel.app";
  const url = await resolveBaseUrl();
  expect(url).toBe("https://vercel.app");
});

test("Absolute fallback", async () => {
  const url = await resolveBaseUrl();
  expect(url).toBe("https://www.dragun.app");
});

console.log('🎉 All resolveBaseUrl tests setup!');
