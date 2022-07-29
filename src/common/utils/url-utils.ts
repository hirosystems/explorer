import { isValidUrl } from '@common/validation/validate-url';

export const isIconUrl = (url: string): boolean => isValidUrl(url) && isImage(url);

const isImage = (url: string): boolean => {
  const [urlWithoutParams] = url.split('?');
  const extension = urlWithoutParams.split('.').pop();
  return !!extension && ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension);
};
