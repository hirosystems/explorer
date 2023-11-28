'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { HiOutlineExclamation } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';

import { Box } from '../../../ui/Box';
import { Flex, FlexProps } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Text, Title } from '../../../ui/typography';

interface AlertError {
  name?: string;
  message?: string;
}

interface AlertProps {
  error: AlertError;
  clearError?: () => void;
  showClearErrors?: boolean;
}

export const Alert: React.FC<AlertProps & FlexProps> = ({
  error,
  clearError,
  showClearErrors,
  ...rest
}) => {
  const clearErrors = () => console.log('clear');
  const colorMode = useColorMode().colorMode;

  return error ? (
    <Flex
      borderRadius="12px"
      borderWidth={'1px'}
      alignItems={['flex-start', 'flex-start', 'center']}
      color="#F9A14D"
      bg={`bg.${colorMode}`}
      py="8px"
      px="16px"
      flexDirection={['column', 'column', 'row']}
      mt="24px"
      {...rest}
    >
      <Flex
        borderRadius="12px 0 0 12px"
        bg={'bg'}
        py={['none', 'none', '8px']}
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={HiOutlineExclamation} size="24px" mr="8px" color="red" />
        {error ? (
          <Title
            fontSize="14px"
            as="h4"
            my="0"
            fontWeight={500}
            style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
          >
            {error.name}
          </Title>
        ) : null}
      </Flex>
      <Flex
        alignItems="center"
        width="100%"
        pt={['8px', '8px', 'unset']}
        pl={['unset', 'unset', '16px']}
      >
        <Text fontSize="14px" color={`textTitle.${colorMode}`} lineHeight="18px" fontWeight={400}>
          {error.message}
        </Text>

        {clearError || showClearErrors ? (
          <Box
            opacity={0.5}
            _hover={{
              cursor: 'pointer',
              opacity: 1,
            }}
            px="16px"
            ml="auto"
            color={'textBody'}
            role="button"
            title="Clear error"
            aria-label="Clear error"
            onClick={() => {
              clearErrors();
              clearError && clearError();
            }}
          >
            <RiCloseLine size="12px" />
          </Box>
        ) : null}
      </Flex>
    </Flex>
  ) : null;
};
