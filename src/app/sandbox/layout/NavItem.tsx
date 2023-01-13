import { Grid } from '@/ui/Grid';
import { Tooltip } from '@/ui/Tooltip';
import { useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

export const NavItem: FC<{ label: string; icon: ReactNode; isSelected?: boolean; url: string }> = ({
  label,
  icon,
  isSelected,
  url,
}) => {
  const colorMode = useColorMode().colorMode;
  return (
    <Tooltip placement="left" label={label} key={url}>
      <Link href={url} passHref style={{ margin: '0' }}>
        <Grid
          bg={isSelected ? `block.${colorMode}` : `bg.${colorMode}`}
          borderBottomWidth="1px"
          borderRightWidth="1px"
          size="72px"
          placeItems="center"
          justifyContent="center"
          color={`textTitle.${colorMode}`}
          _hover={{
            cursor: 'pointer',
            bg: `block.${colorMode}`,
          }}
        >
          {icon}
        </Grid>
      </Link>
    </Tooltip>
  );
};
