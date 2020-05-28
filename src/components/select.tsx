import * as React from 'react';
import { Box, BoxProps, Flex, ChevronIcon } from '@blockstack/ui';
import { FormikHelpers, useField } from 'formik';
import { Popover } from '@components/popover/popover';
import { FieldBase } from '@components/sandbox/common';

interface SelectProps extends BoxProps {
  setFieldValue?: FormikHelpers<any>['setFieldValue'];
  name: string;
  options: {
    label: string;
    value: any;
    key: number;
  }[];
  label: string;
}
export const Select = ({ name, options, label, ...rest }: SelectProps) => {
  const [index, setIndex] = React.useState(0);
  const selectedOption = options[index];
  const [field, { touched, error }, helpers] = useField({
    ...rest,
    name,
  } as any);

  const handleValueClick = React.useCallback(({ key }: { value: string; key: number }) => {
    setIndex(key);
    helpers.setValue(options[key].value);
  }, []);

  const ref = React.useRef(null);

  const isInFocus = ref?.current === (typeof document !== 'undefined' && document?.activeElement);

  return (
    <Box {...rest}>
      <Popover showOnClickOrFocus onItemClick={handleValueClick} items={options} triggerRef={ref}>
        <Box _hover={{ cursor: 'pointer' }} position="relative">
          <FieldBase
            label={label}
            type="text"
            value={selectedOption.label}
            name={name}
            ref={ref}
            style={{ pointerEvents: 'none' }}
          />
          <Flex
            color="var(--colors-invert)"
            p="base"
            pt="40px"
            alignItems="center"
            position="absolute"
            bottom="0"
            right={0}
            height="100%"
          >
            <ChevronIcon size="22px" direction={isInFocus ? 'up' : 'down'} />
          </Flex>
        </Box>
      </Popover>
    </Box>
  );
};
