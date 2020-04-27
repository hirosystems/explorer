import { RPCClient } from '@common/debug/rpc-client';
import { API_SERVER, API_SERVER_ENV } from '@common/constants';

export const submitToSidecar = async (formData: FormData, path: string) => {
  const res = await fetch(API_SERVER_ENV + path, {
    body: new URLSearchParams([...(formData as any)]),
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const text = await res.text();
  return text;
};
export const handleDebugFormSubmit = async (values: object, path: string) => {
  let formData = new FormData();
  Object.keys(values).forEach(key => {
    formData.append(key, (values as any)[key]);
  });
  return submitToSidecar(formData, path);
};

export interface Key {
  secretKey: string;
  stacksAddress: string;
}

export const getRPCClient = () => {
  const url =
    typeof document !== 'undefined' && location.origin.includes('localhost')
      ? 'http://localhost:3999'
      : 'https://crashy-stacky.zone117x.com';
  return new RPCClient(url);
};
