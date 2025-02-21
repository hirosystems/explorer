'use client';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';
import { useContractById } from '../../../../common/queries/useContractById';
import { useSuspensePoxInfo } from '../../../../common/queries/usePoxInfo';
import { truncateMiddle } from '../../../../common/utils/utils';
import { DefaultView } from '../../components/ContractCall/DefaultView';
import { SelectedContractView } from '../../components/ContractCall/SelectedContractView';

export default function ContractCall({ params: { params } }: { params: { params: string[] } }) {
  const contractId = params?.[0] || undefined;
  const functionName = params?.[1] || undefined;
  const { data: poxInfo } = useSuspensePoxInfo();
  const { data: contract, isFetching } = useContractById(contractId);

  const rootContractAddress = poxInfo?.contract_id?.split('.')?.[0];
  const networkMode = useGlobalContext().activeNetwork.mode;

  const noContractFound = !contract && !isFetching;

  if (!rootContractAddress) return null;

  if (!!contractId) {
    if (noContractFound)
      return (
        <DefaultView
          rootContractAddress={rootContractAddress}
          errorMessage={`Contract ${truncateMiddle(contractId)} not found in ${networkMode}`}
        />
      );
    if (!contract) return <DefaultView rootContractAddress={rootContractAddress} />;
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
