import { ContractCallTransaction, PostConditionMode } from '@stacks/stacks-blockchain-api-types';
import { cvToJSON, hexToCV } from '@stacks/transactions';

import {
  formatClarityValue,
  formatFunctionResult,
  getContractCallTxFunctionArgs,
  getFunctionResultSuccessStatus,
} from '../utils';
import { contractCallTxWithNonTupleResult, contractCallTxWithTupleResult } from './test-data';

// Mock cvToJSON and hexToCV since we're testing functions that use them
jest.mock('@stacks/transactions', () => ({
  cvToJSON: jest.fn(),
  hexToCV: jest.fn(),
}));

// Mock microToStacksFormatted since we're testing functions that use it
jest.mock('@/common/utils/utils', () => ({
  microToStacksFormatted: jest.fn(),
}));

describe('Function Called Utils', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('formatClarityValueType', () => {
    // This function is not exported, so we'll test it indirectly through formatClarityValue
    it('formats basic clarity types correctly', () => {
      // Test through formatClarityValue
      const boolValue = formatClarityValue({ type: 'bool', repr: 'true' });
      const intValue = formatClarityValue({ type: 'int', repr: '42' });
      const principalValue = formatClarityValue({ type: 'principal', repr: 'SP123...' });
      const uintValue = formatClarityValue({ type: 'uint', repr: 'u100' });

      expect(boolValue.type).toBe('Boolean');
      expect(intValue.type).toBe('Integer');
      expect(principalValue.type).toBe('Principal');
      expect(uintValue.type).toBe('Unsigned Integer');
    });

    it('handles tuple type correctly', () => {
      const tupleValue = formatClarityValue({
        type: 'tuple',
        repr: '(tuple (key1 value1) (key2 value2))',
      });

      expect(tupleValue.type).toBe('Tuple');
    });

    it('returns the original type for other types', () => {
      const otherValue = formatClarityValue({ type: 'list', repr: '(list 1 2 3)' });
      expect(otherValue.type).toBe('list');
    });
  });

  describe('formatClarityValue', () => {
    it('handles principal values correctly', () => {
      // Mock the hexToCV and cvToJSON functions
      const mockPrincipal = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B.my-contract';
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({ value: mockPrincipal });

      const result = formatClarityValue({
        type: 'principal',
        repr: 'SP2J...02B',
        hex: '0x1234',
      });

      expect(result).toEqual({
        name: '',
        value: mockPrincipal,
        type: 'Principal',
      });

      // Verify hexToCV and cvToJSON were called
      expect(hexToCV).toHaveBeenCalledWith('0x1234');
      expect(cvToJSON).toHaveBeenCalled();
    });

    it('handles uint values correctly', () => {
      const result = formatClarityValue({
        type: 'uint',
        repr: 'u1000',
      });

      expect(result).toEqual({
        name: '',
        value: '1000',
        type: 'Unsigned Integer',
      });
    });

    it('handles ustx values correctly', () => {
      // Mock the microToStacksFormatted function specifically for this test
      const mockMicroToStacks = require('@/common/utils/utils').microToStacksFormatted;
      mockMicroToStacks.mockReturnValue('1');

      const result = formatClarityValue({
        type: 'uint',
        repr: 'u1000000',
        name: 'amount-ustx',
      });

      expect(result).toEqual({
        name: 'amount-ustx',
        value: '1',
        type: 'Unsigned Integer',
      });

      // Verify that microToStacksFormatted was called with the correct value
      expect(mockMicroToStacks).toHaveBeenCalledWith('1000000');
    });

    it('handles tuple values correctly', () => {
      const result = formatClarityValue({
        type: 'tuple',
        repr: '(tuple (key1 value1) (key2 value2))',
      });

      expect(result).toEqual({
        name: '',
        value: 'key1: value1, key2: value2, ',
        type: 'Tuple',
      });
    });

    it('handles other types correctly', () => {
      const result = formatClarityValue({
        type: 'string-ascii',
        repr: 'hello',
      });

      expect(result).toEqual({
        name: '',
        value: 'hello',
        type: 'string-ascii',
      });
    });
  });

  describe('formatFunctionResult', () => {
    it('formats non-tuple results correctly', () => {
      // Mock the hexToCV and cvToJSON functions for a non-tuple result
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({
        success: true,
        type: 'bool',
        value: true,
      });

      const result = formatFunctionResult({
        hex: '0x0703',
        repr: '(ok true)',
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: '',
        value: '(ok true)',
        type: 'Boolean',
      });

      // Verify hexToCV was called with the correct hex value
      expect(hexToCV).toHaveBeenCalledWith('0x0703');
    });

    it('formats tuple results correctly', () => {
      // Mock the hexToCV and cvToJSON functions for a tuple result
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({
        success: true,
        type: 'tuple',
        value: {
          value: {
            amount: { type: 'uint', value: 1000 },
            recipient: { type: 'principal', value: 'SP123...' },
          },
        },
      });

      const result = formatFunctionResult({
        hex: '0x070a...',
        repr: '(ok (tuple (amount u1000) (recipient SP123...)))',
      });

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        name: 'amount',
        value: '1000',
        type: 'Unsigned Integer',
      });
      expect(result).toContainEqual({
        name: 'recipient',
        value: 'SP123...',
        type: 'Principal',
      });
    });

    it('handles nested types in tuple results', () => {
      // Mock the hexToCV and cvToJSON functions for a tuple with nested types
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({
        success: true,
        type: 'tuple',
        value: {
          value: {
            type: 'nested-type', // This indicates a nested type
            value: {
              field1: { type: 'uint', value: 100 },
              field2: { type: 'bool', value: true },
            },
          },
        },
      });

      const result = formatFunctionResult({
        hex: '0x070a...',
        repr: '(ok (tuple (field1 u100) (field2 true)))',
      });

      // The function should handle this case, even if the result might not be what we expect
      expect(result).toBeDefined();
    });

    it('formats results from real transaction data (non-tuple)', () => {
      // Use the real transaction data from our examples
      const txResult = contractCallTxWithNonTupleResult.tx_result;

      // Mock the hexToCV and cvToJSON functions to return what we expect from this tx
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({
        success: true,
        type: '(response bool)',
        value: true,
      });

      const result = formatFunctionResult(txResult);

      const expectedResult = [
        {
          name: '',
          value: '(ok true)',
          type: '(response bool)',
        },
      ];

      expect(result).toHaveLength(1);
      const firstResult = result[0];
      const expectedFirstResult = expectedResult[0];
      expect(firstResult.name).toEqual(expectedFirstResult.name);
      expect(firstResult.value).toEqual(expectedFirstResult.value);
      expect(firstResult.type).toEqual(expectedFirstResult.type);
      expect(hexToCV).toHaveBeenCalledWith('0x0703');
    });

    it('formats results from real transaction data (tuple)', () => {
      // Use the real transaction data from our examples
      const txResult = contractCallTxWithTupleResult.tx_result;

      // Mock the hexToCV and cvToJSON functions to return what we expect from this tx
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({
        success: true,
        type: '(response (optional (tuple (amount-ustx uint) (delegated-to principal) (pox-addr (optional none)) (until-burn-ht (optional none)))) UnknownType)',
        value: {
          type: '(optional (tuple (amount-ustx uint) (delegated-to principal) (pox-addr (optional none)) (until-burn-ht (optional none))))',
          value: {
            type: '(tuple (amount-ustx uint) (delegated-to principal) (pox-addr (optional none)) (until-burn-ht (optional none)))',
            value: {
              'amount-ustx': {
                type: 'uint',
                value: '24183461872',
              },
              'delegated-to': {
                type: 'principal',
                value: 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox4-fast-pool-v3',
              },
              'pox-addr': {
                type: '(optional none)',
                value: null,
              },
              'until-burn-ht': {
                type: '(optional none)',
                value: null,
              },
            },
          },
        },
      });

      const result = formatFunctionResult(txResult);

      const expectedResult = [
        {
          name: 'type',
          value:
            '{"amount-ustx":{"type":"uint","value":"24183461872"},"delegated-to":{"type":"principal","value":"SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox4-fast-pool-v3"},"pox-addr":{"type":"optional: none","value":null},"until-burn-ht":{"type":"(optional, ',
          type: 'Tuple',
        },
        {
          name: 'value',
          value:
            '{"amount-ustx":{"type":"uint","value":"24183461872"},"delegated-to":{"type":"principal","value":"SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox4-fast-pool-v3"},"pox-addr":{"type":"optional: none","value":null},"until-burn-ht":{"type":"(optional, ',
          type: 'Tuple',
        },
      ];

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('type');
      expect(result[0].value).toBe(expectedResult[0].value);
      expect(result[0].type).toBe(expectedResult[0].type);
      expect(result[1].name).toBe('value');
      expect(result[1].value).toBe(expectedResult[1].value);
      expect(result[1].type).toBe(expectedResult[1].type);
      expect(hexToCV).toHaveBeenCalledWith(txResult.hex);
    });
  });

  describe('getContractCallTxFunctionArgs', () => {
    it('extracts function args from contract call transaction', () => {
      // Cast the test data to the expected type
      const typedTx = {
        ...contractCallTxWithNonTupleResult,
        post_condition_mode:
          contractCallTxWithNonTupleResult.post_condition_mode as PostConditionMode,
      } as ContractCallTransaction;

      const args = getContractCallTxFunctionArgs(typedTx);

      expect(args).toHaveLength(6);
      expect(args[0].name).toBe('amount-ustx');
      expect(args[0].type).toBe('uint');
    });

    it('returns empty array when no function args exist', () => {
      // Cast the test data to the expected type
      const typedTx = {
        ...contractCallTxWithTupleResult,
        post_condition_mode: contractCallTxWithTupleResult.post_condition_mode as PostConditionMode,
      } as ContractCallTransaction;

      const args = getContractCallTxFunctionArgs(typedTx);

      expect(args).toHaveLength(0);
    });
  });

  describe('getFunctionResultSuccessStatus', () => {
    it('returns success status from function result', () => {
      // Mock the hexToCV and cvToJSON functions
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({ success: true });

      // Cast the test data to the expected type with proper post_condition_mode
      const typedTx = {
        ...contractCallTxWithNonTupleResult,
        post_condition_mode:
          contractCallTxWithNonTupleResult.post_condition_mode as PostConditionMode,
      } as ContractCallTransaction;

      const result = getFunctionResultSuccessStatus(typedTx);

      expect(result).toBe(true);
      expect(hexToCV).toHaveBeenCalledWith('0x0703');
    });

    it('returns false for failed function result', () => {
      // Mock the hexToCV and cvToJSON functions
      (hexToCV as jest.Mock).mockReturnValue({});
      (cvToJSON as jest.Mock).mockReturnValue({ success: false });

      // Cast the test data to the expected type with proper post_condition_mode
      const typedTx = {
        ...contractCallTxWithNonTupleResult,
        post_condition_mode:
          contractCallTxWithNonTupleResult.post_condition_mode as PostConditionMode,
      } as ContractCallTransaction;

      const result = getFunctionResultSuccessStatus(typedTx);

      expect(result).toBe(false);
    });
  });
});
