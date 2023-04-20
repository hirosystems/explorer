/**
 * Predicate that a function of a contract should be shown.
 *
 * Functions that are private should NOT be shown
 * Functions that are pox-2.stacks-increase should NOT be shown
 *
 * @param contractId the contract id
 * @param abiFn the abi of the function or
 * @returns true if the provided function should be shown in the explorer.
 */
export function showFn(contractId: string, abiFn: any) {
  return (
    abiFn.access !== 'private' &&
    (abiFn.name !== 'stack-increase' ||
      (contractId !== 'SP000000000000000000002Q6VF78.pox-2' &&
        contractId !== 'ST000000000000000000002AMW42H.pox-2'))
  );
}
