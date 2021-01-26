import {
  helloWorldContract,
  kvStoreContract,
  statusContract,
  streamContract,
} from '@sandbox/common/contracts';

export const SampleContracts: readonly {
  readonly name: string;
  readonly source: string;
}[] = [helloWorldContract, kvStoreContract, statusContract, streamContract];
