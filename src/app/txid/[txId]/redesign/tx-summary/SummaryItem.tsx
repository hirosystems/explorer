import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { microToStacks, microToStacksFormatted, usdFormatter } from '@/common/utils/utils';
import { Text } from '@/ui/Text';
import StacksIconThin from '@/ui/icons/StacksIconThin';
import { Flex, Icon, Stack, Table } from '@chakra-ui/react';

import { useTxIdPageData } from '../../TxIdPageContext';

export function SummaryItemLabel({ label }: { label: string }) {
  return (
    <Text textStyle="text-medium-sm" color="textSecondary">
      {label}
    </Text>
  );
}

export function SummaryItemValue({
  value,
  valueRenderer,
  label,
  showCopyButton,
}: {
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  label: string;
  showCopyButton?: boolean;
}) {
  const content = valueRenderer ? (
    valueRenderer(value)
  ) : (
    <Text textStyle="text-regular-sm" color="textPrimary" wordBreak="break-all">
      {value}
    </Text>
  );
  return (
    <Flex gap={2} alignItems="center">
      {content}
      {showCopyButton && (
        <CopyButtonRedesign
          initialValue={value}
          aria-label={`copy ${label} value`}
          iconProps={{
            height: 3.5,
            width: 3.5,
          }}
          buttonProps={{
            p: 1.5,
          }}
        />
      )}
    </Flex>
  );
}

export function PriceSummaryItemValue({ value }: { value: string }) {
  const { stxPrice } = useTxIdPageData();
  const stxAmount = microToStacks(value);
  const usdValue = stxPrice * stxAmount;
  const formattedValue = microToStacksFormatted(value);
  const formattedUsdValue =
    usdValue > 0 && usdValue < 0.01 ? '<$0.01' : usdFormatter.format(usdValue);

  return (
    <Flex gap={1.5} alignItems="center">
      <Icon h={3.5} w={3.5} color="iconPrimary">
        <StacksIconThin />
      </Icon>
      {formattedValue} STX
      <CopyButtonRedesign
        initialValue={value}
        aria-label={`copy stx price`}
        iconProps={{
          height: 3.5,
          width: 3.5,
        }}
        buttonProps={{
          p: 1.5,
        }}
      />
      <Text textStyle="text-regular-sm" color="textSecondary">
        /
      </Text>
      <Text textStyle="text-regular-sm" color="textSecondary">
        {formattedUsdValue}
      </Text>
      <CopyButtonRedesign
        initialValue={formattedUsdValue}
        aria-label={`copy usd price`}
        iconProps={{
          height: 3.5,
          width: 3.5,
        }}
        buttonProps={{
          p: 1.5,
        }}
      />
    </Flex>
  );
}

export function SummaryItem({
  label,
  value,
  valueRenderer,
  showCopyButton,
}: {
  label: string;
  value: string;
  valueRenderer?: (value: string) => React.ReactNode;
  showCopyButton?: boolean;
}) {
  return (
    <>
      <Table.Row
        hideBelow="md"
        className="group"
        bg="transparent"
        css={{
          '& > td:first-of-type': {
            borderTopLeftRadius: 'redesign.md',
            borderBottomLeftRadius: 'redesign.md',
          },
          '& > td:last-of-type': {
            borderTopRightRadius: 'redesign.md',
            borderBottomRightRadius: 'redesign.md',
          },
        }}
      >
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <SummaryItemLabel label={label} />
        </Table.Cell>
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <SummaryItemValue
            value={value}
            label={label}
            valueRenderer={valueRenderer}
            showCopyButton={showCopyButton}
          />
        </Table.Cell>
      </Table.Row>
      <Table.Row
        hideFrom="md"
        className="group"
        bg="transparent"
        css={{
          '& > td:first-of-type': {
            borderTopLeftRadius: 'redesign.md',
            borderBottomLeftRadius: 'redesign.md',
          },
          '& > td:last-of-type': {
            borderTopRightRadius: 'redesign.md',
            borderBottomRightRadius: 'redesign.md',
          },
        }}
      >
        <Table.Cell
          _groupHover={{
            bg: 'surfacePrimary',
          }}
          border="none"
        >
          <Stack gap={1.5}>
            <SummaryItemLabel label={label} />
            <SummaryItemValue
              value={value}
              label={label}
              valueRenderer={valueRenderer}
              showCopyButton={showCopyButton}
            />
          </Stack>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
