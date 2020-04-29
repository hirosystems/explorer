import * as React from 'react';
import { FlexProps, BoxProps } from '@blockstack/ui';
import {
  TokenTransferTransaction,
  TransactionEvent,
} from '@blockstack/stacks-blockchain-sidecar-types';

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
}

export interface BottomButtonProps extends FlexProps {
  label: string;
  icon: React.FC;
}
export interface TokenTransferProps extends BoxProps {
  events?: TokenTransferTransaction['events'];
}
