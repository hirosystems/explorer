import React, { useState } from 'react';
import { useNetwork } from '@common/hooks/use-network';
import { useFormik } from 'formik';
import { string } from 'yup';
import { fetchFromApi } from '@common/api/fetch';
import { closeModal } from '@components/modals/modalSlice';
import { isLocal } from '@common/utils';
import { NetworkIdModeMap, NetworkMode } from '@common/types/network';
import { DEFAULT_V2_INFO_ENDPOINT } from '@common/constants';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useAppDispatch } from '@common/state/hooks';
import { addCustomNetwork, setActiveNetworkUrl } from '@common/state/globalSlice';
import { ChainID } from '@stacks/transactions';

interface Errors {
  label?: string;
  url?: string;
  general?: string;
}

const fetchNetworkId: (url: string) => Promise<ChainID | undefined> = (url: string) =>
  fetchFromApi(`https://${new URL(url).host}`)(DEFAULT_V2_INFO_ENDPOINT)
    .then(res => res.json())
    .then(res =>
      Object.values(ChainID).includes(res.network_id) ? (res.network_id as ChainID) : undefined
    )
    .catch();

export const useNetworkAddForm = () => {
  const [networkMode, setNetworkMode] = useState<NetworkMode | undefined>(undefined);
  const dispatch = useAppDispatch();
  const { networkList, handleAddNetwork } = useNetwork();
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

        const networkId = await fetchNetworkId(values.url);
        const networkUrl = `https://${_url.host}`;

        if (networkId) {
          dispatch(addCustomNetwork({ label: label.trim(), url: networkUrl, networkId }));
          dispatch(setActiveNetworkUrl(networkUrl));
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
            if (!isLocal() && !values.url.includes('https://')) {
              _errors.url = 'The url needs to be https (non-local).';
            }
            if (
              networkList.find(item => item?.url?.split('//')?.[1] === values.url.split('//')[1])
            ) {
              _errors.general = 'This API has already been added.';
            }
            try {
              const networkId = await fetchNetworkId(values.url);
              if (networkId) {
                setNetworkMode(NetworkIdModeMap[networkId]);
              } else {
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
