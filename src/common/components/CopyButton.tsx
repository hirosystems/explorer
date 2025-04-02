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

<<<<<<< HEAD
export const CopyButtonRedesign = ({
  initialValue,
  height,
  width,
  color,
  ...rest
}: { initialValue: string; height: number; width: number; color: string } & IconButtonProps) => {
=======
export const CopyButtonNew = ({
  initialValue,
  ...rest
}: { initialValue: string } & IconButtonProps) => {
  const { height, width, h, w, color } = rest;
  const heightValue = h || height;
  const widthValue = w || width;
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
  return (
    <Clipboard.Root
      value={initialValue}
      p={0}
      m={0}
<<<<<<< HEAD
      h={height}
      w={width}
      minH={height}
      minW={width}
      maxH={height}
      maxW={width}
=======
      h={heightValue}
      w={widthValue}
      minH={heightValue}
      minW={widthValue}
      maxH={heightValue}
      maxW={widthValue}
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
      border="none"
      borderRadius="none"
    >
      <Clipboard.Trigger asChild>
        <Button
          bg="transparent"
          p={0}
          m={0}
<<<<<<< HEAD
          h={height}
          w={width}
          minH={height}
          minW={width}
          maxH={height}
          maxW={width}
=======
          h={heightValue}
          w={widthValue}
          minH={heightValue}
          minW={widthValue}
          maxH={heightValue}
          maxW={widthValue}
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
          border="none"
          borderRadius="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Clipboard.Indicator
            p={0}
            m={0}
<<<<<<< HEAD
            h={height}
            w={width}
            minH={height}
            minW={width}
            maxH={height}
            maxW={width}
=======
            h={heightValue}
            w={widthValue}
            minH={heightValue}
            minW={widthValue}
            maxH={heightValue}
            maxW={widthValue}
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
            border="none"
            borderRadius="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
            copied={
<<<<<<< HEAD
              <Icon h={height} w={width} color={color}>
=======
              <Icon h={heightValue} w={widthValue} color={color}>
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
                <Check />
              </Icon>
            }
          >
<<<<<<< HEAD
            <Icon h={height} w={width} color={color}>
=======
            <Icon h={heightValue} w={widthValue} color={color}>
>>>>>>> d30c5ecb (feat: first draft of the token transfer id page)
              <CopySimple />
            </Icon>
          </Clipboard.Indicator>
        </Button>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};
