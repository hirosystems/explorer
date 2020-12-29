// @ts-nocheck
import * as React from 'react';
import { forwardRef } from 'react';
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  IconButton,
  IconButtonProps,
  Input,
  transition,
} from '@stacks/ui';
import { SearchBarProps } from '@components/search-bar/types';
import { css, ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import { MagnifyingGlass } from '../icons/magnifying-glass';
import QuestionMarkCircleOutlineIcon from 'mdi-react/QuestionMarkCircleOutlineIcon';
import { Tooltip } from '@components/tooltip';
import { useHover } from 'use-events';
import { useSearch } from '@common/hooks/use-search';
import { useFocusWithin } from '@react-aria/interactions';

import dynamic from 'next/dynamic';

import CloseIcon from 'mdi-react/CloseIcon';

const SearchResultsCard = dynamic(() => import('../search-results'), { ssr: false });

const ClearButton: React.FC<IconButtonProps> = props => (
  <IconButton invert color="white" icon={CloseIcon} {...props} />
);

export const SearchBarWithDropdown: React.FC<Omit<SearchBarProps, 'value'>> = ({
  boxProps = {},
  recentlyViewedProps = {},
  small,
  hideBackdrop,
  ...props
}) => {
  const ref = React.useRef();
  const { setHover, query, clearQuery, setFocus } = useSearch(ref);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: e => setFocus(true),
    onBlurWithin: e => setFocus(false),
  });

  const [isHovered, bind] = useHover();

  React.useEffect(() => {
    setHover(isHovered);
  }, [isHovered]);
  return (
    <Flex
      alignItems="center"
      width="100%"
      as="form"
      autoComplete="off"
      position="relative"
      {...(boxProps as any)}
      {...bind}
      {...props}
      {...focusWithinProps}
    >
      <Box mr="base" flexGrow={1} position="relative">
        <Flex position="relative" alignItems="center">
          <Search ref={ref} small={small} />
          {query && <ClearButton position="absolute" onClick={clearQuery} right="base" />}
        </Flex>
        <HelperNotice />
      </Box>
      <SearchResultsCard />
    </Flex>
  );
};
