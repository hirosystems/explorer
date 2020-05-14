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
import { Alert } from '@components/alert';
import { CodeEditor } from '@components/code-editor';
import { Meta } from '@components/meta-head';
import { Title } from '@components/typography';

export const Input = (props: InputProps) => (
  <InputBase
    bg="transparent"
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
  touched,
  error,
  value,
  name,
  list,
  datalist,
  onChange,
  multiple,
  checked,
  onBlur,
  ...rest
}: {
  inputComponent?: React.ReactNode;
  label: string | any;
  placeholder?: string | any;
  type: InputType;
  field?: FieldProps['field'];
  onChange?: any;
  touched?: boolean;
  error?: string;
  value?: string;
  name: string;
  datalist?: string[];
  list?: string;
  multiple?: any;
  checked?: any;
  onBlur?: any;
}) => {
  // @ts-ignore

  return (
    <Box {...rest}>
      {label ? (
        <FormLabel mb="extra-tight" htmlFor={name}>
          {label}
        </FormLabel>
      ) : null}
      {type === 'code' ? (
        <CodeEditor name={name} value={value || ''} {...rest} />
      ) : (
        <>
          <Input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            list={list}
            id={name}
            onChange={onChange}
            multiple={multiple}
            onBlur={onBlur}
          />
          {list && datalist?.length ? (
            <datalist id={list}>
              {datalist.map(option => (
                <option value={option} key={option} />
              ))}
            </datalist>
          ) : null}
        </>
      )}
    </Box>
  );
};

const FieldForFormik = ({ label, type, ...rest }: any) => {
  const [field, { touched, error }, helpers] = useField({
    ...rest,
    name: rest.field.name,
  } as any);

  const { onChange, ...fieldProps } = field;

  const handleChange = (value: string | React.FormEvent<HTMLFormElement>) => {
    type === 'code' ? helpers.setValue(value.toString().trim()) : onChange(value);
  };

  return (
    <FieldBase
      label={label}
      type={type}
      onChange={handleChange}
      touched={touched}
      error={error}
      {...rest}
      {...fieldProps}
    />
  );
};

export const Field = ({ name, value, ...props }: any) => (
  <FormikField name={name} {...props} component={FieldForFormik} />
);

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
        <Box flexShrink={0} width="100%" flexGrow={1} {...rest}>
          <Stack spacing="base">
            <Title as="h2">{title}</Title>
            <Alert error={error} />
            {children}
          </Stack>
        </Box>
      </Flex>
    </>
  );
};
