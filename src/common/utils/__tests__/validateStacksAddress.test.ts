import { validateStacksAddress, validateStacksContractId } from '../utils';

describe('validateStacksAddress', () => {
  it('returns true for valid mainnet addresses', () => {
    const validAddresses = [
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
      'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    ];

    validAddresses.forEach(address => {
      expect(validateStacksAddress(address)).toBe(true);
    });
  });

  it('returns true for valid testnet addresses', () => {
    const validAddresses = [
      'ST221Z6TDTC5E0BYR2V624Q2ST6R0Q71T78WTAX6H',
      'ST319CF5WV77KYR1H3GT0GZ7B8Q4AQPY42ETP1VPF',
      'ST221Z6TDTC5E0BYR2V624Q2ST6R0Q71T78WTAX6H',
    ];

    validAddresses.forEach(address => {
      expect(validateStacksAddress(address)).toBe(true);
    });
  });

  it('returns false for invalid addresses', () => {
    const invalidAddresses = [
      '', // empty string
      'SP', // too short
      'ST', // too short
      'INVALID', // wrong format
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ', // wrong length
      'ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7A', // too long
      'TP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', // wrong prefix
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7 ', // trailing space
      ' SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', // leading space
      undefined, // undefined
    ];

    invalidAddresses.forEach(address => {
      expect(validateStacksAddress(address)).toBe(false);
    });
  });
});

describe('validateStacksContractId', () => {
  it('returns true for valid contract IDs', () => {
    const validContractIds = [
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name',
      'ST221Z6TDTC5E0BYR2V624Q2ST6R0Q71T78WTAX6H.my-contract',
      'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.test-contract-123',
    ];

    validContractIds.forEach(contractId => {
      expect(validateStacksContractId(contractId)).toBe(true);
    });
  });

  it('returns false for invalid contract IDs', () => {
    const invalidContractIds = [
      '', // empty string
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', // missing contract name
      'invalid.contract-name', // invalid address
      '.contract-name', // missing address
      'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.', // missing contract name
      undefined, // undefined
      'TP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name', // wrong prefix
    ];

    invalidContractIds.forEach(contractId => {
      expect(validateStacksContractId(contractId)).toBe(false);
    });
  });
});
