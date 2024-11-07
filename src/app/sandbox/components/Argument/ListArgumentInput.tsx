import { Box, Flex, Icon } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { FieldArray } from 'formik';
import { FC } from 'react';

import { ClarityAbiTypeList } from '@stacks/transactions';

import { Button } from '../../../../ui/Button';
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
          <Text fontSize="12px" fontWeight="500" display="block" as={'label'} mb={4}>
            {name}
          </Text>
          {value.map((listItemValue, i) => (
            <Flex mb={8} alignItems={'center'} gap={2.5}>
              <Argument
                name={`${name}.${i}`}
                type={listItemsType}
                handleChange={handleChange}
                error={error}
                value={listItemValue}
              />
              <Icon h={3} w={3} mt={3.5} style={{ cursor: 'pointer' }} onClick={() => remove(i)}>
                <X />
              </Icon>
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
