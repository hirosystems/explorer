import {
  helloWorldContract,
  kvStoreContract,
  statusContract,
  streamContract,
} from '@sandbox/common/contracts';
import { fungibleTokenContract } from '@sandbox/common/contracts/fungible-token';

export const SampleContracts: readonly {
  readonly name: string;
  readonly source: string;
}[] = [fungibleTokenContract, helloWorldContract, kvStoreContract, statusContract, streamContract];
