import * as React from 'react';
import { Ref } from 'react';

import { Flex, FlexProps, useClipboard } from '@stacks/ui';
import { CopyProps, RowContentProps, RowProps, RowWrapperProps } from '@components/rows/types';

import { Caption } from '@components/typography';
import { CopyIcon } from '@components/icons/copy';
import { Tooltip } from '@components/tooltip';
import { useHover } from 'use-events';
import { IconButton } from '@components/icon-button';

export const RowWrapper: React.FC<RowWrapperProps> = React.memo(
  ({ borderColor = 'var(--colors-border)', inline, ...props }) => (
    <Flex
      flexDirection={inline ? 'column' : ['column', 'column', 'row']}
      py={['base', 'base', 'loose']}
      width="100%"
      alignItems={inline ? 'unset' : ['unset', 'unset', 'center']}
      {...props}
      borderColor={borderColor}
    />
  )
);

export const RowLabel: React.FC<{ label: string } & FlexProps> = React.memo(
  ({ label, ...rest }) => (
    <Flex alignItems="baseline" pt="2px" flexShrink={0} width="140px" {...rest}>
      <Caption pb={['extra-tight', 'extra-tight', 'unset']}>{label}</Caption>
    </Flex>
  )
);

export const CopyButton = React.memo(
  React.forwardRef(({ isHovered, hasCopied, ...rest }: CopyProps, ref: Ref<HTMLDivElement>) => (
    <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'}>
      <IconButton
        right={isHovered ? '0' : '10px'}
        position="absolute"
        opacity={[1, 1, isHovered ? 1 : 0]}
        ref={ref}
        dark
        iconProps={{ strokeWidth: 1.75, size: '20px' }}
        icon={CopyIcon}
        {...rest}
      />
    </Tooltip>
  ))
);

export const RowContent: React.FC<RowContentProps> = React.memo(
  ({ children, flexGrow, copy, isHovered, ...rest }) => {
    const { onCopy, hasCopied } = useClipboard(copy || '');

    return (
      <Flex width="100%" alignItems="center" justifyContent="flex-start" {...rest}>
        <Flex
          color="var(--colors-text-body)"
          textStyle="body.small.medium"
          style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
          alignItems="center"
          position="relative"
          pr={copy ? '48px' : undefined}
          flexGrow={flexGrow}
        >
          {children}
          {copy ? (
            <CopyButton hasCopied={hasCopied} onClick={onCopy} isHovered={isHovered} />
          ) : null}
        </Flex>
      </Flex>
    );
  }
);

export const Row: React.FC<RowProps> = React.memo(
  ({
    card,
    isFirst,
    isLast,
    label,
    render,
    copy,
    noTopBorder,
    children,
    flexGrow,
    inline,
    ...rest
  }) => {
    const [hovered, _bind] = useHover();
    const isHovered = !!copy && hovered;
    const bind = !!copy ? { ..._bind } : {};
    return (
      <RowWrapper
        borderTop={!noTopBorder && isFirst && !card ? '1px solid' : undefined}
        borderBottom={isLast || card ? undefined : '1px solid'}
        px={card ? 'base' : 'unset'}
        inline={inline}
        {...bind}
        {...rest}
      >
        {label ? (
          <RowLabel
            mb={inline ? 'tight' : 'unset'}
            label={typeof label === 'string' ? label : label.children}
          />
        ) : null}
        <RowContent flexGrow={flexGrow} isHovered={isHovered} copy={copy}>
          {render || children}
        </RowContent>
      </RowWrapper>
    );
  }
);
