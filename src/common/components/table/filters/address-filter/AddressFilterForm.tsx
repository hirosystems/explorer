import { hasBnsExtension, validateStacksAddress } from '@/common/utils/utils';
import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { Field, FieldInputProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

const AddressValidationSchema = Yup.object().shape({
  fromAddress: Yup.string().test(
    'valid-stacks-address',
    'Invalid Stacks address',
    value => !value || validateStacksAddress(value) || hasBnsExtension(value)
  ),
  toAddress: Yup.string().test(
    'valid-stacks-address',
    'Invalid Stacks address',
    value => !value || validateStacksAddress(value) || hasBnsExtension(value)
  ),
});

const AddressFilterField = ({
  field,
  form,
  label,
}: {
  field: FieldInputProps<string>;
  form: FormikProps<FormValues>;
  label: string;
}) => {
  return (
    <ChakraField
      invalid={!!form.errors[field.name as keyof FormValues]}
      errorText={form.errors[field.name as keyof FormValues]}
      label={
        <Text textStyle="text-medium-xs" color="textSecondary">
          {label}
        </Text>
      }
    >
      <Input
        {...field}
        variant="redesignPrimary"
        placeholder="STX Address"
        size="big"
        autoComplete="off"
        data-form-type="other"
        data-disable-extensions="true"
        minW={40}
      />
    </ChakraField>
  );
};

interface FormValues {
  fromAddress: string;
  toAddress: string;
}

export function AddressFilterForm({
  defaultToAddress = '',
  defaultFromAddress = '',
  onSubmit,
}: {
  defaultFromAddress?: string;
  defaultToAddress?: string;
  onSubmit?: (fromAddress: string, toAddress: string) => void;
}) {
  const initialValues: FormValues = {
    fromAddress: defaultFromAddress,
    toAddress: defaultToAddress,
  };

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={AddressValidationSchema}
      initialValues={initialValues}
      onSubmit={({ fromAddress, toAddress }) => {
        onSubmit?.(fromAddress, toAddress);
      }}
    >
      {({ isValidating }) => (
        <Form>
          <Stack gap={4}>
            <Field name="fromAddress">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <AddressFilterField field={field} form={form} label="From:" />
              )}
            </Field>
            <Field name="toAddress">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <AddressFilterField field={field} form={form} label="To:" />
              )}
            </Field>
          </Stack>
          <Button
            isLoading={isValidating}
            width="full"
            type="submit"
            size={'small'}
            variant={'redesignSecondary'}
            mt={4}
          >
            Apply
          </Button>
        </Form>
      )}
    </Formik>
  );
}
