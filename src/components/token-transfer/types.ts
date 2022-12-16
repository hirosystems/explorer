import * as React from 'react';

import { TokenTransferTransaction, TransactionEvent } from '@stacks/stacks-blockchain-api-types';
import { BoxProps, FlexProps } from '@stacks/ui';

export interface AssetType {
  asset_event_type?: 'transfer' | 'mint' | 'burn';
  asset_id?: string;
  sender?: string;
  recipient?: string;
  amount?: string;
  value?: string;
}

export interface TokenTransferItemProps extends FlexProps {
  data: TransactionEvent;
  noBottomBorder?: boolean;
  length?: number;
}

interface BottomButtonPropsBase {
  label: string;
  onClick?: any;
  icon: React.FC;
}

export type BottomButtonProps = FlexProps & BottomButtonPropsBase;

export interface TokenTransferProps extends BoxProps {
  events?: TokenTransferTransaction['events'];
}
