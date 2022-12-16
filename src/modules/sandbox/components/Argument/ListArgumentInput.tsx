import { FieldArray } from 'formik';
import React, { FC } from 'react';

import { ClarityAbiTypeList } from '@stacks/transactions';
import { Box, Button, CloseIcon, Flex, color } from '@stacks/ui';

import { Text } from '@components/typography';

import { Argument } from '.';
import { ListValueType } from '../../types';
import { getTuple } from '../../utils';
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
    ? listTuple.reduce((tupleAcc, tupleEntry) => {
        tupleAcc[tupleEntry.name] = '';
        return tupleAcc;
      }, {} as Record<string, string | number>)
    : '';
  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <Box>
          <Text fontSize="12px" fontWeight="500" display="block" htmlFor={name} mb="tight">
            {name}
          </Text>
          {value.map((listItemValue, i) => (
            <Flex mb="extra-loose" spacing="base" alignItems={'center'} gap={'10px'}>
              <Argument
                name={`${name}.${i}`}
                type={listItemsType}
                handleChange={handleChange}
                error={error}
                value={listItemValue}
              />
              <CloseIcon
                size={3}
                mt={'14px'}
                color={color('text-caption')}
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
