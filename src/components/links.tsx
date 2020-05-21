import Link from 'next/link';

export const TxLink = ({ txid, ...rest }: { txid: string } & any) => (
  <Link
    href={{
      pathname: '/txid/[txid]',
      query: {
        txid,
      },
    }}
    as={`/txid/${txid}`}
    passHref
    {...rest}
  />
);
