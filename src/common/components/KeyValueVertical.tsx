import { css } from '@emotion/react';
import { FC, ReactNode } from 'react';

import { Flex } from '../../ui/Flex';
import { CopyButton } from './CopyButton';

export interface KeyValueVerticalProps {
  label: string;
  value: ReactNode;
  copyValue?: string;
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

export const KeyValueVertical: FC<KeyValueVerticalProps> = ({ label, value, copyValue }) => {
  return (
    <Flex p={'24px 0'} css={rowStyle} gap={'10px'}>
      <Flex gap={'10px'} direction={'column'}>
        <Flex fontSize={'12px'} color={'textCaption'} width={'140px'}>
          {label}
        </Flex>
        <Flex
          flexDirection={['column', 'column', 'row']}
          alignItems={['flex-start', 'flex-start', 'center']}
        >
          {value}
        </Flex>
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
