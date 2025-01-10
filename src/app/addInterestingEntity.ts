import type { NextApiRequest, NextApiResponse } from 'next';

import { addInterestingAddress, addInterestingContract } from '../common/utils/userPreferences';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, entityId, entityType } = req.body;

  if (!userId || !entityId || !entityType) {
    return res.status(400).json({ error: 'Missing userId, entityId, or entityType.' });
  }

  if (entityType === 'address') {
    addInterestingAddress(userId, entityId);
  } else if (entityType === 'contract') {
    addInterestingContract(userId, entityId);
  } else {
    return res.status(400).json({ error: 'Invalid entityType. Use "address" or "contract".' });
  }

  res.status(200).json({ success: true });
}
