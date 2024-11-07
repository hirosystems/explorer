'use client';

import { Box, Field as CUIField, Fieldset, Icon, Input, Stack } from '@chakra-ui/react';
import { CaretDown, CaretRight } from '@phosphor-icons/react';
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { promiseWrapper } from '../../../../common/utils/utils';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '../../../../components/ui/accordion';
import { Button } from '../../../../components/ui/button';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Field as ChakraField } from '../../../../components/ui/field';
import { Text } from '../../../../ui/Text';
import { NetworkIdModeMap } from '../../../constants/network';
import { useGlobalContext } from '../../../context/useGlobalContext';
import { useAppDispatch } from '../../../state/hooks';
import { Network } from '../../../types/network';
import { getQueryParams } from '../../../utils/buildUrl';
import { closeModal } from '../modal-slice';
import { buildCustomNetworkUrl, fetchCustomNetworkId, validateUrl } from './utils';

interface FormValues {
  label: string;
  url: string;
  btcBlockBaseUrl: string;
  btcTxBaseUrl: string;
  btcAddressBaseUrl: string;
  isSubnet: boolean;
  genericError?: string;
}

export const AddNetworkForm: FC = () => {
  const dispatch = useAppDispatch();
  const { addCustomNetwork } = useGlobalContext();
  const router = useRouter();
  const [isBtcExplorerUrlsAccordionExpanded, setIsBtcExplorerUrlsAccordionExpanded] =
    useState(false);

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
        label: '',
        url: '',
        btcBlockBaseUrl: 'https://mempool.space/block',
        btcTxBaseUrl: 'https://mempool.space/tx',
        btcAddressBaseUrl: 'https://mempool.space/address',
        isSubnet: false,
      }}
      validate={async (values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.label) {
          errors.label = 'You need to specify a label for this network.';
        }

        const { isValid: isNetworkUrlValid, message: networkUrlErrorMessage } = await validateUrl(
          'You need to specify a URL for this network.',
          'Please check the formatting of the URL passed.',
          values.url
        );
        if (!isNetworkUrlValid) {
          errors.url = networkUrlErrorMessage;
        } else {
          try {
            const networkId = await fetchCustomNetworkId(
              buildCustomNetworkUrl(values.url),
              values.isSubnet
            );
            if (!networkId) {
              errors.genericError = 'The API did not return a valid network_id.';
            }
          } catch (e: any) {
            if (e.message.includes('Failed to fetch')) {
              errors.genericError = 'Could not connect to supplied network URL.';
            } else {
              errors.genericError = e.message;
            }
          }
        }

        const { isValid: isBtcBlockBaseUrlValid, message: btcBlockBaseUrlErrorMessage } =
          await validateUrl(
            'You need to specify a base BTC block URL.',
            'Please check the formatting of the URL passed.',
            values.btcBlockBaseUrl
          );

        if (!isBtcBlockBaseUrlValid) {
          errors.btcBlockBaseUrl = btcBlockBaseUrlErrorMessage;
        }

        const { isValid: isBtcTxBaseUrlValid, message: btcTxBaseUrlErrorMessage } =
          await validateUrl(
            'You need to specify a base BTC transaction URL.',
            'Please check the formatting of the URL passed.',
            values.btcTxBaseUrl
          );

        if (!isBtcTxBaseUrlValid) {
          errors.btcTxBaseUrl = btcTxBaseUrlErrorMessage;
        }

        const { isValid: isBtcAddressBaseUrlValid, message: btcAddressBaseUrlErrorMessage } =
          await validateUrl(
            'You need to specify a base BTC address URL.',
            'Please check the formatting of the URL passed.',
            values.btcAddressBaseUrl
          );

        if (!isBtcAddressBaseUrlValid) {
          errors.btcAddressBaseUrl = btcAddressBaseUrlErrorMessage;
        }

        return errors;
      }}
      onSubmit={async ({
        url,
        btcBlockBaseUrl,
        btcTxBaseUrl,
        btcAddressBaseUrl,
        label,
        isSubnet,
      }) => {
        const networkUrl = buildCustomNetworkUrl(url);
        const networkId = await fetchCustomNetworkId(networkUrl, isSubnet);

        if (networkId) {
          const network: Network = {
            label: label.trim(),
            url: networkUrl,
            btcBlockBaseUrl,
            btcTxBaseUrl,
            btcAddressBaseUrl,
            networkId,
            mode: NetworkIdModeMap[networkId],
            isCustomNetwork: true,
            isSubnet,
          };
          promiseWrapper(addCustomNetwork)(network)
            .then(() => router.push(`/${getQueryParams(network)}`))
            .then(() => setTimeout(() => window.location.reload(), 500));
        }

        dispatch(closeModal());
      }}
    >
      {(
        { isValidating } // TODO: upgrade to v3. This may be broken
      ) => (
        <Form>
          <Stack gap={4}>
            <Field name="label">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  label="Label"
                  invalid={!!form.errors.label && !!form.touched.label}
                  errorText={form.errors.label}
                >
                  <Input {...field} placeholder="My Stacks API" />
                </ChakraField>
              )}
            </Field>
            <Field name="url">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  label="URL"
                  invalid={!!form.errors.url && !!form.touched.url}
                  errorText={form.errors.url}
                >
                  <Input {...field} placeholder="https://" />
                </ChakraField>
              )}
            </Field>
            <Field name="isSubnet">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  invalid={!!form.errors.isSubnet && !!form.touched.isSubnet}
                  errorText={form.errors.isSubnet}
                >
                  <Checkbox variant="outline" {...field}>
                    This is a subnet
                  </Checkbox>
                </ChakraField>
              )}
            </Field>
          </Stack>
          <AccordionRoot
            multiple
            mt={'16px'}
            onValueChange={({ value }) => {
              setIsBtcExplorerUrlsAccordionExpanded(value.includes('btc-explorer-urls'));
            }}
          >
            <AccordionItem borderBottom={'none'} value="btc-explorer-urls">
              <Stack gap={4}>
                <AccordionItemTrigger paddingLeft={0} gap={2}>
                  <Icon h={3} w={3}>
                    {isBtcExplorerUrlsAccordionExpanded ? <CaretDown /> : <CaretRight />}
                  </Icon>
                  <Text fontSize={'sm'}>BTC Explorer URLs</Text>
                </AccordionItemTrigger>
                <AccordionItemContent>
                  <Stack gap={4}>
                    <Field name="btcBlockBaseUrl">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <ChakraField
                          label="BTC Block Base URL"
                          invalid={!!form.errors.btcBlockBaseUrl && !!form.touched.btcBlockBaseUrl}
                          errorText={form.errors.btcBlockBaseUrl}
                        >
                          <Input {...field} placeholder="https://" />
                        </ChakraField>
                      )}
                    </Field>
                    <Field name="btcTxBaseUrl">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <ChakraField
                          label="BTC Transaction Base URL"
                          invalid={!!form.errors.btcTxBaseUrl && !!form.touched.btcTxBaseUrl}
                          errorText={form.errors.btcTxBaseUrl}
                        >
                          <Input {...field} placeholder="https://" />
                        </ChakraField>
                      )}
                    </Field>
                    <Field name="btcAddressBaseUrl">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <ChakraField
                          label="BTC Address Base URL"
                          invalid={
                            !!form.errors.btcAddressBaseUrl && !!form.touched.btcAddressBaseUrl
                          }
                          errorText={form.errors.btcAddressBaseUrl}
                        >
                          <Input {...field} placeholder="https://" />
                        </ChakraField>
                      )}
                    </Field>
                  </Stack>
                </AccordionItemContent>
              </Stack>
            </AccordionItem>
          </AccordionRoot>
          <Field name="genericError">
            {({ form }: FieldProps<string, FormValues>) => (
              <Fieldset.Root invalid={!!form.errors.genericError} style={{ marginTop: 0 }}>
                <CUIField.Root>
                  <CUIField.ErrorText>{form.errors.genericError}</CUIField.ErrorText>
                </CUIField.Root>
              </Fieldset.Root>
            )}
          </Field>
          <Box mt={4}>
            <Button loading={isValidating} width="100%" type="submit">
              Add and select
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
