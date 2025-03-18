import { truncateMiddle, truncateStxAddress, validateStacksAddress } from '@/common/utils/utils';
import { Field as ChakraField } from '@/components/ui/field';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Text } from '@/ui/Text';
import { Box, Flex, Stack } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

const TRUNCATE_THRESHOLD = 15;

export function AddressFilter({
  defaultToAddress = '',
  defaultFromAddress = '',
}: AddressFilterProps) {
  const [toAddress, setToAddress] = useState(defaultToAddress);
  const [fromAddress, setFromAddress] = useState(defaultFromAddress);

  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fromAddress = searchParams.get('fromAddress');
    const toAddress = searchParams.get('toAddress');
    setFromAddress(fromAddress || '');
    setToAddress(toAddress || '');
  }, [searchParams]);

  const triggerText =
    fromAddress || toAddress
      ? (open: boolean) => (
          <Flex gap={1.5}>
            {fromAddress && (
              <>
                <Text
                  textStyle="text-medium-sm"
                  color={open ? 'textPrimary' : 'textSecondary'}
                  _groupHover={{ color: 'textPrimary' }}
                >
                  From:
                </Text>
                <Text textStyle="text-medium-sm" color="textPrimary">
                  {validateStacksAddress(fromAddress)
                    ? truncateStxAddress(fromAddress)
                    : fromAddress.length > TRUNCATE_THRESHOLD
                      ? truncateMiddle(fromAddress, 4, 5)
                      : fromAddress}
                </Text>
              </>
            )}
            {toAddress && (
              <>
                <Text
                  textStyle="text-medium-sm"
                  color={open ? 'textPrimary' : 'textSecondary'}
                  _groupHover={{ color: 'textPrimary' }}
                >
                  To:
                </Text>
                <Text textStyle="text-medium-sm" color="textPrimary">
                  {validateStacksAddress(toAddress)
                    ? truncateStxAddress(toAddress)
                    : toAddress.length > TRUNCATE_THRESHOLD
                      ? truncateMiddle(toAddress, 4, 5)
                      : toAddress}
                </Text>
              </>
            )}
          </Flex>
        )
      : (open: boolean) => (
          <Text
            textStyle="text-medium-sm"
            color={open ? 'textPrimary' : 'textSecondary'}
            _groupHover={{ color: 'textPrimary' }}
          >
            From/To
          </Text>
        );

  return (
    <GooseNeckPopoverRoot
      id={'address-filter-popover'}
      positioning={{ placement: 'bottom-start' }}
      open={open}
      onOpenChange={e => {
        setOpen(e.open);
      }}
    >
      <GooseNeckPopoverTrigger open={open} triggerText={triggerText} />
      <GooseNeckPopoverContent maxW={'275px'} bgColor={'surfacePrimary'} placement="bottom-start">
        <Stack gap={2} p={4}>
          <Formik
            enableReinitialize
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              fromAddress,
              toAddress,
            }}
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
                        <Input
                          {...field}
                          variant="redesignPrimary"
                          placeholder="STX Address"
                          size="big"
                          autoComplete="off"
                          data-form-type="other"
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
