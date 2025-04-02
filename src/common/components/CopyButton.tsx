import { Button } from '@/ui/Button';
import { Clipboard, Icon, IconButtonProps } from '@chakra-ui/react';
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
  height,
  width,
  color,
  ...rest
}: { initialValue: string; height: number; width: number; color: string } & IconButtonProps) => {
  return (
    <Clipboard.Root
      value={initialValue}
      p={0}
      m={0}
      h={height}
      w={width}
      minH={height}
      minW={width}
      maxH={height}
      maxW={width}
      border="none"
      borderRadius="none"
    >
      <Clipboard.Trigger asChild>
        <Button
          bg="transparent"
          p={0}
          m={0}
          h={height}
          w={width}
          minH={height}
          minW={width}
          maxH={height}
          maxW={width}
          border="none"
          borderRadius="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Clipboard.Indicator
            p={0}
            m={0}
            h={height}
            w={width}
            minH={height}
            minW={width}
            maxH={height}
            maxW={width}
            border="none"
            borderRadius="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
            copied={
              <Icon h={height} w={width} color={color}>
                <Check />
              </Icon>
            }
          >
            <Icon h={height} w={width} color={color}>
              <CopySimple />
            </Icon>
          </Clipboard.Indicator>
        </Button>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};
