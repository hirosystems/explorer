'use client';

import { useColorMode } from '@chakra-ui/react';
import pluralize from 'pluralize';
import React from 'react';

import {
  MempoolTransaction,
  PostCondition,
  PostConditionFungible,
  PostConditionFungibleConditionCode,
  PostConditionNonFungible,
  PostConditionNonFungibleConditionCode,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

import { Badge } from '../../../common/components/Badge';
import { ListItem } from '../../../common/components/ListItem';
import { Section } from '../../../common/components/Section';
import { StxPriceButton } from '../../../common/components/StxPriceButton';
import { useVerticallyStackedElementsBorderStyle } from '../../../common/hooks/useVerticallyStackedElementsBorderStyle';
import { useContractFtMetadata } from '../../../common/queries/useContractFtMetadata';
import {
  capitalize,
  ftDecimals,
  microStxToStx,
  truncateMiddle,
  validateStacksAddress,
} from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Circle } from '../../../ui/Circle';
import { FlexProps } from '../../../ui/Flex';
import { Grid } from '../../../ui/Grid';
import { StxIcon } from '../../../ui/icons';
import { Caption } from '../../../ui/typography';
import { getTicker } from './Events';

const constructPostConditionAssetId = (
  asset: PostConditionFungible['asset'] | PostConditionNonFungible['asset']
) => {
  return `${asset.contract_address}.${asset.contract_name}::${asset.asset_name}`;
};

const getFirstLetterOfAsset = (value: string) => {
  if (value.includes('::')) {
    return value.split('::')[1][0];
  } else {
    if (value.includes('.')) {
      const parts = value.split('.');
      if (validateStacksAddress(parts[0])) {
        return value[1][0];
      } else {
        return value[0][0];
      }
    }
    return value[0];
  }
};

const getPrettyCode = (
  code: PostConditionFungibleConditionCode | PostConditionNonFungibleConditionCode,
  plural: boolean
) => {
  const singular = 'transfer';
  const modifier = pluralize(singular, plural ? 2 : 1);
  switch (code) {
    case 'not_sent':
      return `prevent ${singular}`;
    case 'sent':
      return modifier;
    case 'sent_equal_to':
      return `${modifier} exactly`;
    case 'sent_greater_than':
      return `${modifier} more than`;
    case 'sent_greater_than_or_equal_to':
      return `${modifier} at least`;
    case 'sent_less_than':
      return `${modifier} less than`;
    case 'sent_less_than_or_equal_to':
      return `${modifier} no more than`;
  }
};

const ConditionAsset = ({ condition }: { condition: PostCondition }) => {
  const colorMode = useColorMode().colorMode;
  switch (condition.type) {
    case 'fungible':
    case 'non_fungible':
      const assetId = constructPostConditionAssetId(condition.asset);
      const letter = getFirstLetterOfAsset(assetId);
      return <Circle size={'48px'}>{letter.toUpperCase()}</Circle>;
    case 'stx':
      return (
        <Circle size="48px" bg={`accent.${colorMode}`}>
          <StxIcon size="20px" color="white" />
        </Circle>
      );
  }
};

const getConditionTicker = (condition: PostCondition) => {
  switch (condition.type) {
    case 'stx':
      return 'STX';
    case 'fungible':
      return getTicker(condition.asset.asset_name).toUpperCase();
    default:
      return '';
  }
};

const getAmount = (condition: PostCondition) => {
  if (condition.type === 'stx') {
    return microStxToStx(condition.amount);
  }

  if (condition.type === 'fungible') {
    return parseFloat(condition.amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }
  return `1 ${condition.asset_value.repr}`;
};

const getAddressValue = (condition: PostCondition) => {
  switch (condition.principal.type_id) {
    case 'principal_standard':
      return condition.principal.address;
    case 'principal_origin':
      return 'self';
    case 'principal_contract':
      return `${condition.principal.address}.${condition.principal.contract_name}`;
  }
};

const Condition = ({
  tx,
  condition,
}: {
  tx: Transaction | MempoolTransaction;
  condition: PostCondition;
}) => {
  const asset = 'asset' in condition ? condition.asset : undefined;
  const contractAddress = asset?.contract_address;
  const contractName = asset?.contract_name;
  const contractId =
    !!contractAddress && !!contractName ? `${contractAddress}.${contractName}` : undefined;
  const { data: ftMetadata } = useContractFtMetadata(contractId);

  return (
    <ListItem
      icon={<ConditionAsset condition={condition} />}
      title={
        <>
          {capitalize(getPrettyCode(condition.condition_code, true))}{' '}
          {ftMetadata
            ? ftDecimals((condition as any).amount, ftMetadata?.decimals || 0)
            : getAmount(condition)}
          {ftMetadata?.symbol || getConditionTicker(condition)}
          {condition.type === 'stx' && <StxPriceButton tx={tx} value={Number(condition.amount)} />}
        </>
      }
      subTitle={truncateMiddle(getAddressValue(condition), 8)}
    />
  );
};

export const PostConditions: React.FC<
  {
    tx: Transaction | MempoolTransaction;
  } & FlexProps
> = ({ tx }) => {
  const { post_conditions: conditions, post_condition_mode: mode } = tx;
  return (
    <Section
      title="Post conditions"
      topRight={
        mode ? (
          <Badge color={'textBody'} bg={'bgAlt'} border={'none'}>
            {capitalize(mode)} mode
          </Badge>
        ) : null
      }
    >
      <Box px="24px" css={useVerticallyStackedElementsBorderStyle}>
        {conditions?.length ? (
          <>
            {conditions.map((condition: PostCondition, key) => (
              <Condition tx={tx} condition={condition} key={key} />
            ))}
          </>
        ) : (
          <Grid placeItems="center" px="16px" py="32px">
            <Caption my="0" p="0" fontSize="14px">
              This transaction has no post-conditions.
            </Caption>
          </Grid>
        )}
      </Box>
    </Section>
  );
};
