import { createAction } from '@reduxjs/toolkit';
import { ToastType } from '@blockstack/ui';

function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

export const doAddToast = createAction('ui/toast/add', withPayloadType<ToastType>());
export const doRemoveToast = createAction('ui/toast/remove', withPayloadType<string>());
export const appTime = createAction('ui/time');
