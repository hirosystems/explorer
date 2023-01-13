import { IconButton, IconButtonProps, Tooltip } from '@/ui/components';
import { useClipboard } from '@chakra-ui/react';
import * as React from 'react';
import { FC, memo } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';

export const CopyButton: FC<IconButtonProps & { initialValue: string }> = memo(
  ({ initialValue, ...rest }) => {
    const { onCopy, hasCopied } = useClipboard(initialValue);
    return (
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'}>
        <IconButton
          icon={<AiOutlineCopy strokeWidth={1.75} size={'20px'} color={'textBody'} />}
          onClick={onCopy}
          height={'auto'}
          _focus={{ background: 'none' }}
          _hover={{ background: 'bg4' }}
          {...rest}
        />
      </Tooltip>
    );
  }
);
