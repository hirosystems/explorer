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
import { Field as FormikField, FieldProps, FormikHelpers, useField } from 'formik';
import { Alert } from '@components/alert';
import { CodeEditor } from '@components/code-editor';
import { Meta } from '@components/meta-head';
import { Caption, Title } from '@components/typography';
import { Ref } from 'react';
import { Popover } from '@components/popover/popover';

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
  subtitle,
  ...rest
}: {
  title: string;
  loading?: boolean;
  error?: string;
  isVisible: boolean;
  clearError?: () => void;
  subtitle?: {
    onClick: () => void;
    label: string;
    icon?: any;
  };
} & BoxProps) => {
  const SubtitleIcon = () =>
    <ChevronIcon color="var(--colors-text-caption)" direction="left" size="18px" /> ||
    subtitle?.icon;
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
                  {subtitle ? (
                    <Flex
                      _hover={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      mt="tight"
                      align="center"
                      onClick={subtitle.onClick}
                    >
                      <Caption
                        _hover={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: 'var(--colors-invert)',
                        }}
                      >
                        {subtitle.label}
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
export const Select = React.memo(({ name, options, label, ...rest }: SelectProps) => {
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

  return (
    <Box {...rest}>
      <Popover onItemClick={handleValueClick} items={options} triggerRef={ref}>
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
            <ChevronIcon size="22px" direction="down" />
          </Flex>
        </Box>
      </Popover>
    </Box>
  );
});
