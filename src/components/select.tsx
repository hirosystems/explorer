import * as React from 'react';
import { Box, BoxProps, Flex, ChevronIcon, Input } from '@stacks/ui';
import { FormikHelpers, useField } from 'formik';
import { Popover } from '@components/popover/popover';
import { FieldBase } from '@components/sandbox/common';

interface SelectProps extends BoxProps {
  onItemClick?: (value: string) => void;
  name: string;
  options: {
    label: string;
    value: any;
    key: number;
  }[];
  label: string;
}
export const Select = ({ name, options, onItemClick, label, ...rest }: SelectProps) => {
  const [index, setIndex] = React.useState(0);
  const selectedOption = options[index];

  const handleValueClick = ({ key }: { value: string; key: number }) => {
    setIndex(key);
    onItemClick && onItemClick?.(options[key].value);
  };

  const ref = React.useRef(null);

  const isInFocus = ref?.current === (typeof document !== 'undefined' && document?.activeElement);

  return (
    <Box color="#a7a7ad" {...rest}>
      <Popover showOnClickOrFocus onItemClick={handleValueClick} items={options} triggerRef={ref}>
        <Flex
          alignItems="center"
          _hover={{ cursor: 'pointer' }}
          pointerEvents="none"
          position="relative"
        >
          <Input
            width="100%"
            backgroundColor="ink"
            borderColor="rgb(39, 41, 46)"
            color="#a7a7ad"
            as="input"
            type="text"
            value={selectedOption.label}
            name={name}
            ref={ref}
            style={{ pointerEvents: 'none' }}
            pointerEvents="none"
            pr="40px"
          />
          <Flex
            color="currentColor"
            p="base"
            alignItems="center"
            position="absolute"
            bottom="0"
            right={0}
            height="100%"
          >
            <ChevronIcon size="22px" direction={isInFocus ? 'up' : 'down'} />
          </Flex>
        </Flex>
      </Popover>
    </Box>
  );
};
