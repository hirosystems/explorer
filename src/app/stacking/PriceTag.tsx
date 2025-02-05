import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Text } from '@/ui/Text';

// import bitcoinPriceTagFragmentLight from '../../ui/icons/bitcoin-price-tag-fragment-light.svg';

export type PriceTagToken = 'btc' | 'stx';

export function PriceTag({ price, token }: { price: number; token: PriceTagToken }) {
  // return (
  //   <Flex h={8} alignItems="center" position="relative">
  //     <Box h={'101%'}>
  //       <BitcoinPriceTagFragmentLight />
  //     </Box>
  //     <Flex
  //       className="PRICE-CONTAINER"
  //       h={'100%'}
  //       alignItems="center"
  //       position="relative"
  //       right="1px"
  //     >
  //       <Flex
  //         // h={'calc(100% - 1px)'}
  //         h='100%'
  //         position="relative"
  //         top="0"
  //         alignItems="center"
  //         justifyContent="center"
  //         pr={3}
  //         borderTopEndRadius={'xl'}
  //         borderBottomEndRadius={'xl'}
  //         backgroundColor="#eceae8"
  //       >
  //         {/* {price} */}
  //         <Text fontSize="xs" fontWeight="bold" color="black">
  //           $68,297
  //         </Text>
  //       </Flex>
  //     </Flex>
  //   </Flex>
  // );
  const imageHeight = 40; // Height of your SVG image in pixels
  const overlapAmount = 2; // Amount of overlap between image and gradient (in pixels)
  const [imageWidth, setImageWidth] = useState(0);
  useEffect(() => {
    const img = new Image();
    img.src =
      token === 'btc'
        ? '/bitcoin-price-tag-fragment-light.svg'
        : '/stx-price-tag-fragment-light.svg';

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const calculatedWidth = imageHeight * aspectRatio;
      setImageWidth(calculatedWidth);
    };
  }, [token]);

  return (
    <Flex
      height={`${imageHeight}px`}
      width="fit-content"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        paddingRight: 'var(--stacks-space-4)',
        paddingLeft: `${imageWidth}px`, // keeps the price to the right of the image
        background:
          token === 'btc'
            ? `
            url('/bitcoin-price-tag-fragment-light.svg') no-repeat left center / auto 100%,
            linear-gradient(to right, transparent ${imageWidth - overlapAmount}px, #eceae8 ${
              imageWidth - overlapAmount
            }px) no-repeat left center / 100% 97%
          `
            : `
            url('/stx-price-tag-fragment-light.svg') no-repeat left center / auto 100%,
            linear-gradient(to right, transparent ${imageWidth - overlapAmount}px, #eceae8 ${
              imageWidth - overlapAmount
            }px) no-repeat left center / 100% 97%
          `,
      }}
      backgroundRepeat="no-repeat"
      borderRadius="0 var(--stacks-radii-full) var(--stacks-radii-full) 0"
    >
      <Text fontSize="xs" fontWeight="bold" color="black">
        {/* {price} */}
        $68,297
      </Text>
    </Flex>
  );
}
