import { Field as CUIField, Fieldset, Popover, useDisclosure } from '@chakra-ui/react';
import { ArrowDownRight, ArrowUpRight, CaretDown } from '@phosphor-icons/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';

import { truncateMiddle } from '../../../common/utils/utils';
import { Box } from '../../../ui/Box';
import { Button } from '../../../ui/Button';
import { ExpandingTextarea } from '../../../ui/ExpandingTextarea';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
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

  const { onOpen, onClose, open } = useDisclosure();
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Popover.Root
      positioning={{ placement: 'bottom-start' }}
      open={open}
      onOpenChange={onOpen}
      onExitComplete={onClose}
    >
      <Popover.Trigger>
        <Button
          variant="secondary"
          fontSize={'sm'}
          rightIcon={
            <Icon size={3.5} style={{ strokeWidth: '2px' }}>
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
                <Icon size={3}>
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
                <Icon size={3}>
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
      </Popover.Trigger>
      <Popover.Content maxWidth={'275px'} bgColor={'surface'}>
        <Flex direction={'column'} gap={2} p={4}>
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
              onClose();
            }}
          >
            {({ isValidating }) => (
              <Form>
                <Stack gap={4}>
                  <Field name="fromAddress">
                    {(
                      { field, form }: FieldProps<string, FormValues> // TODO: upgrade to v3. This may be broken
                    ) => (
                      <Fieldset.Root>
                        <CUIField.Root>
                          <CUIField.Label>From:</CUIField.Label>
                          <CUIField.ErrorText>{form.errors.fromAddress}</CUIField.ErrorText>
                          <ExpandingTextarea
                            {...field} // TODO: upgrade to v3. This may be broken
                            placeholder="STX Address"
                            fontSize={'sm'}
                            css={{
                              '::placeholder': {
                                color: 'textSubdued',
                              },
                            }}
                          />
                        </CUIField.Root>
                      </Fieldset.Root>
                    )}
                  </Field>
                  <Field name="toAddress">
                    {({ field, form }: FieldProps<string, FormValues>) => (
                      <Fieldset.Root>
                        <CUIField.Root>
                          <CUIField.Label>To:</CUIField.Label>
                          <CUIField.ErrorText>{form.errors.toAddress}</CUIField.ErrorText>
                          <ExpandingTextarea
                            {...field} // TODO: upgrade to v3. This may be broken
                            placeholder="STX Address"
                            fontSize={'sm'}
                            css={{
                              '::placeholder': {
                                color: 'textSubdued',
                              },
                            }}
                          />
                        </CUIField.Root>
                      </Fieldset.Root>
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
      </Popover.Content>
    </Popover.Root>
  );
}
