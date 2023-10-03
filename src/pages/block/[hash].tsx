import { useRouter } from 'next/router';
import BlockPage from '../../appPages/block/[hash]/page';

function Block() {
  const { query } = useRouter();
  const hash = query.hash as string;
  return <BlockPage params={{ hash }} />;
}

export default Block;
