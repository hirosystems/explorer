import { useClipboard } from '@chakra-ui/react';
import { CopySimple } from '@phosphor-icons/react';
import { FC, memo } from 'react';

import { IconButton, IconButtonProps } from '../../ui/IconButton';
import { Tooltip } from '../../ui/Tooltip';

export const CopyButton: FC<IconButtonProps & { initialValue: string }> = memo(
  ({ initialValue, ...rest }) => {
    const { setValue: onCopy, copied } = useClipboard({ value: initialValue }); // TODO: this may be broken
    return (
      <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
        <IconButton
          onClick={() => onCopy(initialValue)}
          height={'auto'}
          _focus={{ background: 'none' }}
          _hover={{ background: 'bg4' }}
          {...rest}
        >
          <CopySimple strokeWidth={1.75} size={'20px'} />
        </IconButton>
      </Tooltip>
    );
  }
);
