import {
  truncateContractName,
  truncateHex,
  truncateMiddle,
  truncateStxAddress,
  truncateStxContractId,
} from '../utils';

describe('truncateHex', () => {
  it('should truncate hex string with custom lengths #1', () => {
    expect(truncateHex('0x123456789abcdef', 4, 4, false)).toBe('0x12…cdef');
  });

  it('should truncate hex string with custom lengths #2', () => {
    expect(truncateHex('0x123456789abcdef', 6, 3, false)).toBe('0x1234…def');
  });

  it('should truncate hex string and include the prefix', () => {
    expect(truncateHex('0x123456789abcdef', 6, 3)).toBe('0x123456…def');
  });

  it('should handle empty string', () => {
    expect(truncateHex('', 1, 1)).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncateHex(undefined as unknown as string, 1, 1)).toBe('');
  });
});

describe('truncateMiddle', () => {
  it('should truncate string with custom lengths #1', () => {
    expect(truncateMiddle('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B', 4, 5)).toBe('SP2J…VQ02B');
  });

  it('should truncate string with custom lengths #2', () => {
    expect(truncateMiddle('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B', 8, 6)).toBe(
      'SP2JXKMS…JVQ02B'
    );
  });

  it('should handle empty string', () => {
    expect(truncateMiddle('', 1, 1)).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncateMiddle(undefined as unknown as string, 1, 1)).toBe('');
  });

  it('should handle short strings', () => {
    expect(truncateMiddle('hello', 1, 1)).toBe('h…o');
  });
});

describe('truncateContractName', () => {
  it('should truncate contract name with only start length', () => {
    expect(truncateContractName('very-long-contract-name', 8, undefined)).toBe('very-lon...');
  });

  it('should truncate contract name with start and end length', () => {
    expect(truncateContractName('very-long-contract-name', 4, 4)).toBe('very…name');
  });

  it('should return original string if truncated would be longer', () => {
    const shortName = 'short';
    expect(truncateContractName(shortName, 10, undefined)).toBe(shortName);
  });

  it('should handle empty string', () => {
    expect(truncateContractName('', 5, undefined)).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncateContractName(undefined as unknown as string, 5, undefined)).toBe('');
  });
});

describe('truncateStxAddress', () => {
  const validAddress = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

  it('should truncate valid STX address with default lengths', () => {
    expect(truncateStxAddress(validAddress)).toBe('SP2J…V9EJ7');
  });

  it('should truncate valid STX address with custom lengths', () => {
    expect(truncateStxAddress(validAddress, 8, 6)).toBe('SP2J6ZY4…RV9EJ7');
  });

  it('should return empty string for invalid address', () => {
    expect(truncateStxAddress('invalid-address')).toBe('');
  });

  it('should handle empty string', () => {
    expect(truncateStxAddress('')).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncateStxAddress(undefined as unknown as string)).toBe('');
  });
});

describe('truncateStxContractId', () => {
  const validContractId = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.contract-name';

  it('should truncate valid contract ID with default lengths', () => {
    expect(truncateStxContractId(validContractId)).toBe('SP2J…V9EJ7.contract-name');
  });

  it('should truncate valid contract ID with custom lengths', () => {
    expect(truncateStxContractId(validContractId, 8, 6, 4, 4)).toBe('SP2J6ZY4…RV9EJ7.cont…name');
  });

  it('should truncate contract name with only start length', () => {
    expect(truncateStxContractId(validContractId, 5, 5, 4)).toBe('SP2J6…V9EJ7.cont...');
  });

  it('should return empty string for invalid contract ID', () => {
    expect(truncateStxContractId('invalid.contract.id')).toBe('');
  });

  it('should handle empty string', () => {
    expect(truncateStxContractId('')).toBe('');
  });

  it('should handle undefined input', () => {
    expect(truncateStxContractId(undefined as unknown as string)).toBe('');
  });
});
