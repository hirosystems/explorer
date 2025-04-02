export enum InvalidFunctionType {
  Private = 'private',
  Pox2StacksIncrease = 'pox-2-stacks-increase',
  Unknown = 'unknown',
}

/**
 * Predicate that a function of a contract should be shown.
 *
 * Functions that are private should NOT be shown
 * Functions that are pox-2.stacks-increase should NOT be
 * shown as it is invalid since Stacks 2.2
 *
 * @param contractId the contract id
 * @param abiFn the abi of the function or
 * @returns true if the provided function should be shown in the explorer.
 */
// TODO: This implementation seems incorrect as it automatically bans functions from using the name "stack-increase"
export function showFn(contractId: string, abiFn: any) {
  return (
    abiFn.access !== 'private' &&
    (abiFn.name !== 'stack-increase' ||
      (contractId !== 'SP000000000000000000002Q6VF78.pox-2' &&
        contractId !== 'ST000000000000000000002AMW42H.pox-2'))
  );
}

export function getInvalidFunctionType(contractId: string, abiFn: any): InvalidFunctionType | null {
  if (abiFn.access === 'private') {
    return InvalidFunctionType.Private;
  }
  if (
    (contractId === 'SP000000000000000000002Q6VF78.pox-2' && abiFn.name === 'stack-increase') ||
    (contractId === 'ST000000000000000000002AMW42H.pox-2' && abiFn.name === 'stack-increase')
  ) {
    return InvalidFunctionType.Pox2StacksIncrease;
  }
  return InvalidFunctionType.Unknown;
}
