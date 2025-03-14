import { Box, PopoverRootProps, Stack } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Field as ChakraField } from '../../../components/ui/field';
import { Button } from '../../../ui/Button';
import { ExpandingTextarea } from '../../../ui/ExpandingTextarea';
import { Text } from '../../../ui/Text';
import {
  GooseNeckPopoverContent,
  GooseNeckPopoverRoot,
  GooseNeckPopoverTrigger,
} from '../GooseNeckPopover';

interface AddressFilterProps {
  defaultFromAddress?: string;
  defaultToAddress?: string;
}

interface FormValues {
  fromAddress: string;
  toAddress: string;
}

export function AddressFilter({
  defaultToAddress = '',
  defaultFromAddress = '',
}: AddressFilterProps) {
  const initialValues: FormValues = {
    // TODO: why can't I just collect these values from the search params
    fromAddress: defaultFromAddress,
    toAddress: defaultToAddress,
  };
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <GooseNeckPopoverRoot
      id={'address-filter-popover'}
      positioning={{ placement: 'bottom-start' }}
      open={open}
      onOpenChange={e => {
        setOpen(e.open);
      }}
    >
      <GooseNeckPopoverTrigger
        asChild
        open={open}
        gooseNeckHeight={9}
        gooseNeckAdjustment={0}
        placement="bottom-start"
      >
        <Text textStyle="text-medium-sm">From/To</Text>
      </GooseNeckPopoverTrigger>
      <GooseNeckPopoverContent maxW={'275px'} bgColor={'surfacePrimary'} placement="bottom-start">
        <Stack gap={2} p={4}>
          <Formik
            enableReinitialize
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initialValues}
            onSubmit={async ({ fromAddress, toAddress }) => {
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
              setOpen(false);
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
                        <ExpandingTextarea
                          {...field}
                          placeholder="STX Address"
                          fontSize={'sm'}
                          css={{
                            '::placeholder': {
                              color: 'textSubdued',
                            },
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
                        <ExpandingTextarea
                          {...field}
                          placeholder="STX Address"
                          fontSize={'sm'}
                          css={{
                            '::placeholder': {
                              color: 'textSubdued',
                            },
                          }}
                        />
                      </ChakraField>
                    )}
                  </Field>
                </Stack>
                <Box mt={4}>
                  <Button
                    isLoading={isValidating}
                    width="full"
                    type="submit"
                    size={'small'}
                    variant={'redesignSecondary'}
                  >
                    Apply
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Stack>
      </GooseNeckPopoverContent>
    </GooseNeckPopoverRoot>
  );
}
