import { useClipboard } from '@chakra-ui/react';
import { CopySimple } from '@phosphor-icons/react';
import { FC, memo } from 'react';

import { IconButton, IconButtonProps } from '../../ui/IconButton';
import { Tooltip } from '../../ui/Tooltip';

export const CopyButton: FC<IconButtonProps & { initialValue: string }> = memo(
  ({ initialValue, ...rest }) => {
    const { onCopy, hasCopied } = useClipboard(initialValue);
    return (
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'}>
        <IconButton
          icon={<CopySimple strokeWidth={1.75} size={'20px'} />}
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
