import React from 'react';
import { Box, Flex, color, transition, FlexProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { blue, focusBlue } from '@components/button';

const DEFAULT_HEIGHT = 20;
const SMALL_HEIGHT = 12;

const getWidth = (height: number) => height * 1.8;
const getCircleSize = (height: number) => height * 0.7;

const numberToPxValue = (number: number) => `${number}px`;

const Switch = ({
  toggled,
  size = 'default',
}: {
  toggled: boolean;
  size?: 'small' | 'default';
}) => {
  const isSmall = size === 'small';
  const height = isSmall ? SMALL_HEIGHT : DEFAULT_HEIGHT;

  const circleSize = getCircleSize(height);

  const paddingDelta: number = isSmall ? 2 : 1;

  const px = numberToPxValue(height - getCircleSize(height));

  return (
    <Flex
      px={px}
      alignItems="center"
      width={numberToPxValue(getWidth(height))}
      borderRadius="24px"
      height={numberToPxValue(height)}
      transition={transition}
      position="relative"
    >
      <Box
        transform={toggled ? `translateX(${numberToPxValue(circleSize - paddingDelta)})` : 'none'}
        transition={transition}
        bg={color('bg')}
        size={circleSize}
        borderRadius="100%"
        position="relative"
        zIndex={2}
      />
      <Box
        opacity={toggled ? 1 : 0.5}
        left={0}
        top={0}
        borderRadius="24px"
        position="absolute"
        size="100%"
        bg={toggled ? blue() : color('text-caption')}
        zIndex={1}
      />
    </Flex>
  );
};

export const Toggle: React.FC<
  { label: string; value: boolean; size?: 'small' | 'default' } & FlexProps
> = ({ label, onClick, value, size = 'default', ...rest }) => {
  const toggled = value;
  const handleClick = (e: any) => {
    onClick?.(e);
  };
  return (
    <Flex
      _hover={{
        cursor: 'pointer',
      }}
      _focus={{
        filter: `drop-shadow(0 0 0 3px ${focusBlue(0.5)})`,
      }}
      justifyContent="flex-end"
      alignItems="center"
      onClick={handleClick}
      {...rest}
    >
      <Caption
        _hover={{
          cursor: 'pointer',
        }}
        fontWeight="500"
        color={color('text-body')}
        mr="tight"
        as="label"
      >
        {label}
      </Caption>
      <Switch size={size as any} toggled={toggled} />
    </Flex>
  );
};
