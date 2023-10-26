import { Block } from '@stacks/stacks-blockchain-api-types';
import { BLOCK_LIMIT } from '@/common/constants';
import { useGlobalContext } from '@/common/context/useAppContext';

export function useBlockFullness(block: Block) {
  const network = useGlobalContext().activeNetwork;
  const blockLimit = BLOCK_LIMIT[network.mode];
  const readCountFullness = block.execution_cost_read_count / blockLimit.read_count;
  const readLengthFullness = block.execution_cost_read_length / blockLimit.read_length;
  const runtimeFullness = block.execution_cost_runtime / blockLimit.runtime;
  const writeCountFullness = block.execution_cost_write_count / blockLimit.write_count;
  const writeLengthFullness = block.execution_cost_write_length / blockLimit.write_length;
  return Math.max(
    readCountFullness,
    readLengthFullness,
    runtimeFullness,
    writeCountFullness,
    writeLengthFullness
  );
}
