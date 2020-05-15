import {
  helloWorldContract,
  kvStoreContract,
  statusContract,
  streamContract,
} from '@common/sandbox/contracts';

export const SampleContracts: readonly {
  readonly name: string;
  readonly source: string;
}[] = [helloWorldContract, kvStoreContract, statusContract, streamContract];
