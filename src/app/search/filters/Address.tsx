import { ArrowDownRight, ArrowUpRight, CaretDown } from '@phosphor-icons/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';

import { truncateMiddle } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { ExpandingTextarea } from '../../../ui/ExpandingTextarea';
import { Flex } from '../../../ui/Flex';
import { FormControl } from '../../../ui/FormControl';
import { FormLabel } from '../../../ui/FormLabel';
import { Icon } from '../../../ui/Icon';
import { Popover } from '../../../ui/Popover';
import { PopoverContent } from '../../../ui/PopoverContent';
import { PopoverTrigger } from '../../../ui/PopoverTrigger';
import { Stack } from '../../../ui/Stack';
import { Text } from '../../../ui/Text';
import { useDisclosure } from '../../../ui/hooks/useDisclosure';

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
  const { onOpen, onClose, isOpen } = useDisclosure();
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Popover placement={'bottom-start'} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          variant={'secondary'}
          fontSize={'sm'}
          rightIcon={<Icon as={CaretDown} style={{ strokeWidth: '2px' }} />}
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
                <Icon as={ArrowDownRight} size={3} />
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
                <Icon as={ArrowUpRight} size={3} />
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
        <Flex direction={'column'} gap={2} p={4}>
          <Formik
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
              onClose();
            }}
          >
            {({ isValidating }) => (
              <Form>
                <Stack gap={4}>
                  <Field name="fromAddress">
                    {({ field, form }: FieldProps<string, FormValues>) => (
                      <FormControl>
                        <FormLabel>From:</FormLabel>
                        <ExpandingTextarea
                          {...field}
                          placeholder="STX Address"
                          fontSize={'sm'}
                          sx={{
                            '::placeholder': {
                              color: 'textSubdued',
                            },
                          }}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="toAddress">
                    {({ field, form }: FieldProps<string, FormValues>) => (
                      <FormControl>
                        <FormLabel>To:</FormLabel>
                        <ExpandingTextarea
                          {...field}
                          placeholder="STX Address"
                          fontSize={'sm'}
                          sx={{
                            '::placeholder': {
                              color: 'textSubdued',
                            },
                          }}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Box mt={'16px'}>
                  <Button
                    isLoading={isValidating}
                    width="100%"
                    type="submit"
                    fontSize={'sm'}
                    variant={'secondary'}
                    height={'40px'}
                    color="textSubdued"
                  >
                    Apply
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
