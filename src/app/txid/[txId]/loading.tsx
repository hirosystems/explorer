'use client';

import { SkeletonPageWithTagsAndTwoColumns } from '../../../common/components/loaders/skeleton-transaction';
import { useColorMode } from '../../../ui/hooks/useColorMode';

export default function Loading() {
  return <SkeletonPageWithTagsAndTwoColumns />;
}
