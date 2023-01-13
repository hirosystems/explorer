import { DeployPage } from './DeployPage';

function Deploy({ claritySyntax }: { claritySyntax: Record<string, any> }) {
  return <DeployPage claritySyntax={claritySyntax} />;
}

export default Deploy;
