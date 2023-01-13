import { NetworkModeUrlMap } from '@/common/constants/network';
import { NetworkModes } from '@/common/types/network';
import { UrlObject } from 'url';

export class SSRData {
  private static instance: SSRData;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public customApiUrl = '';
  public networkMode: NetworkModes = NetworkModes.Mainnet;
  public colorMode = 'light';

  public static getInstance(): SSRData {
    if (!SSRData.instance) {
      SSRData.instance = new SSRData();
    }
    return SSRData.instance;
  }
  setCustomApiUrl(customApiUrl: string) {
    this.customApiUrl = customApiUrl;
  }
  setNetworkMode(networkMode: NetworkModes) {
    this.networkMode = networkMode;
  }
  setColorMode(colorMode: string) {
    this.colorMode = colorMode;
  }
  buildUrl(url: string | UrlObject) {
    const urlSuffix = `?chain=${encodeURIComponent(this.networkMode)}${
      !!this.customApiUrl ? `&api=${this.customApiUrl}` : ''
    }`;
    return `${url}${urlSuffix}`;
  }
  getActiveNetworkKey() {
    return this.customApiUrl || NetworkModeUrlMap[this.networkMode];
  }
}
