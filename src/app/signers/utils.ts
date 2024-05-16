import { SIGNER_KEY_MAP } from './consts';

export function getSignerKeyName(signerKey: string) {
  if (signerKey in SIGNER_KEY_MAP) {
    return SIGNER_KEY_MAP[signerKey].name;
  }
  return 'unknown';
}
