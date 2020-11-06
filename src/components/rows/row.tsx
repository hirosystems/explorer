import * as React from 'react';

import { Flex, useClipboard } from '@stacks/ui';
import { CopyProps, RowContentProps, RowProps, RowWrapperProps } from '@components/rows/types';

import { Caption } from '@components/typography';
import { CopyIcon } from '@components/icons/copy';
import { Ref } from 'react';
import { Tooltip } from '@components/tooltip';
import { useHover } from 'use-events';
import { IconButton } from '@components/icon-button';

export const RowWrapper: React.FC<RowWrapperProps> = ({
  borderColor = 'var(--colors-border)',
  inline,
  ...props
}) => (
  <Flex
    flexDirection={inline ? 'column' : ['column', 'column', 'row']}
    py={['base', 'base', 'loose']}
    width="100%"
    alignItems={inline ? 'unset' : ['unset', 'unset', 'center']}
    {...props}
    borderColor={borderColor}
  />
);

export const RowLabel = ({ label }: { label: string }) => (
  <Flex alignItems="baseline" pt="2px" flexShrink={0} width="140px">
    <Caption pb={['extra-tight', 'extra-tight', 'unset']}>{label}</Caption>
  </Flex>
);

export const CopyButton = React.forwardRef(
  ({ isHovered, ...rest }: CopyProps, ref: Ref<HTMLDivElement>) => (
    <IconButton opacity={[1, 1, isHovered ? 1 : 0]} ref={ref} dark icon={CopyIcon} {...rest} />
  )
);

export const RowContent: React.FC<RowContentProps> = ({ children, copy, isHovered, ...rest }) => {
  const { onCopy, hasCopied } = useClipboard(copy || '');

  return (
    <Flex pr="base" width="100%" alignItems="center" justifyContent="space-between" {...rest}>
      <Flex
        color="var(--colors-text-body)"
        textStyle="body.small.medium"
        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
        alignItems="center"
        width="100%"
        pr="base"
      >
        {children}
      </Flex>
      {copy ? (
        <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'}>
          <CopyButton onClick={onCopy} isHovered={isHovered} />
        </Tooltip>
      ) : null}
    </Flex>
  );
};

export const Row: React.FC<RowProps> = React.memo(
  ({ card, isFirst, isLast, label, render, copy, noTopBorder, children, ...rest }) => {
    const [hovered, _bind] = useHover();
    const isHovered = !!copy && hovered;
    const bind = !!copy ? { ..._bind } : {};
    return (
      <RowWrapper
        borderTop={!noTopBorder && isFirst && !card ? '1px solid' : undefined}
        borderBottom={isLast || card ? undefined : '1px solid'}
        px={card ? 'base' : 'unset'}
        {...bind}
        {...rest}
      >
        {label ? <RowLabel label={typeof label === 'string' ? label : label.children} /> : null}
        <RowContent isHovered={isHovered} copy={copy}>
          {render || children}
        </RowContent>
      </RowWrapper>
    );
  }
);
