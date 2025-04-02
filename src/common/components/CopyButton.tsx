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
      borderRadius="none"
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
