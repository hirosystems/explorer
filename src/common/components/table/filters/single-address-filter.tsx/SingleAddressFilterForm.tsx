import { hasBnsExtension, validateStacksAddress } from '@/common/utils/utils';
import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Field, FieldInputProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

const AddressValidationSchema = Yup.object().shape({
  address: Yup.string().test(
    'valid-stacks-address',
    'Invalid Stacks address',
    value => !value || validateStacksAddress(value) || hasBnsExtension(value)
  ),
});

const AddressFilterField = ({
  // TODO: shared with AddressFilterForm
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
  address: string;
}

export function SingleAddressFilterForm({
  defaultAddress = '',
  onSubmit,
}: {
  defaultAddress?: string;
  onSubmit?: (address: string) => void;
}) {
  const initialValues: FormValues = {
    address: defaultAddress,
  };

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={AddressValidationSchema}
      initialValues={initialValues}
      onSubmit={({ address }) => {
        onSubmit?.(address);
      }}
    >
      {({ isValidating }) => (
        <Form>
          <Field name="address">
            {({ field, form }: FieldProps<string, FormValues>) => (
              <AddressFilterField field={field} form={form} label="Address:" />
            )}
          </Field>

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
