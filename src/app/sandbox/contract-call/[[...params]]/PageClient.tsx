'use client';

import { use } from 'react';

import { useGlobalContext } from '../../../../common/context/useGlobalContext';
import { useContractById } from '../../../../common/queries/useContractById';
import { useSuspensePoxInfo } from '../../../../common/queries/usePoxInfo';
import { truncateMiddleDeprecated } from '../../../../common/utils/utils';
import { DefaultView } from '../../components/ContractCall/DefaultView';
import { SelectedContractView } from '../../components/ContractCall/SelectedContractView';

export default function ContractCall(props: { params: Promise<{ params: string[] }> }) {
  const pageParams = use(props.params).params;
  const contractId = pageParams?.[0] || undefined;
  const functionName = pageParams?.[1] || undefined;
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
          errorMessage={`Contract ${truncateMiddleDeprecated(
            contractId
          )} not found in ${networkMode}`}
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
