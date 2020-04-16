import * as React from 'react';
import { Box, Flex, FlexProps, Tooltip } from '@blockstack/ui';
import { Caption } from '@components/typography';
import { Card } from '@components/card';
import { useHover } from 'use-events';
import { CopyIcon } from '@components/svg';

interface RowProps extends FlexProps {
  card?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  copy?: string;
  label?: {
    children: any;
  };
  render: any;
  inline?: boolean;
}

interface RowWrapperProps extends FlexProps {
  inline?: boolean;
}

const RowWrapper: React.FC<RowWrapperProps> = ({ borderColor = 'inherit', inline, ...props }) => (
  <Flex
    direction={inline ? 'column' : ['column', 'column', 'row']}
    py={['base', 'base', 'loose']}
    width="100%"
    align={inline ? 'unset' : ['unset', 'unset', 'flex-start']}
    {...props}
    borderColor={borderColor}
  />
);

const RowLabel = ({ label }: { label: string }) => (
  <Box flexShrink={0} width="140px">
    <Caption pb={['extra-tight', 'extra-tight', 'unset']}>{label}</Caption>
  </Box>
);
interface RowContentProps {
  isHovered: boolean;
  copy?: string;
}
const RowContent: React.FC<RowContentProps> = ({ children, isHovered, ...rest }) => (
  <Flex pr="base" width="100%" align="center" justify="space-between" {...rest}>
    <Flex
      color={isHovered ? 'blue' : undefined}
      textStyle="body.small.medium"
      style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
      align="center"
      width="100%"
    >
      {children}
    </Flex>
    <Tooltip label="Copy to clipboard" hasArrow>
      <Box
        transition="75ms all ease-in-out"
        opacity={isHovered ? 1 : 0}
        color="ink.400"
        pl="base"
        ml="auto"
      >
        <CopyIcon />
      </Box>
    </Tooltip>
  </Flex>
);

export const Row: React.FC<RowProps> = ({
  card,
  isFirst,
  isLast,
  label,
  render,
  copy,
  ...rest
}) => {
  const [hovered, bind] = useHover();
  const isHovered = !!copy && hovered;
  return (
    <RowWrapper
      borderTop={isFirst && !card ? '1px solid' : undefined}
      borderBottom={isLast && card ? undefined : '1px solid'}
      px={card ? 'base' : 'unset'}
      cursor={isHovered ? 'pointer' : undefined}
      {...bind}
      {...rest}
    >
      {label ? <RowLabel label={label.children} /> : null}
      <RowContent isHovered={isHovered}>{render}</RowContent>
    </RowWrapper>
  );
};

interface Item {
  label?: {
    children: any;
  };
  children: any;
  copy?: string; // the value to copy
}

interface RowsProps {
  card?: boolean;
  childComponent?: React.FC<RowProps>;
  items: Item[];
  columnLabels?: string[];
  inline?: boolean;
}

export const Rows: React.FC<RowsProps> = ({
  card,
  childComponent,
  items,
  columnLabels,
  inline,
  ...props
}) => {
  const Component = card ? Card : Box;
  const ChildComponent = childComponent || Row;
  return (
    <Component width="100%" {...props}>
      {columnLabels?.length ? (
        <Row
          py="tight"
          borderBottom="0"
          label={{ children: columnLabels[0] }}
          render={columnLabels[1] ? <RowLabel label={columnLabels[1]} /> : undefined}
        />
      ) : null}
      {items.map(({ label, children, copy }, key, arr) => (
        <ChildComponent
          card={card}
          isFirst={key === 0}
          isLast={key === arr.length - 1}
          label={label}
          render={children}
          key={key}
          copy={copy}
          inline={inline}
        />
      ))}
    </Component>
  );
};
