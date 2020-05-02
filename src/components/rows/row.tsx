import * as React from 'react';
import { Ref } from 'react';
import { Box, Flex, useClipboard } from '@blockstack/ui';
import { Tooltip } from '@components/tooltip';
import { Caption } from '@components/typography';
import { useHover } from 'use-events';
import { CopyIcon } from '@components/svg';
import { RowWrapperProps, CopyProps, RowProps, RowContentProps } from '@components/rows/types';

export const RowWrapper: React.FC<RowWrapperProps> = ({
  borderColor = 'var(--colors-border)',
  inline,
  ...props
}) => (
  <Flex
    direction={inline ? 'column' : ['column', 'column', 'row']}
    py={['base', 'base', 'loose']}
    width="100%"
    align={inline ? 'unset' : ['unset', 'unset', 'flex-start']}
    {...props}
    borderColor={borderColor}
  />
);

export const RowLabel = ({ label }: { label: string }) => (
  <Flex align="baseline" pt="2px" flexShrink={0} width="140px">
    <Caption pb={['extra-tight', 'extra-tight', 'unset']}>{label}</Caption>
  </Flex>
);

export const CopyButton = React.forwardRef((props: CopyProps, ref: Ref<HTMLDivElement>) => {
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

export const RowContent: React.FC<RowContentProps> = ({ children, copy, isHovered, ...rest }) => {
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
      <Tooltip
        label={hasCopied ? 'Copied!' : 'Copy to clipboard'}
        hasArrow={false}
        placement="bottom"
      >
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
  children,
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
        {render || children}
      </RowContent>
    </RowWrapper>
  );
};
