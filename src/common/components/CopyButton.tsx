import { Button, ButtonProps } from '@/ui/Button';
import { Clipboard, Icon, IconButtonProps, IconProps, useClipboard } from '@chakra-ui/react';
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

export const CopyButtonNew = ({
  initialValue,
  ...rest
}: { initialValue: string } & IconButtonProps) => {
  const { height, width, h, w, color } = rest;
  const heightValue = h || height;
  const widthValue = w || width;
  return (
    <Clipboard.Root
      value={initialValue}
      p={0}
      m={0}
      h={heightValue}
      w={widthValue}
      minH={heightValue}
      minW={widthValue}
      maxH={heightValue}
      maxW={widthValue}
      border="none"
      borderRadius="redesign.sm"
    >
      <Clipboard.Trigger asChild>
        <Button
          bg="transparent"
          p={0}
          m={0}
          h={heightValue}
          w={widthValue}
          minH={heightValue}
          minW={widthValue}
          maxH={heightValue}
          maxW={widthValue}
          border="none"
          borderRadius="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Clipboard.Indicator
            p={0}
            m={0}
            h={heightValue}
            w={widthValue}
            minH={heightValue}
            minW={widthValue}
            maxH={heightValue}
            maxW={widthValue}
            border="none"
            borderRadius="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
            copied={
              <Icon h={heightValue} w={widthValue} color={color}>
                <Check />
              </Icon>
            }
          >
            <Icon h={heightValue} w={widthValue} color={color}>
              <CopySimple />
            </Icon>
          </Clipboard.Indicator>
        </Button>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};

export const CopyButton2 = ({
  initialValue,
  buttonProps,
  iconProps,
}: {
  initialValue: string;
  iconProps: IconProps;
  buttonProps: ButtonProps;
}) => {
  const { copied, value, setValue, copy } = useClipboard({
    value: initialValue,
    timeout: 750,
  });
  return (
    <Button
      onClick={() => copy()}
      variant="unstyled"
      {...buttonProps}
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
    >
      <Icon
        {...iconProps}
        color={copied ? 'iconInvert' : 'iconSecondary'}
        _hover={{ color: copied ? 'iconInvert' : 'iconPrimary' }}
      >
        {copied ? <Check /> : <CopySimple />}
      </Icon>
    </Button>
  );
};
