import React, { useState } from 'react';
import { useNetwork } from '@common/hooks/use-network';
import { useFormik } from 'formik';
import { string } from 'yup';
import { fetchFromApi } from '@common/api/fetch';
import { useModal } from '@common/hooks/use-modal';
import { getChainIdFromInfo, isLocal } from '@common/utils';
import { NetworkMode } from '@common/types/network';
import { useSetChainMode } from '@common/hooks/use-chain-mode';
import { DEFAULT_V2_INFO_ENDPOINT } from '@common/constants';

interface Errors {
  label?: string;
  url?: string;
  general?: string;
}

export const useNetworkAddForm = () => {
  const [networkMode, setNetworkMode] = useState<NetworkMode | undefined>(undefined);
  const { handleCloseModal } = useModal();
  const { networkList, handleAddNetwork } = useNetwork();
  const setChainMode = useSetChainMode();
  const schema = string().matches(
    /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
  );
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    isValidating,
    errors,
    setErrors,
  } = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      label: '',
      url: '',
    },
    onSubmit: async ({ label, url }) => {
      const _url = new URL(url);

      await setChainMode(networkMode);

      handleAddNetwork({
        label: label.trim(),
        url: `https://${_url.host}`,
      });

      handleCloseModal();
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
          if (networkList.find(item => item?.url?.split('//')?.[1] === values.url.split('//')[1])) {
            _errors.general = 'This API has already been added.';
          }
          try {
            const _url = new URL(values.url);
            const res = await fetchFromApi(`https://${_url.host}`)(DEFAULT_V2_INFO_ENDPOINT);
            const data = await res.json();
            data?.network_id && setNetworkMode(getChainIdFromInfo(data));
            if (!data?.network_id) {
              _errors.general = 'The API did not return a network_id.';
            }
          } catch (e) {
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
