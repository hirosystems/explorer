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
  Transition,
  ChevronIcon,
} from '@blockstack/ui';
import { Field as FormikField, FieldProps, useField } from 'formik';
import { Alert } from '@components/alert';
import { CodeEditor } from '@components/code-editor';
import { Meta } from '@components/meta-head';
import { Caption, Title } from '@components/typography';
import { Ref } from 'react';

export const Input = React.forwardRef((props: InputProps, ref) => (
  <InputBase
    bg="transparent"
    color="var(--colors-text-body)"
    borderColor="var(--colors-border)"
    _hover={{ borderColor: 'var(--colors-border)' }}
    _focus={{
      boxShadow: '0 0 0 1px rgba(170, 179, 255, 0.6)',
    }}
    ref={ref}
    {...props}
  />
));
export const FormLabel = (props: FormLabelProps) => (
  <FormLabelBase color="var(--colors-text-caption)" {...props} />
);

type InputType =
  | 'button'
  | 'checkbox'
  | 'code' // custom
  | 'textarea' // custom
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

interface FieldBaseProps extends Partial<BoxProps> {
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
}

export const FieldBase = React.forwardRef(
  (
    {
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
      maxHeight,
      ...rest
    }: FieldBaseProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const textAreaProps =
      type === 'textarea'
        ? {
            as: type,
            minHeight: '200px',
          }
        : {};

    return (
      <Box {...rest}>
        {label ? (
          <FormLabel mb="extra-tight" htmlFor={name}>
            {label}
          </FormLabel>
        ) : null}
        {type === 'code' ? (
          <CodeEditor
            name={name}
            value={value || ''}
            onChange={onChange}
            id={name}
            // @ts-ignore
            onBlur={onBlur}
            ref={ref}
            maxHeight={maxHeight}
            {...rest}
          />
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
              ref={ref}
              {...textAreaProps}
              maxHeight={maxHeight}
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
  }
);

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
  isVisible,
  clearError,
  back,
  ...rest
}: {
  title: string;
  loading?: boolean;
  error?: string;
  isVisible: boolean;
  clearError?: () => void;
  back?: {
    onClick: () => void;
    label: string;
  };
} & BoxProps) => {
  return (
    <Transition
      styles={{
        init: {
          width: '100%',
          opacity: 0,
          position: 'absolute',
          transform: 'translateY(5px)',
        },
        entered: {
          width: '100%',
          opacity: 1,
          position: 'relative',
          transform: 'none',
        },
        exiting: {
          width: '100%',
          opacity: 0,
          position: 'absolute',
          transform: 'translateY(10px)',
        },
      }}
      in={isVisible}
    >
      {styles => (
        <>
          <Meta title={`${title} - Stacks Sandbox`} />
          <Flex
            style={{
              willChange: 'transform, opacity',
              ...styles,
            }}
          >
            <Box flexShrink={0} width="100%" flexGrow={1} {...rest}>
              <Stack spacing="base-loose">
                <Box>
                  <Title as="h2">{title}</Title>
                  {back ? (
                    <Flex
                      _hover={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      mt="tight"
                      align="center"
                      onClick={back.onClick}
                    >
                      <ChevronIcon
                        color="var(--colors-text-caption)"
                        direction="left"
                        size="18px"
                      />
                      <Caption
                        _hover={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: 'var(--colors-invert)',
                        }}
                      >
                        {back.label}
                      </Caption>
                    </Flex>
                  ) : null}
                </Box>
                <Alert clearError={clearError} error={error} />
                {children}
              </Stack>
            </Box>
          </Flex>
        </>
      )}
    </Transition>
  );
};
