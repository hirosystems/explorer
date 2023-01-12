import { Formik } from 'formik';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { openContractCall } from '@stacks/connect';
import {
  FungibleConditionCode,
  FungiblePostCondition,
  NonFungibleConditionCode,
  NonFungiblePostCondition,
  STXPostCondition,
  encodeClarityValue,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { Box, Flex, Stack } from '@stacks/ui';

import { Dropdown } from '@components/Dropdown';
import { Section } from '@components/section';

import { ListValueType, NonTupleValueType, TupleValueType, ValueType } from '../../types';
import { encodeTuple, getTuple } from '../../utils';
import { Argument } from '../Argument';
import { ReadOnlyField } from './ReadOnlyField';

enum PostConditionType {
  Stx,
  Fungible,
  NonFungible,
  Principal,
}

interface PostConditionParameters {
  contractAddress: string;
  amount: number;
  conditionCode: FungibleConditionCode | NonFungibleConditionCode;
}

export const PostCondition: FC<any> = () => {
  const [postCondition, setPostCondition] = useState<
    FungiblePostCondition | NonFungiblePostCondition | STXPostCondition | undefined
  >(undefined);
  // const [contractAddress, setContractAddress] = useState(undefined);
  // const [amount, setAmount] = useState(undefined);
  // const [conditionCode, setConditionCode] = useState(undefined);
  const [postConditionParameters, setPostConditionParameters] = useState<
    Record<string, PostConditionParameters>
  >({});

  function getPostCondition(postConditionType: PostConditionType) {
    const address = '';
    const amount = 5;
    const assetInfo = 'undefined';
    //   const assetName = ClarityType.BoolFalse;
    const assetName = encodeClarityValue('principal', 'false');

    // const conditionCode:
    if (postConditionType === PostConditionType.Stx) {
      return makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, amount);
    }
    if (postConditionType === PostConditionType.Fungible) {
      return makeStandardFungiblePostCondition(
        address,
        FungibleConditionCode.Equal,
        amount,
        assetInfo
      );
    }
    if (postConditionType === PostConditionType.NonFungible) {
      return makeStandardNonFungiblePostCondition(
        address,
        NonFungibleConditionCode.DoesNotOwn,
        assetInfo,
        assetName
      );
    }
    //   if (postConditionType === PostConditionType.Stx) {
    //     return makestand();
    //   }
    throw new Error(`There is no post condition type that matches ${postConditionType}`);
  }
  return (
    <div>
      <Stack>
        <Box width={300}>
          <Dropdown
            placeholder="Select a post condition"
            options={['nick', 'nicky', 'nicholas']}
            onChange={(option: DropdownOption) => {
              if (option.value === PostConditionType.Stx) {
                setPostCondition(getPostCondition(PostConditionType.Stx));
              } else if (option.value === PostConditionType.Fungible) {
                setPostCondition(getPostCondition(PostConditionType.Fungible));
              } else if (option.value === PostConditionType.NonFungible) {
                setPostCondition(getPostCondition(PostConditionType.NonFungible));
              }
            }}
          />
        </Box>
        <Flex>
          <Stack mb="extra-loose" spacing="base">
            {Object.keys(postConditionParameters).forEach(postCondition => {
              return (
                <Argument
                  handleChange={() => {
                    console.log('nick');
                  }}
                  name={'nick'}
                  type={'principal'}
                  error={undefined}
                  key={'nick'}
                  value={'nick'}
                />
              );
            })}
          </Stack>
        </Flex>
        <Argument
          handleChange={() => {
            console.log('nick');
          }}
          name={'nick'}
          type={'principal'}
          error={undefined}
          key={'nick'}
          value={'nick'}
        />
        {/* <Argument
          handleChange={handleChange}
          name={name}
          type={type}
          error={errors[name]}
          key={name}
          value={values[name]}
        /> */}
        {/* <Button onClick={() => setPostCondition(getPostCondition(PostConditionType.Stx))}>
          Add STX Post Condition
        </Button>
        <Button onClick={() => setPostCondition(getPostCondition(PostConditionType.Fungible))}>
          Add Fungible Post Condition
        </Button>
        <Button onClick={() => setPostCondition(getPostCondition(PostConditionType.NonFungible))}>
          Add NonFungible Post Condition
        </Button>
        <Button onClick={() => setPostCondition(getPostCondition(PostConditionType.Principal))}>
          Add Principal Post Condition
        </Button> */}
      </Stack>
    </div>

    // <Menu>
    //   <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    //     Actions
    //   </MenuButton>
    //   <MenuList>
    //     <MenuItem>Download</MenuItem>
    //     <MenuItem>Create a Copy</MenuItem>
    //     <MenuItem>Mark as Draft</MenuItem>
    //     <MenuItem>Delete</MenuItem>
    //     <MenuItem>Attend a Workshop</MenuItem>
    //   </MenuList>
    // </Menu>
  );
};
