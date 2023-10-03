import { claritySyntax } from '@/appPages/common/claritySyntax';
import Layout from '@/appPages/sandbox/layout';
import { DeployPage } from '@/appPages/sandbox/deploy/DeployPage';

function SandboxDeploy() {
  return (
    <Layout>
      <DeployPage claritySyntax={claritySyntax} />
    </Layout>
  );
}

export default SandboxDeploy;
