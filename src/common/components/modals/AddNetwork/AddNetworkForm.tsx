'use client';

import { CaretDown, CaretRight } from '@phosphor-icons/react';
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import { Accordion } from '../../../../ui/Accordion';
import { AccordionButton } from '../../../../ui/AccordionButton';
import { AccordionItem } from '../../../../ui/AccordionItem';
import { AccordionPanel } from '../../../../ui/AccordionPanel';
import { Box } from '../../../../ui/Box';
import { Button } from '../../../../ui/Button';
import { Checkbox } from '../../../../ui/Checkbox';
import { FormControl } from '../../../../ui/FormControl';
import { FormErrorMessage } from '../../../../ui/FormErrorMessage';
import { FormLabel } from '../../../../ui/FormLabel';
import { Icon } from '../../../../ui/Icon';
import { Input } from '../../../../ui/Input';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { NetworkIdModeMap } from '../../../constants/network';
import { useGlobalContext } from '../../../context/useAppContext';
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
            .then(() => setTimeout(() => window.location.reload(), 500));
        }

        dispatch(closeModal());
      }}
    >
      {({ isValidating }) => (
        <Form>
          <Stack gap={4}>
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
                  <Checkbox variant={'outline'} {...field}>
                    This is a subnet
                  </Checkbox>
                  <FormErrorMessage>{form.errors.isSubnet}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Stack>
          <Accordion allowMultiple mt={'16px'}>
            <AccordionItem borderBottom={'none'}>
              {({ isExpanded }) => (
                <Stack gap={4}>
                  <AccordionButton paddingLeft={0} gap={2}>
                    {isExpanded ? (
                      <Icon as={CaretDown} w={3} h={3} />
                    ) : (
                      <Icon as={CaretRight} w={3} h={3} />
                    )}{' '}
                    <Text fontSize={'sm'}>BTC Explorer URLs</Text>
                  </AccordionButton>
                  <AccordionPanel>
                    <Stack gap={4}>
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
                </Stack>
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
