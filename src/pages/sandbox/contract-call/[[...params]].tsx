import { useRouter } from 'next/router';

import SandboxContractPage from '../../../appPages/sandbox/contract-call/[[...params]]/page';
import Layout from '@/appPages/sandbox/layout';

function SandboxContract() {
  const { query } = useRouter();
  const contractId = query?.params?.[0] || '';
  const functionName = query?.params?.[1] || '';
  return (
    <Layout>
      <SandboxContractPage params={{ params: [contractId, functionName] }} />
    </Layout>
  );
}

export default SandboxContract;
