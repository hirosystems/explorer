export function getContractIdParts(contractId: string) {
  const [contractAddress, contractName] = contractId.split('.');
  return {
    contractAddress,
    contractName,
  };
}
