import { useFormik } from 'formik';
import React from 'react';
import { string } from 'yup';

import { ChainID } from '@stacks/transactions';

import { fetchFromApi } from '@common/api/fetch';
import { DEFAULT_V2_INFO_ENDPOINT } from '@common/constants';
import { NetworkIdModeMap } from '@common/constants/network';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useAppDispatch } from '@common/state/hooks';
import { addCustomNetwork, setActiveNetwork } from '@common/state/network-slice';
import { Network } from '@common/types/network';

import { closeModal } from '@components/modals/modal-slice';

interface Errors {
  label?: string;
  url?: string;
  general?: string;
}

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

export const useNetworkAddForm = () => {
  const dispatch = useAppDispatch();
  const analytics = useAnalytics();
  const schema = string().matches(
    /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
  );
  const { handleSubmit, handleChange, handleBlur, values, isValidating, errors, setErrors } =
    useFormik({
      validateOnBlur: false,
      validateOnChange: false,
      initialValues: {
        label: '',
        url: '',
      },
      onSubmit: async ({ label, url }) => {
        const _url = new URL(url);

        analytics.track({
          event: 'network-added',
          properties: {
            addedNetworkUrl: url,
            time: Date.now(),
          },
        });

        const networkUrl = buildCustomNetworkUrl(values.url);
        const networkId = await fetchCustomNetworkId(networkUrl);

        if (networkId) {
          const network: Network = {
            label: label.trim(),
            url: networkUrl,
            networkId,
            mode: NetworkIdModeMap[networkId],
            isCustomNetwork: true,
          };
          dispatch(addCustomNetwork(network));
          dispatch(setActiveNetwork(network));
        }

        dispatch(closeModal());
      },
      validate: async values => {
        const _errors: Errors = {};
        if (!values.label) {
          _errors.label = 'You need to specify a label for this network.';
        }
        if (!values.url) {
          _errors.url = 'You need to specify a URL for this network.';
        } else {
          const isValid = await schema.isValid(values.url);
          if (!isValid) {
            _errors.url = 'Please check the formatting of the URL passed.';
          } else {
            try {
              const networkId = await fetchCustomNetworkId(buildCustomNetworkUrl(values.url));
              if (!networkId) {
                _errors.general = 'The API did not return a valid network_id.';
              }
            } catch (e: any) {
              if (e.message.includes('Failed to fetch')) {
                _errors.general = 'Could not connect to supplied network URL.';
              } else {
                _errors.general = e.message;
              }
            }
          }
        }

        return _errors;
      },
    });

  return {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    isValidating,
    errors,
    setErrors,
  };
};
