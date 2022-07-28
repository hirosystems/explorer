import React, { memo } from 'react';
import { SkeletonAccountTransactionList } from '@components/loaders/skeleton-transaction';
import { Box, BoxProps, color, Flex, FlexProps, Stack } from '@stacks/ui';
import { AddressLink } from '@components/links'
import { truncateMiddle, border } from '@common/utils';
import { Caption, Text, Title } from '@components/typography';
import { Section } from '@components/section';
import { HoverableItem } from '@components/hoverable';
import { IdentIcon } from '@features/address/avatar';
import { css } from '@emotion/react';



export interface FollowerListItemProps extends BoxProps {
    title: string;
    isLast?: boolean;
    address: string;
  }

const profilePictureCss = css`
  border-radius: 50%;
  width: 46px;
  height: 46px;
  overflow: hidden;
  border: 1px solid #bebebe;
`;

 export const InnerFollowerListItem: React.FC<{ title: string; address: string  }> = React.memo(
    ({title, address, ...rest}) => {
      return (
        <Flex
          justifyContent="space-between"
          py="loose"
          color={color('text-body')}
          _hover={{
            borderLeftColor: color('accent'),
          }}
          as="a"
          {...rest}
        >
          <Stack as="span" isInline alignItems="center" spacing="base">
            <Box css={profilePictureCss}>
            <IdentIcon seed={address} size={7} scale={6} />
            </Box>
            <Stack spacing="tight" as="span">
              <Flex color={color('text-title')} alignItems="center">
                <Title display="block" color='text-caption'>
                  {truncateMiddle(address)}
                </Title>
              </Flex>
              <Caption display="block">
                {title}
              </Caption>
            </Stack>
          </Stack>
        </Flex>
      );
    });
  

export const FollowerListItem: React.FC< {follower: FollowerListItemProps}> = memo( ({ follower })=> {
    const { title, isLast, address, ...rest } = follower;
    return (
        <HoverableItem >
        
            <AddressLink principal={address} {...rest}>
               <InnerFollowerListItem title={title} address={address} />
            </AddressLink>
        
        </HoverableItem>
    );
});

export const FollowerList: React.FC< FlexProps & {followers: FollowerListItemProps[]}> = ({followers, ...props}) => {
    if (followers.length === 0) {
        // TODO: replace
        return <SkeletonAccountTransactionList />;
    }

    return (
        <Section {...props}>
            <Flex flexDirection="column" flexGrow={1} px="loose">
                {followers.map( (follower: FollowerListItemProps, itemIndex: number) => (
                    <FollowerListItem
                        follower={follower}
                    />
                    )
                )}
            </Flex>
        </Section>
    )
}