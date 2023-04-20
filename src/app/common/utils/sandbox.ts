export function showFn(contractId: string, abiFn: any) {
  return (
    abiFn.access !== 'private' &&
    (abiFn.name !== 'stack-increase' ||
      (contractId !== 'SP000000000000000000002Q6VF78.pox-2' &&
        contractId !== 'ST000000000000000000002AMW42H.pox-2'))
  );
}
