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

type CustomProps<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: ((copied: boolean) => T[P]) | T[P];
};

export type ExtendedIconProps = CustomProps<IconProps, '_hover' | '_groupHover' | 'color'>;
export type ExtendedButtonProps = CustomProps<ButtonProps, '_hover' | '_groupHover' | 'bg'>;

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
    if (iconProps && '_groupHover' in iconProps && typeof iconProps._groupHover === 'function') {
      processedIconProps._groupHover = iconProps._groupHover(copied);
    }
    if (iconProps && 'color' in iconProps && typeof iconProps.color === 'function') {
      processedIconProps.color = iconProps.color(copied);
    }
    return processedIconProps as IconProps;
  }, [iconProps, copied]);
  const processedButtonProps = useMemo(() => {
    const processedButtonProps = { ...buttonProps };
    if (buttonProps && '_hover' in buttonProps && typeof buttonProps._hover === 'function') {
      processedButtonProps._hover = buttonProps._hover(copied);
    }
    if (
      buttonProps &&
      '_groupHover' in buttonProps &&
      typeof buttonProps._groupHover === 'function'
    ) {
      processedButtonProps._groupHover = buttonProps._groupHover(copied);
    }
    if (buttonProps && 'bg' in buttonProps && typeof buttonProps.bg === 'function') {
      processedButtonProps.bg = buttonProps.bg(copied);
    }
    return processedButtonProps as ButtonProps;
  }, [buttonProps, copied]);

  return (
    <Button
      className="group"
      onClick={() => copy()}
      variant="unstyled"
      borderRadius="redesign.sm"
      minWidth="0"
      h="fit-content"
      w="fit-content"
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...processedButtonProps}
    >
      <Icon className="icon" {...processedIconProps}>
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
