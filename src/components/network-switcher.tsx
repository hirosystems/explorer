import React from 'react';
import { HeaderTextItem } from '@components/header-text-item';
import { Box, BoxProps, color, Fade, Flex, FlexProps, Stack } from '@stacks/ui';
import { IconCheck, IconChevronDown } from '@tabler/icons';
import { useHover } from 'web-api-hooks';
import { useNetwork } from '@common/hooks/use-network';
import { Caption, Title } from '@components/typography';
import { border } from '@common/utils';
import { useModal } from '@common/hooks/use-modal';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetchFromSidecar } from '@common/api/fetch';
import { NetworkSwitchModal } from '@components/modals/add-network';

const DropdownItem: React.FC<FlexProps & { isDisabled?: boolean; isActive?: boolean }> = ({
  isActive,
  isDisabled,
  ...props
}) => {
  return (
    <Flex
      opacity={isDisabled ? 0.5 : 1}
      alignItems="center"
      justifyContent="space-between"
      px="extra-loose"
      py="base"
      position="relative"
      zIndex="999"
      bg={isDisabled ? 'bg-4' : 'bg'}
      cursor={isDisabled ? 'not-allowed' : 'unset'}
      _hover={{
        bg: isDisabled ? 'unset' : isActive ? 'unset' : color('bg-alt'),
        cursor: isDisabled ? 'not-allowed' : isActive ? 'default' : 'pointer',
      }}
      {...props}
    />
  );
};

const Item: React.FC<
  FlexProps & {
    item: { label: string; url: string };
    isActive?: boolean;
    isDisabled?: boolean;
  }
> = ({ item, isActive, isDisabled, ...rest }) => {
  const { error } = useSWR(isDisabled ? null : item.url, async () =>
    fetchFromSidecar(item.url)('/status')
  );

  return (
    <DropdownItem isActive={isActive} isDisabled={isDisabled || !!error?.message} {...rest}>
      <Stack flexGrow={1} spacing="tight">
        <Title display="block">{item.label}</Title>
        <Caption display="block">
          {item.url.includes('//') ? item.url.split('//')[1] : item.url}
        </Caption>
      </Stack>
      {isActive ? <Box as={IconCheck} color={color('feedback-success')} size="18px" /> : null}
      {!!error?.message ? <Caption color={color('feedback-error')}>Offline</Caption> : null}
    </DropdownItem>
  );
};

const Dropdown: React.FC<BoxProps & { show?: boolean }> = React.memo(({ show, ...props }) => {
  const { list, index, handleUpdateCurrentIndex } = useNetwork();
  const { setOpenModal } = useModal();
  const router = useRouter();
  const showing = list && list?.length && show;

  return list && list?.length ? (
    <Fade in={!!showing}>
      {styles => (
        <Box top="100%" pt="base" right={0} position="absolute" style={styles}>
          <Box
            overflow="hidden"
            boxShadow="mid"
            minWidth="342px"
            bg={color('bg')}
            borderRadius="8px"
            pt="tight"
          >
            <Item
              isDisabled
              item={{
                label: 'Mainnet',
                url: 'Coming soon',
              }}
            />
            {list?.map((item, key) => {
              const isActive = key === index;
              return (
                <Item
                  isActive={isActive}
                  item={item}
                  key={key}
                  onClick={() => {
                    if (!isActive) {
                      handleUpdateCurrentIndex(key);
                      router.reload();
                    }
                  }}
                />
              );
            })}
            <DropdownItem onClick={() => setOpenModal('network')} py="loose" borderTop={border()}>
              <Title fontWeight={400}>Add a network</Title>
            </DropdownItem>
          </Box>
        </Box>
      )}
    </Fade>
  ) : null;
});

export const NetworkSwitcherItem: React.FC<BoxProps> = props => {
  const [isHovered, bind] = useHover();

  return (
    <>
      <HeaderTextItem
        textDecoration="none !important"
        display="flex"
        alignItems="center"
        position="relative"
        _hover={{
          cursor: 'pointer',
        }}
        {...bind}
        {...props}
      >
        Network
        <Box as={IconChevronDown} size="14px" ml="tight" />
        <Dropdown show={isHovered} />
      </HeaderTextItem>
      <NetworkSwitchModal />
    </>
  );
};
