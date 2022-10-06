import { Box, Text } from '@stacks/ui';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';
import { Link } from 'components/link';

enum Indicator {
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

const iconStyle = css`
  margin-right: 9px;
  position: relative;
  top: 2px;
`;

export const StatusBar: React.FC = () => {
  const [status, setStatus] = useState<StatusProps>({
    description: '',
    indicator: Indicator.none,
  });
  useEffect(() => {
    void fetch('https://status.hiro.so/api/v2/status.json')
      .then(res => res.json())
      .then(data => setStatus(data.status));
  }, []);
  const { indicator, description } = status;
  if (indicator === Indicator.none) return null;
  const color = indicator === Indicator.critical ? '#C83532' : '#A96500';
  const icon =
    indicator === Indicator.critical ? (
      <BsExclamationCircle color={color} css={iconStyle} />
    ) : (
      <BsExclamationTriangle color={color} css={iconStyle} />
    );
  return (
    <Box css={backgroundStyle}>
      <Box css={wrapperStyle}>
        {icon}
        <Text color={color} fontWeight={500} fontSize={'14px'} lineHeight={'1.5'}>
          {description}
          {description.endsWith('.') ? '' : '.'}
        </Text>{' '}
        <Text fontWeight={400} fontSize={'14px'} lineHeight={'1.5'}>
          More information on the{' '}
          <Link
            href="https://status.hiro.so/"
            target="_blank"
            css={css`
              display: inline;
            `}
          >
            Hiro status page
          </Link>
          .
        </Text>
      </Box>
    </Box>
  );
};
