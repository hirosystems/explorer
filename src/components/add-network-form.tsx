import { fetchFromApi } from '@/common/api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT } from '@/common/constants';
import { NetworkIdModeMap } from '@/common/constants/network';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppDispatch } from '@/common/state/hooks';
import { Network } from '@/common/types/network';
import { closeModal } from '@/components/modals/modal-slice';
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

const fetchCustomNetworkId: (url: string) => Promise<ChainID | undefined> = (url: string) => {
  return fetchFromApi(url)(DEFAULT_V2_INFO_ENDPOINT)
    .then(res => res.json())
    .then(res =>
      Object.values(ChainID).includes(res.network_id) ? (res.network_id as ChainID) : undefined
    )
    .catch();
};

interface FormValues {
  label: string;
  url: string;
  apiProxyUrl: string;
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
        apiProxyUrl: '',
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
              const networkId = await fetchCustomNetworkId(buildCustomNetworkUrl(values.url));
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
      onSubmit={async ({ url, label }) => {
        const networkUrl = buildCustomNetworkUrl(url);
        const networkId = await fetchCustomNetworkId(networkUrl);

        if (networkId) {
          const network: Network = {
            label: label.trim(),
            url: networkUrl,
            networkId,
            mode: NetworkIdModeMap[networkId],
            isCustomNetwork: true,
          };
          void addCustomNetwork(network)
            .then(() => router.push(`/?chain=${network.mode}&api=${network.url}`))
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
              <Field name="apiProxyUrl">
                {({ field, form }: FieldProps<string, FormValues>) => (
                  <FormControl isInvalid={!!form.errors.apiProxyUrl && !!form.touched.apiProxyUrl}>
                    <FormLabel>
                      Proxy URL (optional - currently used for metadata endpoints)
                    </FormLabel>
                    <Input {...field} placeholder="https://" />
                    <FormErrorMessage>{form.errors.apiProxyUrl}</FormErrorMessage>
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
