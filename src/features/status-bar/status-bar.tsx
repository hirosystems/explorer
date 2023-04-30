import { Box, Flex, Icon, TextLink } from '@/ui/components';
import { Text } from '@/ui/typography';
import { css } from '@emotion/react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';

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
  z-index: 2;
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
