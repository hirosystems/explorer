import { Box, Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowDownRight, ArrowUpRight, CaretDown } from '@phosphor-icons/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { truncateMiddle } from '../../../common/utils/utils';
import { Field as ChakraField } from '../../../components/ui/field';
import { PopoverContent, PopoverRoot, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../ui/Button';
import { ExpandingTextarea } from '../../../ui/ExpandingTextarea';
import { Text } from '../../../ui/Text';

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
    fromAddress: defaultFromAddress,
    toAddress: defaultToAddress,
  };
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <PopoverRoot
      id={'address-filter-popover'}
      positioning={{ placement: 'bottom-start' }}
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          fontSize={'sm'}
          rightIcon={
            <Icon h={3.5} w={3.5} style={{ strokeWidth: '2px' }}>
              <CaretDown />
            </Icon>
          }
          height={9}
          color={'textSubdued'}
        >
          <Flex gap={0.5}>
            {!!defaultToAddress || !!defaultFromAddress ? (
              <Text display={['none', 'none', 'inline']}>
                Sent/Received{defaultToAddress || defaultFromAddress ? ':' : ''}
              </Text>
            ) : (
              <Text>Sent/Received</Text>
            )}
            {!!defaultFromAddress && (
              <Flex alignItems={'center'} color={'text'}>
                <Icon h={3} w={3}>
                  <ArrowDownRight />
                </Icon>
                <Text>
                  {defaultFromAddress.length > 10
                    ? truncateMiddle(defaultFromAddress, 3)
                    : defaultFromAddress}
                </Text>
              </Flex>
            )}
            {!!defaultFromAddress && !!defaultToAddress && (
              <Text color={'text'} fontSize={'sm'}>
                -
              </Text>
            )}
            {!!defaultToAddress && (
              <Flex alignItems={'center'} color={'text'}>
                <Icon h={3} w={3}>
                  <ArrowUpRight />
                </Icon>
                <Text>
                  {defaultToAddress.length > 10
                    ? truncateMiddle(defaultToAddress, 3)
                    : defaultToAddress}
                </Text>
              </Flex>
            )}
          </Flex>
        </Button>
      </PopoverTrigger>
      <PopoverContent maxWidth={'275px'} bgColor={'surface'}>
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
                        label="From:"
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
                        label="To:"
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
                    width="100%"
                    type="submit"
                    fontSize={'sm'}
                    variant={'secondary'}
                    height={10}
                    color="textSubdued"
                  >
                    Apply
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Stack>
      </PopoverContent>
    </PopoverRoot>
  );
}
