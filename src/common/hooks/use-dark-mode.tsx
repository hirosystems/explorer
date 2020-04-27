import { useMediaQuery } from '@common/hooks/use-media-query';

export const useDarkMode = () => {
  const [darkmode] = useMediaQuery('(prefers-color-scheme: dark)');
  return darkmode;
};
