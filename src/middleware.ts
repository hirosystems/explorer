import { NextRequest, NextResponse } from 'next/server';

import { NetworkModes } from './common/types/network';

const replaceInvalidNetworkModeWithMainnet = (req: NextRequest) => {
  const url = req.nextUrl;
  const networkModeQueryParam = 'chain';
  const networkMode = url.searchParams.getAll(networkModeQueryParam);

  if (!networkMode.length) {
    url.searchParams.append(networkModeQueryParam, NetworkModes.Mainnet);
    return NextResponse.redirect(url);
  }

  if (!!networkMode[0] && !Object.values<string>(NetworkModes).includes(networkMode[0])) {
    url.searchParams.delete(networkModeQueryParam);
    url.searchParams.append(networkModeQueryParam, NetworkModes.Mainnet);
    return NextResponse.redirect(url);
  }

  if (networkMode.length > 1) {
    url.searchParams.delete(networkModeQueryParam);
    url.searchParams.append(networkModeQueryParam, networkMode[0]);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export function middleware(req: NextRequest) {
  return replaceInvalidNetworkModeWithMainnet(req);
}
