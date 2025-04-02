import { Button, ButtonProps } from '@/ui/Button';
import { Icon, IconButtonProps, IconProps, useClipboard } from '@chakra-ui/react';
import { Check, CopySimple } from '@phosphor-icons/react';
import { useMemo } from 'react';

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

export type ExtendedIconProps = Omit<IconProps, '_hover'> & {
  _hover?: ((copied: boolean) => IconProps['_hover']) | IconProps['_hover'];
};

export type ExtendedButtonProps = Omit<ButtonProps, '_hover'> & {
  _hover?: ((copied: boolean) => ButtonProps['_hover']) | ButtonProps['_hover'];
};

export const CopyButtonRedesign = ({
  initialValue,
  buttonProps,
  iconProps,
}: {
  initialValue: string;
  iconProps?: ExtendedIconProps;
  buttonProps?: ExtendedButtonProps;
}) => {
  const { copied, copy } = useClipboard({
    value: initialValue,
    timeout: 750,
  });
  const processedIconProps = useMemo(() => {
    const processedIconProps = { ...iconProps };
    if (iconProps && '_hover' in iconProps && typeof iconProps._hover === 'function') {
      processedIconProps._hover = iconProps._hover(copied);
    }
    return processedIconProps as IconProps;
  }, [iconProps, copied]);
  const processedButtonProps = useMemo(() => {
    const processedButtonProps = { ...buttonProps };
    if (buttonProps && '_hover' in buttonProps && typeof buttonProps._hover === 'function') {
      processedButtonProps._hover = buttonProps._hover(copied);
    }
    return processedButtonProps as ButtonProps;
  }, [buttonProps, copied]);

  return (
    <Button
      onClick={() => copy()}
      variant="unstyled"
      bg={copied ? 'surfaceInvert' : 'transparent'}
      _groupHover={{ bg: copied ? 'surfaceInvert' : 'surfaceTertiary' }}
      _hover={{ bg: copied ? 'surfaceInvert' : 'surfaceFifth' }}
      borderRadius="redesign.sm"
      minWidth="0"
      h="fit-content"
      w="fit-content"
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...processedButtonProps}
    >
      <Icon
        color={copied ? 'iconInvert' : 'iconSecondary'}
        _hover={{ color: copied ? 'iconInvert' : 'iconPrimary' }}
        {...processedIconProps}
      >
        {copied ? <Check /> : <CopySimple />}
      </Icon>
    </Button>
  );
};

export const useCopyIcon = ({
  initialValue,
  iconProps,
}: {
  initialValue: string;
  iconProps?: IconProps;
}) => {
  const { copied, copy } = useClipboard({
    value: initialValue,
    timeout: 750,
  });
  const copyIcon = (
    <Icon
      color={copied ? 'iconInvert' : 'iconSecondary'}
      _hover={{ color: copied ? 'iconInvert' : 'iconPrimary' }}
      {...iconProps}
    >
      {copied ? <Check /> : <CopySimple />}
    </Icon>
  );
  return {
    copied,
    copy,
    copyIcon,
  };
};
