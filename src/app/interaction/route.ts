import { saveBanditState } from '../../common/utils/bandit';
import { linucbUpdate } from '../../common/utils/linucb';

export async function POST(req: any) {
  const { userId, action, context, reward } = await req.json();
  console.log('Received POST request:', { userId, action, context, reward });

  if (
    !userId ||
    typeof action !== 'number' ||
    !Array.isArray(context) ||
    typeof reward !== 'number'
  ) {
    return Response.json({ error: 'Invalid request body.' });
  }

  try {
    linucbUpdate(userId, action, context, reward);
    saveBanditState();

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating bandit model:', error);
    return Response.json({ error: 'Internal Server Error.' });
  }
}
