import { Block } from '@stacks/stacks-blockchain-api-types';

export type EnhancedBlock = Block & { destroy?: boolean; animate?: boolean };
