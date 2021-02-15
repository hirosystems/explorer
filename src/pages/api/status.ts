import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SITE_NOTICE_BANNER_LABEL,
  SITE_NOTICE_BANNER_MESSAGE,
  SITE_NOTICE_ENABLED,
} from '@common/constants';

export default function statusHandler(
  { query: { address } }: NextApiRequest,
  res: NextApiResponse<{ enabled: true; label: string; message: string } | { enabled: false }>
) {
  if (SITE_NOTICE_ENABLED) {
    res.status(200).json({
      enabled: true,
      label: SITE_NOTICE_BANNER_LABEL,
      message: SITE_NOTICE_BANNER_MESSAGE,
    });
  } else {
    res.status(200).json({
      enabled: false,
    });
  }
}
