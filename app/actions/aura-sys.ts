'use server';

import { isOwner } from '@/lib/auth';

export async function getNetworkProcesses() {
  if (!(await isOwner())) {
    throw new Error('Unauthorized');
  }

  const backendUrl = process.env.AURA_BACKEND_URL || 'https://meziani.org';
  const vaultToken = process.env.AURA_VAULT_TOKEN;

  if (!vaultToken) {
    return { error: 'AURA_VAULT_TOKEN not configured in app environment.' };
  }

  try {
    const res = await fetch(`${backendUrl}/api/sys/network`, {
      headers: {
        'x-aura-vault-token': vaultToken,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const detail = await res.text();
      return { error: `Backend error (${res.status}): ${detail}` };
    }

    return await res.json();
  } catch (err) {
    return { error: `Failed to fetch network processes: ${err instanceof Error ? err.message : err}` };
  }
}
