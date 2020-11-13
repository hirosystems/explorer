import { parseCookies } from 'nookies';
import getConfig from 'next/config';
import { NextPageContext } from 'next';

export const getServerSideApiServer = (ctx: NextPageContext) => {
  const cookies = parseCookies(ctx);
  const { TESTNET_API_SERVER } = getConfig();
  return cookies?.apiServer || TESTNET_API_SERVER;
};
