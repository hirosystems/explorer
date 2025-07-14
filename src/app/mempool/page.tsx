import { getSampleTxsFeeEstimate } from '../../common/utils/fee-utils';
import Page from './PageClient';

export default async function (props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  const chain = searchParams?.chain || 'mainnet';
  const api = searchParams?.api;
  const isSSRDisabled = searchParams?.ssr === 'false';

  const stacksAPIRequests = isSSRDisabled
    ? []
    : ([getSampleTxsFeeEstimate(chain as 'mainnet' | 'testnet', api)] as const);

  const stacksAPIResults = await Promise.all(stacksAPIRequests);

  const [feeEstimates] = isSSRDisabled ? [undefined] : stacksAPIResults;

  return <Page feeEstimates={feeEstimates} />;
}
