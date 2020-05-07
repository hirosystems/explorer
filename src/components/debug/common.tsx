import * as React from 'react';
import {
  Input as InputBase,
  InputProps,
  FormLabel as FormLabelBase,
  FormLabelProps,
  Box,
  BoxProps,
  Flex,
  Stack,
} from '@blockstack/ui';
import { Field as FormikField, FieldProps, useField } from 'formik';

import { CodeEditor } from '@components/code-editor';
import { Meta } from '@components/meta-head';
import { Title, Text } from '@components/typography';
import { ExclamationMarkCircleIcon } from '@components/svg';
import { TransactionsCard } from '@components/debug/transactions-card';

import { useDebugState } from '@common/debug';

export const Input = (props: InputProps) => (
  <InputBase
    bg="var(--colors-bg-alt)"
    color="var(--colors-text-body)"
    borderColor="var(--colors-border)"
    _hover={{ borderColor: 'var(--colors-border)' }}
    _focus={{
      boxShadow: '0 0 0 1px rgba(170, 179, 255, 0.6)',
    }}
    {...props}
  />
);
export const FormLabel = (props: FormLabelProps) => (
  <FormLabelBase color="var(--colors-text-caption)" {...props} />
);

type InputType =
  | 'button'
  | 'checkbox'
  | 'code' // custom
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export const FieldBase = ({
  label,
  inputComponent,
  type,
  placeholder,
  ...rest
}: FieldProps &
  BoxProps & {
    inputComponent?: React.ReactNode;
    label: string | any;
    placeholder?: string | any;
    type: InputType;
  }) => {
  const Component = type === 'code' ? CodeEditor : Input;
  const [field, { touched, error }, helpers] = useField({ name: rest.field.name, ...rest } as any);

  const { onChange, ...fieldProps } = field;

  const handleChange = (value: string | React.FormEvent<HTMLFormElement>) => {
    type === 'code' ? helpers.setValue(value.toString().trim()) : onChange(value);
  };

  return (
    <Box {...rest}>
      {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
      <Component
        type={type === 'code' ? undefined : type}
        placeholder={placeholder}
        onChange={handleChange as any}
        {...fieldProps}
      />
      {touched && error}
    </Box>
  );
};

export const Field = ({ name, handleChange, value, ...props }: any) => (
  <FormikField name={name} {...props} component={FieldBase} />
);

const renderErrorMessage = ({
  reason,
  reason_data,
}: {
  reason: 'FeeTooLow' | 'NotEnoughFunds';
  reason_data: any;
}) => {
  switch (reason) {
    case 'FeeTooLow':
      return `Fee was too low, expected ${reason_data?.expected} uSTX.`;
    case 'NotEnoughFunds':
      return `Not enough funds at address provided, expected ${BigInt(
        reason_data?.expected
      ).toString()} uSTX.`;
  }
};

export const Error = ({ error: _error, ...rest }: any) => {
  const { error } = useDebugState();
  const hasError = error || _error;
  return hasError ? (
    <Flex
      p="base"
      borderRadius="6px"
      border="1px solid var(--colors-border)"
      align="center"
      color="#F9A14D"
      {...rest}
    >
      <Box mr="tight">
        <ExclamationMarkCircleIcon />
      </Box>
      <Box>
        {error ? (
          <Title as="h4" style={{ textTransform: 'capitalize' }}>
            {error?.error || error?.name}:{' '}
          </Title>
        ) : null}
        <Text pl="tight">{_error ? _error : error?.message || renderErrorMessage(error)}</Text>
      </Box>
    </Flex>
  ) : null;
};

export const Wrapper = ({
  title,
  children,
  loading,
  error,
  ...rest
}: { title: string; loading?: boolean; error?: string } & BoxProps) => {
  return (
    <>
      <Meta title={`${title} - Stacks Debugger`} />
      <Flex>
        <Box flexShrink={0} width="100%" maxWidth="60%" flexGrow={1} {...rest}>
          <Stack spacing="base">
            <Title as="h2">{title}</Title>
            <Error error={error} />
            {children}
          </Stack>
        </Box>
        <Box flexGrow={1} ml="base">
          <TransactionsCard width="100%" loading={loading} />
        </Box>
      </Flex>
    </>
  );
};
