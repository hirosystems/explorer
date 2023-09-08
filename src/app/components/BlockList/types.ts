import { Block } from '@stacks/blockchain-api-client';

export type EnhancedBlock = Block & { destroy?: boolean; animate?: boolean };
