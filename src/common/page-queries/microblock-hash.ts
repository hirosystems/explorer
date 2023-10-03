import { GetServerSidePropsContext } from 'next';
import { queryWith0x } from '@/common/utils';

export function getMicroblockHashFromServerSideCtx(ctx: GetServerSidePropsContext) {
  const { params } = ctx;
  if (!params?.hash) throw Error('No microblock hash');
  return queryWith0x(params?.hash?.toString());
}
