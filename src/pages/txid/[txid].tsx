import { useRouter } from 'next/router';
import { claritySyntax } from '@/appPages/common/claritySyntax';
import TxIdPage from '../../appPages/txid/[txid]/page';

function TxId() {
  const { query } = useRouter();
  const txId = query.txid as string;
  return <TxIdPage params={{ txid: txId }} claritySyntax={claritySyntax} />;
}

export default TxId;
