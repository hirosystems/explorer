import { Field as ChakraField } from '@/components/ui/field';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';

import { useTxTableFilters } from '../../TxTableFilterContext';

interface AddressFilterProps {
  defaultFromAddress?: string;
  defaultToAddress?: string;
}

interface FormValues {
  fromAddress: string;
  toAddress: string;
}

export function AddressFilterFormMobile({
  defaultToAddress = '',
  defaultFromAddress = '',
}: AddressFilterProps) {
  const { updateAddressFilters } = useTxTableFilters() || {};

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        fromAddress: defaultFromAddress,
        toAddress: defaultToAddress,
      }}
      onSubmit={() => {}}
    >
      {({}) => (
        <Form>
          <Stack gap={4}>
            <Field name="fromAddress">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  invalid={!!form.errors.fromAddress}
                  errorText={form.errors.fromAddress}
                  label={
                    <Text textStyle="text-medium-xs" color="textSecondary">
                      From:
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
                    onChange={e => {
                      updateAddressFilters?.({
                        fromAddress: e.target.value,
                        toAddress: form.values.toAddress,
                      });
                      form.setFieldValue('fromAddress', e.target.value);
                    }}
                  />
                </ChakraField>
              )}
            </Field>
            <Field name="toAddress">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  invalid={!!form.errors.toAddress}
                  errorText={form.errors.toAddress}
                  label={
                    <Text textStyle="text-medium-xs" color="textSecondary">
                      To:
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
                    onChange={e => {
                      updateAddressFilters?.({
                        fromAddress: form.values.fromAddress,
                        toAddress: e.target.value,
                      });
                      form.setFieldValue('toAddress', e.target.value);
                    }}
                  />
                </ChakraField>
              )}
            </Field>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
