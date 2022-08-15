import { FC, memo, ReactNode, Fragment } from 'react';
import { Box } from '@stacks/ui';
import { css } from '@emotion/react';
import Link from 'next/link';
import { leftLineCss } from '@common/styles/hover';

interface TwoColumnsListProps {
  icon: ReactNode;
  leftContent: {
    title: ReactNode;
    subtitle: ReactNode;
  };
  rightContent: {
    title: ReactNode;
    subtitle: ReactNode;
  };
  href: string;
}

const containerStyle = css`
  display: flex;
  padding: 24px 0;
  align-items: center;
  ${leftLineCss}
`;

const linkStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const iconWrapperStyle = css`
  width: 40px;
  margin-right: 16px;
`;

const leftWrapperStyle = css`
  margin-right: 16px;
  > :first-child {
    margin-bottom: 8px;
  }
`;

const rightWrapperStyle = css`
  margin-left: auto;
  flex-shrink: 0;
`;

export const TwoColsListItem: FC<TwoColumnsListProps> = memo(
  ({ icon, leftContent, rightContent, href }) => {
    return (
      <Box css={containerStyle}>
        <Link href={href} passHref>
          <Box as="a" css={linkStyle} />
        </Link>
        <Box css={iconWrapperStyle}>{icon}</Box>
        <Box css={leftWrapperStyle}>
          <Box>{leftContent.title}</Box>
          <Box>{leftContent.subtitle}</Box>
        </Box>
        <Box css={rightWrapperStyle}>
          <Box>{rightContent.title}</Box>
          <Box>{rightContent.subtitle}</Box>
        </Box>
      </Box>
    );
  }
);
