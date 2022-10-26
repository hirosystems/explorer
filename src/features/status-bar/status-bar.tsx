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
    description: 'Stacks Miners — Upgrade to  2.05.0.5.1 NOW!',
    indicator: Indicator.critical,
  });

  const { indicator, description } = status;
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
        </Text>
        <Text fontWeight={400} fontSize={'14px'} lineHeight={'1.5'} mt={'10px'}>
          ATTENTION: Stacks miners! Please upgrade to 2.05.0.5.1 NOW! Follow Stacks Status for more
          details:{' '}
          <Link
            href="https://twitter.com/stacksstatus"
            target="_blank"
            css={css`
              display: inline;
            `}
          >
            https://twitter.com/stacksstatus
          </Link>
        </Text>
      </Box>
    </Box>
  );
};
