import { parseCookies } from 'nookies';
import getConfig from 'next/config';
import { NextPageContext } from 'next';

export const getServerSideApiServer = (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const { publicRuntimeConfig } = getConfig();
  return cookies?.apiServer || publicRuntimeConfig.TESTNET_API_SERVER;
};
