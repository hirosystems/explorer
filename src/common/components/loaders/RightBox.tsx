import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { SkeletonItem } from '../../../ui/SkeletonItem';
import { randomWidth } from './consts';

export function RightBoxSkeleton() {
  return (
    <Section title={<SkeletonItem width={'200px'} height={'20px'} />}>
      <Flex width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          {Array.from({ length: 20 }).map((_, i) => (
            <KeyValueHorizontal
              key={i}
              label={<SkeletonItem width={`${randomWidth[i]}px`} height={'14px'} />}
              value={null}
            />
          ))}
        </Box>
      </Flex>
    </Section>
  );
}
