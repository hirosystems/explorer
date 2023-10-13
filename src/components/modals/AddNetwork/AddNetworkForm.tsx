import { getQueryParams } from '@/app/common/utils/buildUrl';
import { fetchFromApi } from '@/common/api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT } from '@/common/constants';
import { NetworkIdModeMap } from '@/common/constants/network';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppDispatch } from '@/common/state/hooks';
import { Network } from '@/common/types/network';
import { closeModal } from '@/components/modals/modal-slice';
import { Checkbox } from '@/ui/Checkbox';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Stack,
} from '@/ui/components';
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik';
import { useRouter } from 'next/router';

import { ChainID } from '@stacks/transactions';
import React, { FC } from 'react';
import { validateUrl } from './utils';
import { BsChevronRight, BsChevronDown } from 'react-icons/bs';
import { Text } from '@/ui/Text';

export const buildCustomNetworkUrl = (url: string) => {
  const urlObj = new URL(url);
  const hostname = encodeURIComponent(urlObj.hostname);
  const port = encodeURIComponent(urlObj.port);
  const pathname = !urlObj?.pathname || urlObj.pathname === '/' ? '' : urlObj.pathname;
  return `${hostname === 'localhost' ? 'http://' : 'https://'}${hostname}${port ? `:${port}` : ''}${
    pathname || ''
  }`;
};

export const fetchCustomNetworkId: (
  url: string,
  isSubnet: boolean
) => Promise<ChainID | undefined> = (url, isSubnet) => {
  return fetchFromApi(url)(DEFAULT_V2_INFO_ENDPOINT)
    .then(res => res.json())
    .then(res =>
      !isSubnet
        ? Object.values(ChainID).includes(res.network_id)
          ? (res.network_id as ChainID)
          : undefined
        : res.network_id
    )
    .catch();
};

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
          void addCustomNetwork(network)
            .then(() => router.push(`/${getQueryParams(network)}`))
            .then(() => router.reload());
        }

        dispatch(closeModal());
      }}
    >
      {({ isValidating }) => (
        <Form>
          <Stack spacing="16px">
            <Field name="label">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <FormControl isInvalid={!!form.errors.label && !!form.touched.label}>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} placeholder="My Stacks API" />
                  <FormErrorMessage>{form.errors.label}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="url">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <FormControl isInvalid={!!form.errors.url && !!form.touched.url}>
                  <FormLabel>Base URL</FormLabel>
                  <Input {...field} placeholder="https://" />
                  <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="isSubnet">
              {({ field, form }: FieldProps<string, FormValues>) => (
                <FormControl isInvalid={!!form.errors.isSubnet && !!form.touched.isSubnet}>
                  <Checkbox {...field}>This is a subnet</Checkbox>
                  <FormErrorMessage>{form.errors.isSubnet}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Stack>
          <Accordion allowMultiple mt={'16px'}>
            <AccordionItem borderBottom={'none'}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton paddingLeft={0}>
                    {isExpanded ? (
                      <Icon as={BsChevronDown} w={3} h={3} />
                    ) : (
                      <Icon as={BsChevronRight} w={3} h={3} />
                    )}{' '}
                    <Text fontSize={14} position={'relative'} bottom={'1px'} ml={'5px'}>
                      BTC Explorer URLs
                    </Text>
                  </AccordionButton>
                  <AccordionPanel>
                    <Stack gap={'10px'}>
                      <Field name="btcBlockBaseUrl">
                        {({ field, form }: FieldProps<string, FormValues>) => (
                          <FormControl
                            isInvalid={
                              !!form.errors.btcBlockBaseUrl && !!form.touched.btcBlockBaseUrl
                            }
                          >
                            <FormLabel>BTC Block Base URL</FormLabel>
                            <Input {...field} placeholder="https://" />
                            <FormErrorMessage>{form.errors.btcBlockBaseUrl}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="btcTxBaseUrl">
                        {({ field, form }: FieldProps<string, FormValues>) => (
                          <FormControl
                            isInvalid={!!form.errors.btcTxBaseUrl && !!form.touched.btcTxBaseUrl}
                          >
                            <FormLabel>BTC Transaction Base URL</FormLabel>
                            <Input {...field} placeholder="https://" />
                            <FormErrorMessage>{form.errors.btcTxBaseUrl}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="btcAddressBaseUrl">
                        {({ field, form }: FieldProps<string, FormValues>) => (
                          <FormControl
                            isInvalid={
                              !!form.errors.btcAddressBaseUrl && !!form.touched.btcAddressBaseUrl
                            }
                          >
                            <FormLabel>BTC Address Base URL</FormLabel>
                            <Input {...field} placeholder="https://" />
                            <FormErrorMessage>{form.errors.btcAddressBaseUrl}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Stack>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
          <Field name="genericError">
            {({ form }: FieldProps<string, FormValues>) => (
              <FormControl isInvalid={!!form.errors.genericError} style={{ marginTop: 0 }}>
                <FormErrorMessage>{form.errors.genericError}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Box mt={'16px'}>
            <Button isLoading={isValidating} width="100%" type="submit">
              Add and select
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
