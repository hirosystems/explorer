import { TxLink } from '@/components/links';
import { TextLink } from '@/ui/components';
import * as React from 'react';
import { FC } from 'react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Value } from '../../../common/components/Value';

export const ContractName: FC<{
  tx:
    | ContractCallTransaction
    | MempoolContractCallTransaction
    | SmartContractTransaction
    | MempoolSmartContractTransaction;
}> = ({ tx }) => {
  if (tx.tx_type === 'contract_call') {
    return (
      <KeyValueHorizontal
        label={'Contract'}
        value={
          <TxLink txId={tx.contract_call.contract_id}>
            <TextLink as="a">
              <Value>{tx.contract_call.contract_id}</Value>
            </TextLink>
          </TxLink>
        }
        copyValue={tx.contract_call.contract_id}
      />
    );
  }
  if (tx.tx_type === 'smart_contract') {
    return (
      <KeyValueHorizontal
        label={'Contract'}
        value={
          <TxLink txId={tx.smart_contract.contract_id}>
            <TextLink as="a">
              <Value>{tx.smart_contract.contract_id}</Value>
            </TextLink>
          </TxLink>
        }
        copyValue={tx.smart_contract.contract_id}
      />
    );
  }
  return null;
};
