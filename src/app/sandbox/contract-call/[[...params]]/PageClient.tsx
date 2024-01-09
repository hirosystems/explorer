'use client';

import { useContractById } from '../../../../common/queries/useContractById';
import { useSuspensePoxInfo } from '../../../../common/queries/usePoxInfo';
import { DefaultView } from '../../components/ContractCall/DefaultView';
import { SelectedContractView } from '../../components/ContractCall/SelectedContractView';

export default function ContractCall({ params: { params } }: { params: { params: string[] } }) {
  const contractId = params?.[0] || undefined;
  const functionName = params?.[1] || undefined;
  const { data: poxInfo } = useSuspensePoxInfo();
  const { data: contract } = useContractById(contractId);

  const rootContractAddress = poxInfo?.contract_id?.split('.')?.[0];

  if (!rootContractAddress) return null;

  if (!!contractId && !!contract) {
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
