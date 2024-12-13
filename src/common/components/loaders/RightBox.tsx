import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Skeleton } from '../../../ui/Skeleton';
import { randomWidth } from './consts';

export function RightBoxSkeleton() {
  return (
    <Section title={<Skeleton width={'200px'} height={'20px'} />}>
      <Flex width="100%" flexDirection={['column', 'column', 'row']}>
        <Box width={['100%']}>
          {Array.from({ length: 20 }).map((_, i) => (
            <KeyValueHorizontal
              key={i}
              label={<Skeleton width={`${randomWidth[i]}px`} height={'14px'} />}
              value={null}
            />
          ))}
        </Box>
      </Flex>
    </Section>
  );
}
