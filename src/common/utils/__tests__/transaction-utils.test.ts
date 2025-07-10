import { getAmount, getToAddress } from '../transaction-utils';

const mockTokenTransferTx: any = {
  tx_type: 'token_transfer',
  token_transfer: {
    recipient_address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    amount: '1000000',
  },
};

const mockSmartContractTx: any = {
  tx_type: 'smart_contract',
  smart_contract: {
    contract_id: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.test-contract',
  },
};

const mockContractCallTx: any = {
  tx_type: 'contract_call',
  contract_call: {
    contract_id: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.test-contract',
  },
};

const mockCoinbaseTx: any = {
  tx_type: 'coinbase',
};

const mockTenureChangeTx: any = {
  tx_type: 'tenure_change',
};

const mockMempoolTokenTransferTx: any = {
  tx_type: 'token_transfer',
  token_transfer: {
    recipient_address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    amount: '2000000',
  },
};

const mockMempoolContractCallTx: any = {
  tx_type: 'contract_call',
  contract_call: {
    contract_id: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG.another-contract',
  },
};

describe('transaction-utils', () => {
  describe('getToAddress', () => {
    it('should return recipient address for token transfer transactions', () => {
      expect(getToAddress(mockTokenTransferTx)).toBe('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
      expect(getToAddress(mockMempoolTokenTransferTx)).toBe(
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      );
    });

    it('should return contract ID for smart contract transactions', () => {
      expect(getToAddress(mockSmartContractTx)).toBe(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.test-contract'
      );
    });

    it('should return contract ID for contract call transactions', () => {
      expect(getToAddress(mockContractCallTx)).toBe(
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.test-contract'
      );
      expect(getToAddress(mockMempoolContractCallTx)).toBe(
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG.another-contract'
      );
    });

    it('should return empty string for coinbase transactions', () => {
      expect(getToAddress(mockCoinbaseTx)).toBe('');
    });

    it('should return empty string for tenure change transactions', () => {
      expect(getToAddress(mockTenureChangeTx)).toBe('');
    });
  });

  describe('getAmount', () => {
    it('should return amount for token transfer transactions', () => {
      expect(getAmount(mockTokenTransferTx)).toBe(1000000);
      expect(getAmount(mockMempoolTokenTransferTx)).toBe(2000000);
    });

    it('should return 0 for non-token transfer transactions', () => {
      expect(getAmount(mockSmartContractTx)).toBe(0);
      expect(getAmount(mockContractCallTx)).toBe(0);
      expect(getAmount(mockCoinbaseTx)).toBe(0);
      expect(getAmount(mockTenureChangeTx)).toBe(0);
      expect(getAmount(mockMempoolContractCallTx)).toBe(0);
    });
  });
});
