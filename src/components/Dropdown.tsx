import styled from '@emotion/styled';
import * as React from 'react';
import { FaRegBell } from 'react-icons/fa';

import { Box, Button, ChevronIcon, ColorModeString, Flex, color, useColorMode } from '@stacks/ui';

import { border } from '@common/utils';

import { Text } from '@components/typography';

interface DropdownProps {
  options: Option[];
  onChange?: (option: Option) => void;
  defaultOption?: Option;
  optionRenderer?: (option: Option) => React.ReactNode;
}

interface Option {
  label: string;
  value: any;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  defaultOption,
  onChange,
  optionRenderer,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option>(defaultOption ?? options[0]);
  const { colorMode } = useColorMode();

  const toggle = () => setIsOpen(!isOpen);

  if (isOpen) {
    console.log('open', { options });
  }
  return (
    <DropdownMenu onClick={toggle} colorMode={colorMode}>
      <Button width="100%" height="100%">
        <Flex alignItems="center" whiteSpace="nowrap">
          <Box>{selected.label}</Box>
          <ChevronIcon display="inline" size="24px" direction={isOpen ? 'up' : 'down'} />
        </Flex>
      </Button>
      {isOpen && (
        <Flex>
          <ul className="dropdown-menu">
            {options.map(option => (
              <li
                key={option.label}
                onClick={() => {
                  onChange?.(option);
                  setSelected(option);
                  toggle();
                }}
              >
                {optionRenderer ? (
                  optionRenderer(option)
                ) : (
                  <Flex alignItems="center" py="base">
                    <Text
                      fontSize="14px"
                      display="block"
                      color={color('text-title')}
                      mb="tight"
                      margin={0}
                    >
                      {option.label}
                    </Text>
                  </Flex>
                )}
              </li>
            ))}
          </ul>
        </Flex>
      )}
    </DropdownMenu>
  );
};

const DropdownMenu = styled.div<{ colorMode: ColorModeString | undefined }>`
  height: 100%;
  overflow: visible;
  position: relative;

  ul {
    width: 100%;
    padding: 0;
    margin: 0;

    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    right: 0;

    li {
      background-color: ${props => (props.colorMode === 'light' ? color('bg') : 'rgb(41, 41, 41)')};
      border: ${border()};

      list-style: none;
      :first-child {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      :last-child {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
      }
      width: 100%;
      border-top: 1px solid ${border()};
      padding-left: 8px;
      :hover {
        background-color: ${props => (props.colorMode === 'light' ? '#efefef' : '#9c9ca2')};
      }
    }
  }
`;
