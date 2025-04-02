import { ListValueType } from '@/app/sandbox/types/values';
import { getTuple } from '@/app/sandbox/utils';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { X } from '@phosphor-icons/react';
import { FieldArray } from 'formik';
import { FC } from 'react';

import { ClarityAbiTypeList } from '@stacks/transactions';

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
        <Stack gap={4} w="full">
          <Text textStyle="text-medium-sm" as={'label'}>
            {name}
          </Text>
          <Stack gap={4} w="full">
            {value.map((listItemValue, i) => (
              <Flex alignItems={'center'} gap={2.5}>
                <Argument
                  name={`${name}.${i}`}
                  type={listItemsType}
                  handleChange={handleChange}
                  error={error}
                  value={listItemValue}
                />
                <Icon h={3} w={3} mt={6} style={{ cursor: 'pointer' }} onClick={() => remove(i)}>
                  <X />
                </Icon>
              </Flex>
            ))}
          </Stack>
          <Button
            variant="redesignPrimary"
            w="fit-content"
            onClick={() => push(emptyEntry)}
            isDisabled={value.length >= maxLength}
          >
            {value.length >= maxLength ? 'Maximum list size reached' : '+ Add list item'}
          </Button>
        </Stack>
      )}
    </FieldArray>
  );
};
