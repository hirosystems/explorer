// @ts-nocheck
import React from 'react';
import { Box, Flex, Stack, color, Grid, transition, Fade, Transition, FlexProps } from '@stacks/ui';
import { Title } from '@components/typography';
import { border } from '@common/utils';
import { Toggle } from '@components/toggle';
import { atom, useRecoilState } from 'recoil';
import { IconButton } from '@components/icon-button';
import CheckboxBlankCircleOutlineIcon from 'mdi-react/CheckboxBlankCircleOutlineIcon';
import { Tag } from '@components/tags';
import { filterState } from '@store/sandbox';
import CloseIcon from 'mdi-react/CloseIcon';
import { useHover } from 'use-events';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';

const CheckableElement = ({ type, value: toggled, onClick, ...rest }) => {
  const [isHovered, bind] = useHover();
  const handleClick = () => {
    onClick?.(type, !toggled);
  };

  const Icon = toggled ? CheckboxMarkedCircleOutlineIcon : CheckboxBlankCircleOutlineIcon;

  return (
    <Flex
      onClick={handleClick}
      _hover={{ cursor: 'pointer' }}
      alignItems="center"
      {...bind}
      {...rest}
    >
      <IconButton
        color={toggled ? color('accent') : color('text-caption')}
        isHovered={isHovered}
        mr="tight"
        icon={Icon}
        size="24px"
        iconSize="16px"
        dark
      />
      <Tag border={border()} type={type} />
    </Flex>
  );
};

const getTypes = (currentTypes, { type, enabled }) => {
  if (enabled) {
    return [...new Set([...currentTypes, type])];
  }
  return currentTypes.filter(_type => type !== _type);
};

export const FilterPanel = () => {
  const [filter, setFilterState] = useRecoilState(filterState);

  const handleChangeType = (type, enabled) => {
    setFilterState(state => {
      const newTypes = getTypes(state.types, { type, enabled });
      return {
        ...state,
        types: newTypes,
      };
    });
  };

  const handleClose = () => {
    setFilterState(state => ({ ...state, showing: false }));
  };

  return (
    <Flex
      height="100%"
      width="100%"
      left="0"
      flexGrow={1}
      position="absolute"
      top="34px"
      overflow="hidden"
      flexDirection="column"
    >
      <Box
        position="absolute"
        top={0}
        left="0"
        width="100%"
        bg={color('border')}
        height="1px"
        zIndex={999999}
      />
      <Transition
        transition={`all 280ms cubic-bezier(0.4, 0, 0.2, 1)`}
        timeout={{ enter: 50, exit: 150 }}
        styles={{
          init: {
            transform: 'translateY(-100%)',
            // opacity: 0,
          },
          entered: { transform: 'translateY(0)', opacity: 1 },
          exiting: {
            transform: 'translateY(0)',
            opacity: '0',
          },
        }}
        in={filter.showing}
      >
        {styles => (
          <Box
            zIndex={100}
            p="base"
            pb="loose"
            top="1px"
            bg={color('bg-light')}
            width="100%"
            borderRadius="0 0 16px 16px"
            willChange="transform, opacity"
            style={styles}
          >
            <Box
              position="absolute"
              top={'-48px'}
              left="0"
              width="100%"
              bg={color('bg-light')}
              height="50px"
            />
            <Flex pb="base" alignItems="center" justifyContent="space-between">
              <Title>Filter transactions</Title>
              <IconButton onClick={handleClose} dark icon={CloseIcon} />
            </Flex>
            <Flex justifyContent="space-between">
              <Stack alignItems="flex-start" spacing="base">
                {types.map(type => (
                  <CheckableElement
                    onClick={handleChangeType}
                    value={!!filter.types.find(_type => _type === type)}
                    type={type}
                    key={type}
                  />
                ))}
              </Stack>
              <Stack alignItems="flex-end" spacing="base">
                <Toggle
                  value={filter.showPending}
                  onClick={() =>
                    setFilterState(state => ({ ...state, showPending: !state.showPending }))
                  }
                  label="Show pending"
                />
                <Toggle
                  value={filter.showFailed}
                  onClick={() =>
                    setFilterState(state => ({ ...state, showFailed: !state.showFailed }))
                  }
                  label="Show failed"
                />
              </Stack>
            </Flex>
          </Box>
        )}
      </Transition>
      <Fade timeout={250} in={filter.showing}>
        {styles => (
          <Box
            onClick={handleClose}
            position="absolute"
            top="0"
            left={0}
            width="100%"
            height="calc(100% - 33px)"
            bg="rgba(0,0,0,0.5)"
            zIndex={99}
            style={styles}
          />
        )}
      </Fade>
    </Flex>
  );
};
