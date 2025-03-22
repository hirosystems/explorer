import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Stack } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';

import { useTxTableFilters } from '../TxTableFilterContext';

interface AddressFilterProps {
  defaultFromAddress?: string;
  defaultToAddress?: string;
  onSubmit?: (values: FormValues) => void;
}

interface FormValues {
  fromAddress: string;
  toAddress: string;
}

export function useAddressFilterSubmitHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return async ({ fromAddress, toAddress }: FormValues) => {
    const params = new URLSearchParams(searchParams);
    if (!fromAddress) {
      params.delete('fromAddress');
    } else {
      params.set('fromAddress', fromAddress);
    }
    if (!toAddress) {
      params.delete('toAddress');
    } else {
      params.set('toAddress', toAddress);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };
}

export function AddressFilterForm({
  defaultToAddress = '',
  defaultFromAddress = '',
  onSubmit,
}: AddressFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onAddressFilterSubmitHandler = useAddressFilterSubmitHandler();

  const { updateAddressFilters } = useTxTableFilters() || {}; // This is for the mobile apply button design
  const hideApplyButton = !!updateAddressFilters;

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
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
                    }}
                  />
                </ChakraField>
              )}
            </Field>
          </Stack>
          {!hideApplyButton && (
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
          )}
        </Form>
      )}
    </Formik>
  );
}
