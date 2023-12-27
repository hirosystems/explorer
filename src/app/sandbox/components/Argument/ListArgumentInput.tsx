import { FieldArray } from 'formik';
import React, { FC } from 'react';
import { RiCloseLine } from 'react-icons/ri';

import { ClarityAbiTypeList } from '@stacks/transactions';

import { Box } from '../../../../ui/Box';
import { Button } from '../../../../ui/Button';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { ListValueType } from '../../types/values';
import { getTuple } from '../../utils';
import { Argument } from './index';
import { CommonArgumentInputProps } from './types';

export const ListArgumentInput: FC<
  CommonArgumentInputProps & {
    type: ClarityAbiTypeList;
    value: ListValueType;
  }
> = ({ name, type, handleChange, error, value }) => {
  const listItemsType = type.list.type;
  const maxLength = type.list.length;
  const listTuple = getTuple(listItemsType);
  const emptyEntry = !!listTuple
    ? listTuple.reduce(
        (tupleAcc, tupleEntry) => {
          tupleAcc[tupleEntry.name] = '';
          return tupleAcc;
        },
        {} as Record<string, string | number>
      )
    : '';
  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <Box>
          <Text
            fontSize="12px"
            fontWeight="500"
            display="block"
            as={'label'}
            htmlFor={name}
            mb="8px"
          >
            {name}
          </Text>
          {value.map((listItemValue, i) => (
            <Flex mb="32px" alignItems={'center'} gap={'10px'}>
              <Argument
                name={`${name}.${i}`}
                type={listItemsType}
                handleChange={handleChange}
                error={error}
                value={listItemValue}
              />
              <Icon
                as={RiCloseLine}
                size={3}
                mt={'14px'}
                style={{ cursor: 'pointer' }}
                onClick={() => remove(i)}
              />
            </Flex>
          ))}
          <Button
            type={'button'}
            onClick={() => push(emptyEntry)}
            isDisabled={value.length >= maxLength}
          >
            {value.length >= maxLength ? 'Maximum list size reached' : '+ Add list item'}
          </Button>
        </Box>
      )}
    </FieldArray>
  );
};
