import { useClipboard } from '@chakra-ui/react';

import { memo } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { IconButton, IconButtonProps, Tooltip } from '@/ui/components';

export const CopyButton = memo(
  ({ initialValue, ...rest }: IconButtonProps & { initialValue: string }) => {
    const { onCopy, hasCopied } = useClipboard(initialValue);
    return (
      <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'}>
        <IconButton
          icon={<AiOutlineCopy strokeWidth={1.75} size="20px" color="textBody" />}
          onClick={onCopy}
          height="auto"
          _focus={{ background: 'none' }}
          _hover={{ background: 'bg4' }}
          {...rest}
        />
      </Tooltip>
    );
  }
);
