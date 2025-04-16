import { validateBnsName, validateStacksAddress } from '@/common/utils/utils';
import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { Field, FieldInputProps, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';

interface AddressFilterProps {
  defaultFromAddress?: string;
  defaultToAddress?: string;
  onSubmit?: (values: FormValues) => void;
}

interface FormValues {
  fromAddress: string;
  toAddress: string;
}

export const getAddressFilterParams = (
  searchParams: URLSearchParams,
  fromAddress: string,
  toAddress: string
) => {
  if (!fromAddress) {
    searchParams.delete('fromAddress');
  } else {
    searchParams.set('fromAddress', fromAddress);
  }
  if (!toAddress) {
    searchParams.delete('toAddress');
  } else {
    searchParams.set('toAddress', toAddress);
  }
  return searchParams;
};

export function useAddressFilterSubmitHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return async ({ fromAddress, toAddress }: FormValues) => {
    const params = new URLSearchParams(searchParams);
    const paramsWithAddressFilter = getAddressFilterParams(params, fromAddress, toAddress);
    router.push(`?${paramsWithAddressFilter.toString()}`, { scroll: false });
  };
}

const AddressValidationSchema = Yup.object().shape({
  fromAddress: Yup.string().test(
    'valid-stacks-address',
    'Invalid Stacks address',
    value => !value || validateStacksAddress(value) || validateBnsName(value)
  ),
  toAddress: Yup.string().test(
    'valid-stacks-address',
    'Invalid Stacks address',
    value => !value || validateStacksAddress(value) || validateBnsName(value)
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

export function AddressFilterForm({
  defaultToAddress = '',
  defaultFromAddress = '',
  onSubmit,
}: AddressFilterProps) {
  const onAddressFilterSubmitHandler = useAddressFilterSubmitHandler();

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={AddressValidationSchema}
      initialValues={{
        fromAddress: defaultFromAddress,
        toAddress: defaultToAddress,
      }}
      onSubmit={async ({ fromAddress, toAddress }) => {
        onAddressFilterSubmitHandler({ fromAddress, toAddress });
        onSubmit?.({ fromAddress, toAddress });
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
