import { numberToString } from '@/common/utils';
import { Flex, GridProps } from '@/ui/components';
import { StatSection } from '@/appPages/stats/StatSection';

export function Supply({
  circulatingSupply,
  totalSupply,
  ...gridProps
}: GridProps & { circulatingSupply: number | null; totalSupply: number | null }) {
  return (
    <StatSection
      title="Circulating Supply"
      bodyMainText={circulatingSupply ? numberToString(circulatingSupply) : <>N/A</>}
      bodySecondaryText={null}
      caption={
        <Flex fontSize="12px" color="textTitle" fontWeight="500" alignItems="center">
          Total Supply: {totalSupply ? numberToString(totalSupply) : 'N/A'}
        </Flex>
      }
      {...gridProps}
    />
  );
}
