import { getSampleTxsFeeEstimate } from '../../common/utils/fee-utils';
import { getTokenPrice } from '../getTokenPriceInfo';
import Page from './PageClient';

export default async function (props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const isSSRDisabled = searchParams?.ssr === 'false';

  const nonStacksRequests = [getTokenPrice()] as const;

  const stacksAPIRequests = isSSRDisabled
    ? []
    : ([getSampleTxsFeeEstimate(chain as 'mainnet' | 'testnet', api)] as const);

  const [tokenPrice, ...stacksAPIResults] = await Promise.all([
    ...nonStacksRequests,
    ...stacksAPIRequests,
  ]);

  const [feeEstimates] = isSSRDisabled ? [undefined] : stacksAPIResults;

  return <Page tokenPrice={tokenPrice} feeEstimates={feeEstimates} />;
}
