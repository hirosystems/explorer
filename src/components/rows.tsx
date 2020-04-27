import * as React from 'react';
import { Ref } from 'react';
import { Box, Flex, FlexProps, useClipboard, Tooltip } from '@blockstack/ui';
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
  noTopBorder?: boolean;
}

interface RowWrapperProps extends FlexProps {
  inline?: boolean;
}

const RowWrapper: React.FC<RowWrapperProps> = ({ borderColor = 'var(--colors-border)', inline, ...props }) => (
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
  <Flex align="baseline" pt="2px" flexShrink={0} width="140px">
    <Caption pb={['extra-tight', 'extra-tight', 'unset']}>{label}</Caption>
  </Flex>
);
interface RowContentProps {
  isHovered: boolean;
  copy?: string;
}
interface CopyProps {
  isHovered?: boolean;
  onClick?: () => void;
}
const CopyButton = React.forwardRef((props: CopyProps, ref: Ref<HTMLDivElement>) => {
  return (
    <Box
      transition="75ms all ease-in-out"
      color="ink.400"
      ml="auto"
      ref={ref}
      opacity={props.isHovered ? 1 : 0}
      {...props}
    >
      <CopyIcon />
    </Box>
  );
});

const RowContent: React.FC<RowContentProps> = ({ children, copy, isHovered, ...rest }) => {
  const { onCopy, hasCopied } = useClipboard(copy || '');

  return (
    <Flex pr="base" width="100%" align="center" justify="space-between" {...rest}>
      <Flex
        color={isHovered ? 'var(--colors-text-hover)' : 'var(--colors-text-body)'}
        textStyle="body.small.medium"
        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
        align="baseline"
        width="100%"
        pr="base"
      >
        {children}
      </Flex>
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'} hasArrow>
        <CopyButton onClick={onCopy} isHovered={isHovered} />
      </Tooltip>
    </Flex>
  );
};

export const Row: React.FC<RowProps> = ({
  card,
  isFirst,
  isLast,
  label,
  render,
  copy,
  noTopBorder,
  ...rest
}) => {
  const [hovered, bind] = useHover();
  const isHovered = !!copy && hovered;
  return (
    <RowWrapper
      borderTop={!noTopBorder && isFirst && !card ? '1px solid' : undefined}
      borderBottom={isLast && card ? undefined : '1px solid'}
      px={card ? 'base' : 'unset'}
      cursor={isHovered ? 'pointer' : undefined}
      {...bind}
      {...rest}
    >
      {label ? <RowLabel label={label.children} /> : null}
      <RowContent isHovered={isHovered} copy={copy}>
        {render}
      </RowContent>
    </RowWrapper>
  );
};

interface Item {
  condition?: boolean;
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
  noTopBorder?: boolean;
}

export const Rows: React.FC<RowsProps> = ({
  card,
  childComponent,
  items,
  columnLabels,
  inline,
  noTopBorder,
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
      {items.map(
        ({ label, children, copy, condition = true }, key, arr) =>
          condition && (
            <ChildComponent
              card={card}
              noTopBorder={noTopBorder}
              isFirst={key === 0}
              isLast={key === arr.length - 1}
              label={label}
              render={children}
              key={key}
              copy={copy}
              inline={inline}
            />
          )
      )}
    </Component>
  );
};
