import React from 'react';
import Image from 'next/image';
import { Box, Stack, color } from '@stacks/ui';
import { Pre, Text, Title } from '@components/typography';

import { border } from '@common/utils';

const H1: React.FC = props => <Title as="h1" {...props} />;
const H2: React.FC = props => <Title as="h2" {...props} />;
const H3: React.FC = props => <Title as="h3" {...props} />;
const P: React.FC = props => (
  <Text maxWidth="76ch" color={color('text-body')} lineHeight="28px" {...props} />
);
const Ul: React.FC = props => (
  <Stack
    mt="0"
    spacing="base"
    maxWidth="76ch"
    as="ul"
    color={color('text-body')}
    lineHeight="26px"
    {...props}
  />
);
const Li: React.FC = props => (
  <Text as="li" display="list-item" color={color('text-body')} lineHeight="28px" {...props} />
);

const Img: React.FC = ({ dimensions, ...rest }: any) => {
  return (
    <Box bg={color('bg-4')} borderRadius="18px" overflow="hidden" border={border()}>
      <Image
        layout="responsive"
        width={`${dimensions.width / 2}px`}
        height={`${dimensions.height / 2}px`}
        {...rest}
      />
    </Box>
  );
};

export const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  li: Li,
  inlineCode: Pre,
  img: Img,
};
