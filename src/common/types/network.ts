export enum NetworkModes {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
  Regtest = 'regtest',
}

export type NetworkMode = NetworkModes.Mainnet | NetworkModes.Testnet | NetworkModes.Regtest | null;
