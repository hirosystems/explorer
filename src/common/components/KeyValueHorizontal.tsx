import { css } from '@emotion/react';
import { FC, ReactNode } from 'react';

import { Flex, FlexProps } from '../../ui/Flex';
import { CopyButton } from './CopyButton';

export interface KeyValueHorizontalProps {
  label: string;
  value: ReactNode;
  copyValue?: string;
  labelProps?: FlexProps;
}

const rowStyle = css`
  .fancy-copy {
    opacity: 0;
    position: relative;
    right: 10px;
    transition:
      opacity 0.4s ease-in-out,
      right 0.4s ease-in-out;
  }
  &:hover {
    .fancy-copy {
      opacity: 1;
      right: 0;
    }
  }
`;

export const KeyValueHorizontal: FC<KeyValueHorizontalProps> = ({
  label,
  value,
  copyValue,
  labelProps,
}) => {
  return (
    <Flex
      py={'16px'}
      alignItems={'center'}
      css={rowStyle}
      gap={'10px'}
      flexWrap="nowrap"
      minHeight={'73px'}
    >
      <Flex fontSize={'12px'} color={'textCaption'} width={'140px'} flexShrink={0} {...labelProps}>
        {label}
      </Flex>
      <Flex
        flexDirection={['column', 'column', 'row']}
        alignItems={['flex-start', 'flex-start', 'center']}
        color={'textBody'}
        maxWidth={'calc(100% - 180px)'}
        wordBreak={'break-all'}
      >
        {value}
      </Flex>
      {copyValue && (
        <CopyButton
          className={'fancy-copy'}
          initialValue={copyValue}
          aria-label={'copy row'}
          size={'40px'}
        />
      )}
    </Flex>
  );
};
