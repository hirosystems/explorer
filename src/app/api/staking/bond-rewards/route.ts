import { getAllowedStakingApiUrl } from '@/api/server-api-origin';
import { serializeBondRewards } from '@/app/staking/bond-reward-history';
import { BONDS_TABLE_LIMIT } from '@/app/staking/consts';
import { createRewardHistoryDeadline, fetchBondRewards, fetchPoxInfo } from '@/app/staking/data';
import { NetworkModes } from '@/common/types/network';
import { ensureError, logError } from '@/common/utils/error-utils';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const chain = params.get('chain') ?? NetworkModes.Mainnet;
  const api = getAllowedStakingApiUrl(chain, params.get('api') ?? undefined);
  const indexes = params.getAll('bond');
  if (
    !api ||
    !indexes.length ||
    indexes.length > BONDS_TABLE_LIMIT ||
    indexes.some(index => !/^[1-9]\d*$/.test(index) || !Number.isSafeInteger(Number(index)))
  ) {
    return Response.json({ error: 'Invalid reward history request' }, { status: 400 });
  }
  if (request.signal.aborted) return new Response(null, { status: 499 });
  try {
    const deadline = createRewardHistoryDeadline();
    // PoX is optional for the legacy fallback; the v3 endpoint works without it.
    const pox = await fetchPoxInfo(chain, api, request.signal).catch(() => undefined);
    const rewards = await fetchBondRewards(
      Array.from(new Set(indexes.map(Number))),
      chain,
      api,
      pox?.contract_id,
      deadline,
      request.signal
    );
    return Response.json(serializeBondRewards(rewards), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 });
    logError(ensureError(error), 'Staking table: reward history', { chain });
    return Response.json({ error: 'Reward history unavailable' }, { status: 503 });
  }
}
