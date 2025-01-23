'use client';

import { Accordion, Field as CUIField, Fieldset, Flex, Stack } from '@chakra-ui/react';
import { CaretUp } from '@phosphor-icons/react';
import { FieldProps, Form, Formik, FormikErrors, Field as FormikField } from 'formik';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Button } from '../../../../components/ui/button';
import { Field as ChakraField } from '../../../../components/ui/field';
import { Input } from '../../../../ui/Input';
import { Text } from '../../../../ui/Text';
import { NetworkIdModeMap } from '../../../constants/network';
import { useGlobalContext } from '../../../context/useGlobalContext';
import { useAppDispatch } from '../../../state/hooks';
import { Network } from '../../../types/network';
import { getQueryParams } from '../../../utils/buildUrl';
import { promiseWrapper } from '../../../utils/utils';
import { buildCustomNetworkUrl, fetchCustomNetworkId, validateUrl } from '../AddNetwork/utils';
import { closeModal } from '../modal-slice';

const AccordionItemTrigger = Accordion.ItemTrigger;
const AccordionItemContent = Accordion.ItemContent;
const AccordionRoot = Accordion.Root;
const AccordionItem = Accordion.Item;

interface FormValues {
  label: string;
  url: string;
  btcBlockBaseUrl: string;
  btcTxBaseUrl: string;
  btcAddressBaseUrl: string;
  genericError?: string;
}

export const AddNetworkFormNew: FC = () => {
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
            const networkId = await fetchCustomNetworkId(buildCustomNetworkUrl(values.url), false);
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
      onSubmit={async ({ url, btcBlockBaseUrl, btcTxBaseUrl, btcAddressBaseUrl, label }) => {
        const networkUrl = buildCustomNetworkUrl(url);
        const networkId = await fetchCustomNetworkId(networkUrl, false);

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
            isSubnet: false,
          };
          promiseWrapper(addCustomNetwork)(network)
            .then(() => router.push(`/${getQueryParams(network)}`))
            .then(() => setTimeout(() => window.location.reload(), 500));
        }

        dispatch(closeModal());
      }}
    >
      {({ isValidating }) => (
        <Form>
          <Stack gap={5}>
            <FormikField name="label">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  label={
                    <Text fontWeight="regular" color="textSecondary" fontSize="sm">
                      Name
                    </Text>
                  }
                  invalid={!!form.errors.label && !!form.touched.label}
                  errorText={form.errors.label}
                >
                  <Input
                    {...field}
                    placeholder="My Stacks API"
                    variant="redesignPrimary"
                    size="big"
                  />
                </ChakraField>
              )}
            </FormikField>
            <FormikField name="url">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <ChakraField
                  label={
                    <Text fontWeight="regular" color="textSecondary" fontSize="sm">
                      Base URL
                    </Text>
                  }
                  invalid={!!form.errors.url && !!form.touched.url}
                  errorText={form.errors.url}
                >
                  <Input {...field} placeholder="https://" variant="redesignPrimary" size="big" />
                </ChakraField>
              )}
            </FormikField>
            <AccordionRoot
              multiple
              onValueChange={({ value }) => {
                setIsBtcExplorerUrlsAccordionExpanded(value.includes('btc-explorer-urls'));
              }}
            >
              <AccordionItem borderBottom={'none'} value="btc-explorer-urls">
                <AccordionItemTrigger
                  alignItems="center"
                  bg="surfacePrimary"
                  borderTopRadius="redesign.md"
                  borderBottomRadius={isBtcExplorerUrlsAccordionExpanded ? 'none' : 'redesign.md'}
                  w="full"
                  p={3}
                >
                  <Flex justifyContent="space-between" w="full">
                    <Text fontSize={'sm'} fontWeight="medium" color="textSecondary">
                      BTC Explorer URLs
                    </Text>
                    <Accordion.ItemIndicator rotate={{ base: '-180deg', _open: '0deg' }}>
                      <CaretUp />
                    </Accordion.ItemIndicator>
                  </Flex>
                </AccordionItemTrigger>
                <AccordionItemContent
                  bg="surfacePrimary"
                  borderBottomRadius="redesign.md"
                  borderTopRadius={'none'}
                  p={3}
                >
                  <Stack gap={5}>
                    <FormikField name="btcBlockBaseUrl">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <ChakraField
                          label={
                            <Text fontSize={'sm'} fontWeight="regular" color="textSecondary">
                              Bitcoin Block Base URL
                            </Text>
                          }
                          invalid={!!form.errors.btcBlockBaseUrl && !!form.touched.btcBlockBaseUrl}
                          errorText={form.errors.btcBlockBaseUrl}
                        >
                          <Input
                            {...field}
                            placeholder="https://"
                            variant="redesignPrimary"
                            size="big"
                          />
                        </ChakraField>
                      )}
                    </FormikField>
                    <FormikField name="btcTxBaseUrl">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <ChakraField
                          label={
                            <Text fontSize={'sm'} fontWeight="regular" color="textSecondary">
                              Bitcoin Transaction Base URL
                            </Text>
                          }
                          invalid={!!form.errors.btcTxBaseUrl && !!form.touched.btcTxBaseUrl}
                          errorText={form.errors.btcTxBaseUrl}
                        >
                          <Input
                            {...field}
                            placeholder="https://"
                            variant="redesignPrimary"
                            size="big"
                          />
                        </ChakraField>
                      )}
                    </FormikField>
                    <FormikField name="btcAddressBaseUrl">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <ChakraField
                          label={
                            <Text fontSize={'sm'} fontWeight="regular" color="textSecondary">
                              Bitcoin Address Base URL
                            </Text>
                          }
                          invalid={
                            !!form.errors.btcAddressBaseUrl && !!form.touched.btcAddressBaseUrl
                          }
                          errorText={form.errors.btcAddressBaseUrl}
                        >
                          <Input
                            {...field}
                            placeholder="https://"
                            variant="redesignPrimary"
                            size="big"
                          />
                        </ChakraField>
                      )}
                    </FormikField>
                  </Stack>
                </AccordionItemContent>
              </AccordionItem>
            </AccordionRoot>
          </Stack>

          <FormikField name="genericError">
            {({ form }: FieldProps<string, FormValues>) => (
              <Fieldset.Root invalid={!!form.errors.genericError} style={{ marginTop: 0 }}>
                <CUIField.Root>
                  <CUIField.ErrorText>{form.errors.genericError}</CUIField.ErrorText>
                </CUIField.Root>
              </Fieldset.Root>
            )}
          </FormikField>

          <Button
            loading={isValidating}
            width="fit-content"
            type="submit"
            mt={8}
            variant="redesignPrimary"
            size="big"
          >
            Add and switch network
          </Button>
        </Form>
      )}
    </Formik>
  );
};
