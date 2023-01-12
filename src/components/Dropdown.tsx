import styled from '@emotion/styled';
import * as React from 'react';

import { Box, Button, ChevronIcon, Flex } from '@stacks/ui';

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

  const toggle = () => setIsOpen(!isOpen);

  if (isOpen) {
    console.log('open', { options });
  }
  return (
    <DropdownMenu onClick={toggle}>
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
                  <Flex alignItems="center" borderBottom={border()} py="base">
                    <Text
                      fontSize="14px"
                      display="block"
                      // color={color('text-caption')}
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

const DropdownMenu = styled.div`
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
    /* background-color: white; */
    border: 1px solid border();
    /* border: 1px solid; */

    
    li {
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
      border-bottom: 1px solid var(--colors-border);
      border-left: 1px solid var(--colors-border);
      border-right: 1px solid var(--colors-border);
      padding-left: 8px;
      :hover {
        background-color: #efefef;
        /* background-color: rgb(255, 40, 255); */
        /* background-color: orange; */
      }

      /* :last-child {
      border-top: '1px solid var(--colors-border)';;
    } */
    }
  }
`;
