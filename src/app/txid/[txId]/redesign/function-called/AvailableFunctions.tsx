import { useUser } from '@/app/sandbox/hooks/useUser';
import { Button } from '@/ui/Button';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { TabsContentContainer } from '../TxTabs';
import { FunctionList } from './FunctionList';

export const AvailableFunctions = ({
  tx,
}: {
  tx:
    | ContractCallTransaction
    | MempoolContractCallTransaction
    | SmartContractTransaction
    | MempoolSmartContractTransaction;
}) => {
  const contractId =
    'contract_call' in tx ? tx.contract_call?.contract_id : tx.smart_contract?.contract_id;
  const { isConnected, connect } = useUser();

  return isConnected ? (
    <FunctionList contractId={contractId} />
  ) : (
    <TabsContentContainer alignItems="center">
      <Button variant="redesignPrimary" onClick={connect} w="fit-content">
        Connect Stacks Wallet
      </Button>
    </TabsContentContainer>
  );
};
