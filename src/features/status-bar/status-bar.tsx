'use client';

import { Box, Flex, Icon, TextLink } from '@/ui/components';
import { Text } from '@/ui/typography';
import { css } from '@emotion/react';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';
import { RiCloseLine } from 'react-icons/ri';
import { IS_BROWSER } from '@/common/constants';

export enum Indicator {
  none = 'none',
  minor = 'minor',
  major = 'major',
  critical = 'critical',
}
interface StatusProps {
  description: string;
  indicator: Indicator;
}

const backgroundStyle = css`
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

const wrapperStyle = css`
  width: 100%;
  max-width: 1280px;
  padding: 0 32px;
`;

const getColor = (indicator: Indicator) =>
  indicator === Indicator.critical ? '#C83532' : '#A96500';

export const StatusBar: FC = () => {
  const [status, setStatus] = useState<StatusProps>({
    description: '',
    indicator: Indicator.none,
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://status.hiro.so/api/v2/status.json');
        const data = await response.json();
        setStatus(data.status);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  const { indicator, description } = status;
  return (
    <StatusBarBase
      indicator={indicator}
      content={
        <>
          <Text color={getColor(indicator)} fontWeight={500} fontSize={'14px'} lineHeight={'1.5'}>
            {description}
            {description.endsWith('.') ? '' : '.'}
          </Text>{' '}
          <Text fontWeight={400} fontSize={'14px'} color={'#000'} lineHeight={'1.5'}>
            More information on the{' '}
            <TextLink
              href="https://status.hiro.so/"
              target="_blank"
              css={css`
                display: inline;
              `}
            >
              Hiro status page
            </TextLink>
            .
          </Text>
        </>
      }
    />
  );
};

export const StatusBarBase: FC<{ indicator: Indicator; content: ReactNode }> = ({
  content,
  indicator,
}) => {
  if (indicator === Indicator.none) return null;
  const icon =
    indicator === Indicator.critical ? (
      <Icon as={BsExclamationCircle} color={getColor(indicator)} />
    ) : (
      <Icon as={BsExclamationTriangle} color={getColor(indicator)} />
    );
  return (
    <Box css={backgroundStyle}>
      <Flex css={wrapperStyle} alignItems={'center'} justifyContent={'center'} gap={'20px'}>
        {icon}
        {content}
      </Flex>
    </Box>
  );
};

export const AlertBarBase: FC<{
  indicator: Indicator;
  content: ReactNode;
  dismissLSKey?: string;
}> = ({ content, indicator, dismissLSKey }) => {
  const [hideAlert, setHideAlert] = useState(false);
  const localStorage = IS_BROWSER && (window as any).localStorage;
  useEffect(() => {
    if (dismissLSKey) setHideAlert(localStorage?.getItem?.(dismissLSKey) === 'true' || false);
  }, [dismissLSKey, localStorage]);
  if (hideAlert || indicator === Indicator.none) return null;
  const icon =
    indicator === Indicator.critical ? (
      <Icon as={BsExclamationCircle} color={getColor(indicator)} />
    ) : (
      <Icon as={BsExclamationTriangle} color={getColor(indicator)} />
    );
  return (
    <Flex
      backgroundColor={'#FDF1DD'}
      width={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      padding={'16px 0 19px 0'}
    >
      <Flex css={wrapperStyle} gap={'16px'}>
        {icon}
        {content}
        {!!dismissLSKey && (
          <Icon
            as={RiCloseLine}
            size={4}
            color={'textCaption'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setHideAlert(true);
              localStorage.setItem(dismissLSKey, 'true');
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};
