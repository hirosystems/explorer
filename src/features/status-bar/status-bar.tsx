'use client';

import { IS_BROWSER } from '@/common/constants';
import { Box, Flex, Icon, TextLink } from '@/ui/components';
import { Text } from '@/ui/typography';
import { css } from '@emotion/react';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';
import { RiCloseLine } from 'react-icons/ri';

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
  // width: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // padding: 20px 0;
`;

const wrapperStyle = css`
  max-width: 1280px;
  padding: 16px 0;
  @keyframes breathe {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.7);
    }
  }

  @keyframes jump {
    from {
      transform: scale(1) rotateY(0);
    }
    40% {
      transform: scale(3) rotateY(800deg);
      filter: hue-rotate(-40deg);
      filter: drop-shadow(0 0 20px rgba(0,0,0,.6))
    }
    70% {
      transform: scale(.6);
    }
    100%{
      transform: scale(1);
    }
  }

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
      <Flex css={wrapperStyle}>
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
      <Icon as={BsExclamationTriangle} color={`black`} width={`16px`} height={`16px;`} />
    );
  return (
    <Flex
      alignItems={'start'}
      align-content={`start`}
      justifyContent={'center'}
      borderTop={`8px solid rgba(255, 191, 0, 1)`}
      backdropFilter={`blur(10px)`}
      boxShadow={`
      inset 0px -100px 50px -40px rgba(0,0,0,0.3),
      inset 0px -10px 30px -10px rgba(0,0,0,0.5)
      `}
      color={'var(--stacks-colors-white)'}
      backgroundColor={`rgba(0,0,0,.1)`}
      backgroundImage={`radial-gradient(ellipse at top, rgba(255, 191, 0, .3) 0%, transparent 100%);`}
    >
      <Flex css={wrapperStyle} gap={'16px'}>
        <Box position={`relative`}>
          <Box
            alignSelf={`start`}
            display={`flex`}
            alignItems={`center`}
            justifyContent={`center`}
            size={`40px`}
            borderRadius={`1000px`}
            background={`rgba(255, 191, 0, 1)`}
            animation={`1.4s ease-in-out 2 alternate jump`}
          >
            {icon}
          </Box>

          <Box
            background={`transparent`}
            position={`absolute`}
            left={`0`}
            top={`0`}
            size={`40px`}
            zIndex={`-1`}
            borderRadius={`1000px`}
            boxShadow={`0 0 20px rgba(255, 191, 0, .7)`}
            animation={`1s ease-in-out infinite alternate breathe`}
            animationDelay={`1.6s`}
          ></Box>
        </Box>

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
