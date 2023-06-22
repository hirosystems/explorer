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
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@/ui/components';
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik';
import { useRouter } from 'next/router';
import { string } from 'yup';

import { ChainID } from '@stacks/transactions';

const buildCustomNetworkUrl = (url: string) => {
  const hostname = encodeURIComponent(new URL(url).hostname);
  const port = encodeURIComponent(new URL(url).port);
  return `${hostname === 'localhost' ? 'http://' : 'https://'}${hostname}${port ? `:${port}` : ''}`;
};

const fetchCustomNetworkId: (url: string, isSubnet: boolean) => Promise<ChainID | undefined> = (
  url,
  isSubnet
) => {
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
  isSubnet: boolean;
  genericError?: string;
}

export const AddNetworkForm: React.FC = () => {
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
        isSubnet: false,
      }}
      validate={async (values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.label) {
          errors.label = 'You need to specify a label for this network.';
        }
        if (!values.url) {
          errors.url = 'You need to specify a URL for this network.';
        } else {
          const isValid = await string()
            .matches(
              /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
            )
            .isValid(values.url);
          if (!isValid) {
            errors.url = 'Please check the formatting of the URL passed.';
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
        }
        return errors;
      }}
      onSubmit={async ({ url, label, isSubnet }) => {
        const networkUrl = buildCustomNetworkUrl(url);
        const networkId = await fetchCustomNetworkId(networkUrl, isSubnet);

        if (networkId) {
          const network: Network = {
            label: label.trim(),
            url: networkUrl,
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
      render={({ isValidating }) => (
        <Form>
          <Stack spacing="24px">
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
                    <FormLabel>URL</FormLabel>
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
            <Field name="genericError">
              {({ form }: FieldProps<string, FormValues>) => (
                <FormControl isInvalid={!!form.errors.genericError} style={{ marginTop: 0 }}>
                  <FormErrorMessage>{form.errors.genericError}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box>
              <Button isLoading={isValidating} width="100%" type="submit">
                Add and select
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    />
  );
};
