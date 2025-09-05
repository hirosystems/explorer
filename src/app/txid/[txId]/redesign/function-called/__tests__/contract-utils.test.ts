import { getContractIdParts } from '@/common/utils/test-utils/contract-utils';

describe('getContractIdParts', () => {
  it('should split a valid contract ID into address and name', () => {
    const contractId = 'SP000000000000000000002Q6VF78.pox-4';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'SP000000000000000000002Q6VF78',
      contractName: 'pox-4',
    });
  });

  it('should handle contract IDs with multiple dots by splitting on first dot only', () => {
    const contractId = 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.arkadiko-swap-v2-1';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R',
      contractName: 'arkadiko-swap-v2-1',
    });
  });

  it('should handle contract IDs with hyphens and numbers in contract name', () => {
    const contractId = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
      contractName: 'usda-token',
    });
  });

  it('should handle mainnet contract addresses', () => {
    const contractId = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-reserve-pool';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
      contractName: 'alex-reserve-pool',
    });
  });

  it('should handle testnet contract addresses', () => {
    const contractId = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.clarity-bitcoin';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'clarity-bitcoin',
    });
  });

  it('should return undefined contract name when no dot is present', () => {
    const contractId = 'SP000000000000000000002Q6VF78';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'SP000000000000000000002Q6VF78',
      contractName: undefined,
    });
  });

  it('should handle empty contract name after dot', () => {
    const contractId = 'SP000000000000000000002Q6VF78.';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: 'SP000000000000000000002Q6VF78',
      contractName: '',
    });
  });

  it('should handle empty string input', () => {
    const contractId = '';
    const result = getContractIdParts(contractId);

    expect(result).toEqual({
      contractAddress: '',
      contractName: undefined,
    });
  });
});
