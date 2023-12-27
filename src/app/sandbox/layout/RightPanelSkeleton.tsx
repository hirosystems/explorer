import { Card } from '../../../common/components/Card';
import { SkeletonText } from '../../../ui/SkeletonText';

export function RightPanelSkeleton() {
  return (
    <Card
      rounded={'none'}
      flexGrow={1}
      flexDirection="column"
      borderLeftWidth={'1px'}
      position={'absolute'}
      right={0}
      top={0}
      width={96}
      height={'full'}
      p={7}
    >
      <SkeletonText noOfLines={50} spacing={4} />
    </Card>
  );
}
