import { Text } from '@/ui/Text';

import { Banner } from './Banner';

export const HybridExplorerBanner = () => {
  return (
    <Banner
      content={
        <Text textStyle="text-semibold-sm" color="textPrimary" fontStyle="instrument">
          Welcome to the new Stacks Explorer! We're rolling out updates gradually, so you may see a
          hybrid version during this transition.
        </Text>
      }
      isDismissible
      bannerKey={'hybrid-explorer-banner'}
    />
  );
};
