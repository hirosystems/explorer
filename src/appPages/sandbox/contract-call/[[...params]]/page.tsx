import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/common/api/client';
import { useGlobalContext } from '@/common/context/useAppContext';
import { transactionQK, TransactionQueryKeys } from '@/features/transaction/query-keys';
import { getTransactionQueries } from '@/features/transaction/use-transaction-queries';

import { DefaultView } from '../../components/ContractCall/DefaultView';
import { SelectedContractView } from '../../components/ContractCall/SelectedContractView';
import { Spinner } from '@/ui/Spinner';

function ContractCall({ params: { params } }: { params: { params: string[] } }) {
  const contractId = params?.[0] || '';
  const functionName = params?.[1] || '';
  const { infoApi } = useApi();
  const { data: poxInfo, isFetching: isPoxInfoFetching } = useQuery(
    ['pox-info'],
    () => infoApi.getPoxInfo(),
    { staleTime: 5000 }
  );
  const rootContractAddress = poxInfo?.contract_id?.split('.')?.[0];
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  const queries = getTransactionQueries(activeNetworkUrl);

  const { data: contract, isFetching: isContractFetching } = useQuery(
    transactionQK(TransactionQueryKeys.contract, contractId),
    queries.fetchContract(contractId),
    {
      enabled: !!contractId,
    }
  );

  if (isContractFetching || isPoxInfoFetching)
    return <Spinner alignSelf={'center'} justifySelf={'center'} size={'32px'} />;

  if (!rootContractAddress) return null;

  if (contract) {
    return (
      <SelectedContractView
        contract={contract}
        functionName={functionName}
        contractId={contractId}
      />
    );
  }

  return <DefaultView rootContractAddress={rootContractAddress} />;
}

export default ContractCall;
