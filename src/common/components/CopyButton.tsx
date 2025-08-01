import { Button, ButtonProps } from '@/ui/Button';
import { Icon, IconButtonProps, IconProps, useClipboard } from '@chakra-ui/react';
import { Check, CopySimple } from '@phosphor-icons/react';

import { ClipboardIconButton, ClipboardRoot } from '../../components/ui/clipboard';

export const CopyButton = ({
  initialValue,
  ...rest
}: { initialValue: string } & IconButtonProps) => {
  return (
    <ClipboardRoot value={initialValue} timeout={750}>
      <ClipboardIconButton bg="transparent" h={5} w={5} {...rest} />
    </ClipboardRoot>
  );
};

export const CopyButtonRedesign = ({
  initialValue,
  buttonProps,
  iconProps,
}: {
  initialValue: string;
  iconProps?: IconProps;
  buttonProps?: ButtonProps;
}) => {
  const { copied, copy } = useClipboard({
    value: initialValue,
    timeout: 750,
  });
  return (
    <Button
      onClick={() => copy()}
      variant="unstyled"
      bg={copied ? 'surfaceInvert' : 'transparent'}
      _hover={{ bg: copied ? 'surfaceInvert' : 'surfaceFifth' }}
      _groupHover={{ bg: copied ? 'surfaceInvert' : 'surfaceTertiary' }}
      borderRadius="redesign.sm"
      minWidth="0"
      h="fit-content"
      w="fit-content"
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...buttonProps}
    >
      <Icon
        color={copied ? 'iconInvert' : 'iconSecondary'}
        _hover={{ color: copied ? 'iconInvert' : 'iconPrimary' }}
        {...iconProps}
      >
        {copied ? <Check /> : <CopySimple />}
      </Icon>
    </Button>
  );
};
