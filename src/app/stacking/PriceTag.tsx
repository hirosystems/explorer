import { Box } from '@/ui/Box';
import BitcoinLogo from '@/ui/icons/BitcoinLogo';
import StxIcon from '@/ui/icons/StxIcon';
import { Flex, Text } from '@chakra-ui/react';

export type PriceTagToken = 'btc' | 'stx';

export function PriceTag({ price, token }: { price: number; token: PriceTagToken }) {
  return (
    <Flex
      alignItems="center"
      bg='purple'
      // bg="linear-gradient(to right, #f7931a 50%, #f1f1f1 50%)"
      // bg="linear-gradient(81.89deg, #FF9100 11.28%, #ECEAE8 45.13%), linear-gradient(81.89deg, color(display-p3 1.000 0.596 0.208) 11.28%, color(display-p3 0.925 0.918 0.910) 45.13%)"
      width="fit-content"
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
      borderRadius="50px"
      h={9}
    >
      <Flex
        justifyContent="center"
        position="relative"
        right="-2px"
        alignItems="center"
        w={9}
        h={9}
        color="white"
        fontSize="1.5rem"
        bg="#f7931a"
        borderRadius="50%"
      >
        {token === 'btc' ? <BitcoinLogo size={20} /> : <StxIcon size={12} />}
      </Flex>
      <Flex alignItems="center" flexDirection="column">
        <Box w={2} h={3} borderRadius="50%" bg="purple" mb="-2px" zIndex="2" />
        <Box w={2} h={3} bg="orange" />
        <Box w={2} h={3} borderRadius="50%" bg="purple" mt="-2px" zIndex="2" />
      </Flex>
      <Flex
        justifyContent="center"
        position="relative"
        left="-2px"
        alignItems="center"
        p={2}
        borderRadius="full"
        bg="#f1f1f1"
        h={9}
      >
        <Text fontSize="xs" fontWeight="bold" color="black">
          $68,297
        </Text>
      </Flex>
    </Flex>
  );
}
