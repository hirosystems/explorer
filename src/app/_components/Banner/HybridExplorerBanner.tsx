import { Text } from '@/ui/Text';

import { Banner } from './Banner';

export const HYBRID_EXPLORER_BANNER_KEY = 'hybridExplorerBanner';

export const HybridExplorerBanner = ({
  hybridExplorerBannerCookie,
}: {
  hybridExplorerBannerCookie: string | undefined;
}) => {
  return (
    <Banner
      content={
        <Text textStyle="text-semibold-sm" color="textPrimary" fontStyle="instrument">
          Welcome to the new Stacks Explorer! We're rolling out updates gradually, so you may see a
          hybrid version during this transition.
        </Text>
      }
      bannerKey={HYBRID_EXPLORER_BANNER_KEY}
      isDismissible
      isDismissedCookie={hybridExplorerBannerCookie === 'true'}
    />
  );
};
