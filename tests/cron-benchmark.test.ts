async function mockSendFollowUpEmail(_id: string) {
  return new Promise<{success: boolean}>(resolve => setTimeout(() => resolve({success: true}), 100)); // 100ms per email
}

async function sequential(debtors: {id: string}[]) {
  let sent = 0;
  for (const d of debtors) {
    const res = await mockSendFollowUpEmail(d.id);
    if (res.success) sent++;
  }
  return sent;
}

async function parallel(debtors: {id: string}[]) {
  const results = await Promise.allSettled(
    debtors.map((d) => mockSendFollowUpEmail(d.id))
  );

  const sent = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length;

  return sent;
}

async function run() {
  const debtors = Array.from({length: 50}, (_, i) => ({id: String(i)}));

  const startSeq = performance.now();
  await sequential(debtors);
  const endSeq = performance.now();

  const startPar = performance.now();
  await parallel(debtors);
  const endPar = performance.now();

  console.log(`Sequential: ${endSeq - startSeq}ms`);
  console.log(`Parallel: ${endPar - startPar}ms`);
  console.log(`Speedup: ${((endSeq - startSeq) / (endPar - startPar)).toFixed(2)}x`);
}

run();
