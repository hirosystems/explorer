import { ListValueType } from '@/app/sandbox/types/values';
import { getTuple } from '@/app/sandbox/utils';
import { Button } from '@/ui/Button';
import { IconButtonRedesign } from '@/ui/IconButton';
import { Field, Flex, Stack } from '@chakra-ui/react';
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
    <Field.Root w="full" invalid={!!error}>
      <FieldArray name={name}>
        {({ push, remove }) => (
          <Stack gap={2} w="full">
            <Field.Label textStyle="text-regular-sm" color={error ? 'textError' : 'textSecondary'}>
              {name}
            </Field.Label>
            {value.length > 0 && (
              <Stack gap={4} w="full">
                {value.map((listItemValue, i) => (
                  <Flex alignItems={'center'} gap={2.5} key={`${name}.${i}`}>
                    <Argument
                      name={`${name}.${i}`}
                      type={listItemsType}
                      handleChange={handleChange}
                      error={error}
                      value={listItemValue}
                    />
                    <IconButtonRedesign
                      variant="redesignPrimary"
                      size="2xs"
                      mt={6}
                      onClick={() => remove(i)}
                    >
                      <X />
                    </IconButtonRedesign>
                  </Flex>
                ))}
              </Stack>
            )}
            <Button
              variant="redesignPrimary"
              size="xs"
              onClick={() => push(emptyEntry)}
              isDisabled={value.length >= maxLength}
            >
              {value.length >= maxLength ? 'Maximum list size reached' : '+ Add list item'}
            </Button>
          </Stack>
        )}
      </FieldArray>
    </Field.Root>
  );
};
