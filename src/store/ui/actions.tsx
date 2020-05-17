import { createAction } from '@reduxjs/toolkit';
import { ToastType } from '@blockstack/ui';
import { Network, NetworkOptions } from '@store/ui/reducer';

function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

export const doAddToast = createAction('ui/toast/add', withPayloadType<ToastType>());
export const doRemoveToast = createAction('ui/toast/remove', withPayloadType<string>());
export const appTime = createAction('ui/time');
export const setNetworks = createAction('ui/config/network', withPayloadType<Network>());
export const selectNetwork = createAction(
  'ui/config/network/select',
  withPayloadType<NetworkOptions>()
);
