import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { Button } from '@/ui/Button';
import { Flex, Icon } from '@chakra-ui/react';
import { ArrowsOutSimple } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';

export function Pre({ children }: { children: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <Flex
      borderRadius="redesign.xs"
      borderWidth="1px"
      borderColor="redesign.borderPrimary"
      px={{ base: 3, md: 1.5 }}
      py={3}
      gap={2}
      h="100%"
      maxHeight={{ base: isExpanded ? 'none' : '100px', md: isExpanded ? 'none' : '150px' }}
      overflow="hidden"
    >
      <Flex flexGrow={1} flexWrap="wrap" h="100%">
        <pre
          style={{
            fontSize: 'var(--stacks-font-sizes-xs)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {children}
        </pre>
      </Flex>
      <Flex flexDirection={{ base: 'column', md: 'row' }} w="fit-content" gap={1.5}>
        <Button
          onClick={toggleExpand}
          variant="unstyled"
          bg="surfacePrimary"
          borderRadius="redesign.sm"
          minWidth="0"
          h="fit-content"
          w="fit-content"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={1.5}
        >
          <Icon color="iconSecondary" _hover={{ color: 'iconPrimary' }} h={3.5} w={3.5}>
            <ArrowsOutSimple />
          </Icon>
        </Button>

        <CopyButtonRedesign
          initialValue={children}
          buttonProps={{
            p: 1.5,
            _hover: {
              bg: 'surfacePrimary',
            },
            bg: 'surfacePrimary',
          }}
          iconProps={{
            height: 3.5,
            width: 3.5,
            color: 'iconSecondary',
            _hover: {
              color: 'iconPrimary',
            },
          }}
        />
      </Flex>
    </Flex>
  );
}
