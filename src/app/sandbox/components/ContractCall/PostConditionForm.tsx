import { CaretDown } from '@phosphor-icons/react';
import { Field, FormikErrors } from 'formik';
import { useMemo, useState } from 'react';

import {
  ClarityAbiFunction,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostCondition,
  PostConditionMode,
  PostConditionType,
  createAssetInfo,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  validateStacksAddress,
} from '@stacks/transactions';

import { isUint128 } from '../../../../common/utils/number-utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Icon } from '../../../../ui/Icon';
import { Input } from '../../../../ui/Input';
import { Menu } from '../../../../ui/Menu';
import { MenuButton } from '../../../../ui/MenuButton';
import { MenuItem } from '../../../../ui/MenuItem';
import { MenuList } from '../../../../ui/MenuList';
import { Stack } from '../../../../ui/Stack';
import { Text } from '../../../../ui/Text';
import { Caption } from '../../../../ui/typography';
import { NonTupleValueType } from '../../types/values';
import { FormikSetFieldValueFunction, FunctionFormikState } from './FunctionView';

type PostConditionConditionCode = FungibleConditionCode | NonFungibleConditionCode;

export interface PostConditionParameters {
  postConditionMode?: PostConditionMode;
  postConditionType?: PostConditionType;
  postConditionAddress?: string;
  postConditionConditionCode?: PostConditionConditionCode;
  postConditionAmount?: number;
  postConditionAssetAddress?: string;
  postConditionAssetContractName?: string;
  postConditionAssetName?: string;
}

export type PostConditionParameterKeys = keyof PostConditionParameters;

export const postConditionParameterMap: Record<PostConditionType, PostConditionParameterKeys[]> = {
  [PostConditionType.STX]: [
    'postConditionAddress',
    'postConditionConditionCode',
    'postConditionAmount',
  ],
  [PostConditionType.Fungible]: [
    'postConditionAddress',
    'postConditionConditionCode',
    'postConditionAmount',
    'postConditionAssetAddress',
    'postConditionAssetContractName',
    'postConditionAssetName',
  ],
  [PostConditionType.NonFungible]: [
    'postConditionAddress',
    'postConditionConditionCode',
    'postConditionAssetAddress',
    'postConditionAssetContractName',
    'postConditionAssetName',
  ],
};

export function isPostConditionParameter(key: string): key is keyof PostConditionParameters {
  const postConditionKeys: Array<keyof PostConditionParameters> = [
    'postConditionMode',
    'postConditionType',
    'postConditionAddress',
    'postConditionConditionCode',
    'postConditionAmount',
    'postConditionAssetAddress',
    'postConditionAssetContractName',
    'postConditionAssetName',
  ];
  return postConditionKeys.includes(key as keyof PostConditionParameters);
}

export const postConditionParameterLabels: Record<string, string> = {
  postConditionAddress: 'Address',
  postConditionConditionCode: 'Condition Code',
  postConditionAmount: 'Amount',
  postConditionAssetAddress: 'Asset Address',
  postConditionAssetContractName: 'Asset Contract Name',
  postConditionAssetName: 'Asset Name',
};

export const PostConditionOptions = [
  { label: 'STX Post Condition', value: PostConditionType.STX },
  { label: 'Fungible Post Condition', value: PostConditionType.Fungible },
  { label: 'Non-Fungible Post Condition', value: PostConditionType.NonFungible },
];

export function getPostCondition(
  postConditionParameters: PostConditionParameters
): PostCondition[] {
  const {
    postConditionType,
    postConditionAddress,
    postConditionConditionCode,
    postConditionAmount,
    postConditionAssetAddress,
    postConditionAssetContractName,
    postConditionAssetName,
  } = postConditionParameters;
  let postCondition;

  if (postConditionType === PostConditionType.STX) {
    if (
      postConditionAddress &&
      postConditionConditionCode &&
      postConditionAmount != null &&
      isUint128(postConditionAmount)
    ) {
      postCondition = makeStandardSTXPostCondition(
        postConditionAddress,
        postConditionConditionCode as FungibleConditionCode,
        postConditionAmount
      );
    }
  } else if (postConditionType === PostConditionType.Fungible) {
    if (
      postConditionAddress &&
      postConditionAssetAddress &&
      postConditionAssetContractName &&
      postConditionAssetName &&
      postConditionConditionCode &&
      postConditionAmount != null &&
      isUint128(postConditionAmount)
    ) {
      const assetInfo = createAssetInfo(
        postConditionAssetAddress,
        postConditionAssetContractName,
        postConditionAssetName
      );
      postCondition = makeStandardFungiblePostCondition(
        postConditionAddress,
        postConditionConditionCode as FungibleConditionCode,
        postConditionAmount,
        assetInfo
      );
    }
  } else if (postConditionType === PostConditionType.NonFungible) {
    if (
      postConditionAddress &&
      postConditionAssetAddress &&
      postConditionAssetContractName &&
      postConditionAssetName &&
      postConditionConditionCode
    ) {
      const assetInfo = createAssetInfo(
        postConditionAssetAddress,
        postConditionAssetContractName,
        postConditionAssetName
      );
      postCondition = makeStandardNonFungiblePostCondition(
        postConditionAddress,
        postConditionConditionCode as NonFungibleConditionCode,
        assetInfo,
        stringAsciiCV(postConditionAssetName)
      );
    }
  } else {
    throw new Error(`There is no post condition type that matches ${postConditionType}`);
  }

  return [postCondition as PostCondition];
}

export const checkFunctionParameters = (fn: ClarityAbiFunction, values: FunctionFormikState) => {
  const errors: Record<string, string> = {};
  Object.keys(values).forEach(arg => {
    if (isPostConditionParameter(arg as PostConditionParameterKeys)) return;
    const type = fn.args.find(({ name }) => name === arg)?.type;
    const isOptional = type && isClarityAbiOptional(type);
    const optionalTypeIsPrincipal =
      isOptional && isClarityAbiPrimitive(type.optional) && type.optional === 'principal';
    if (!isOptional && (values[arg] == null || values[arg] === '')) {
      errors[arg] = `${arg} is required`;
      return;
    }
    if (type === 'principal' || (optionalTypeIsPrincipal && !!values[arg])) {
      const validPrincipal = validateStacksAddress(
        (values[arg] as NonTupleValueType).toString().split('.')[0]
      );
      if (!validPrincipal) {
        errors[arg] = 'Invalid Stacks address';
        return;
      }
    }
    if (type === 'uint128' && !isUint128(values[arg] as number)) {
      errors[arg] = 'Invalid uint128 value';
      return;
    }
  });
  return errors;
};

export const checkPostConditionParameters = (
  formikState: FunctionFormikState
): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (formikState.postConditionMode === PostConditionMode.Allow) return errors;
  if (formikState.postConditionType == null) {
    errors.postConditionType = 'Post condition type is required';
  }
  const postConditionParameters =
    postConditionParameterMap[formikState.postConditionType as PostConditionType];
  postConditionParameters?.forEach(key => {
    if (formikState[key] == null) {
      errors[key] = `${postConditionParameterLabels[key]} is required`;
      return;
    }
    if (
      (key === 'postConditionAddress' || key === 'postConditionAssetAddress') &&
      !validateStacksAddress(formikState[key] as string)
    ) {
      errors[key] = 'Invalid Stacks address';
      return;
    }
    if (key === 'postConditionAmount') {
      if (
        typeof formikState[key] !== 'number' ||
        !Number.isFinite(formikState[key]) ||
        (formikState[key] as number) < 0
      ) {
        errors[key] = 'Invalid amount';
        return;
      }
    }
  });
  return errors;
};

interface Option<T> {
  label: string;
  value: T;
}

function getPostConditionConditionCodeOptions(
  postConditionType: PostConditionType
): Option<PostConditionConditionCode>[] {
  if (postConditionType === PostConditionType.NonFungible) {
    return [
      {
        label: 'Does not send',
        value: NonFungibleConditionCode.DoesNotSend,
      },
      {
        label: 'Sends',
        value: NonFungibleConditionCode.Sends,
      },
    ];
  }
  return [
    {
      label: 'Equal',
      value: FungibleConditionCode.Equal,
    },
    {
      label: 'Greater',
      value: FungibleConditionCode.Greater,
    },
    {
      label: 'GreaterEqual',
      value: FungibleConditionCode.GreaterEqual,
    },
    { label: 'Less', value: FungibleConditionCode.Less },
    {
      label: 'LessEqual',
      value: FungibleConditionCode.LessEqual,
    },
  ];
}

export function PostConditionConditionCodeMenu({
  onChange,
  postConditionType,
}: {
  onChange: (option: any) => void;
  postConditionType: PostConditionType;
}) {
  const [selectedOption, setSelectedOption] = useState<
    Option<PostConditionConditionCode | undefined>
  >({
    label: 'Select a condition code',
    value: undefined,
  });
  const options = getPostConditionConditionCodeOptions(postConditionType);

  return (
    <Menu>
      <MenuButton
        type="button"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Flex gap={1}>
          <Text>{selectedOption.label}</Text>
          <Icon as={CaretDown} />
        </Flex>
      </MenuButton>
      <MenuList>
        {options.map(option => (
          <MenuItem
            key={option.label}
            onClick={e => {
              e.stopPropagation();
              setSelectedOption(option);
              onChange(option);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export function PostConditionTypeMenu({ onChange }: { onChange: (option: any) => void }) {
  const [selectedOption, setSelectedOption] = useState<Option<PostConditionType | undefined>>({
    label: 'Select a post condition',
    value: undefined,
  });
  const options = useMemo(
    () => [
      { label: 'STX Post Condition', value: PostConditionType.STX },
      { label: 'Fungible Post Condition', value: PostConditionType.Fungible },
      { label: 'Non-Fungible Post Condition', value: PostConditionType.NonFungible },
    ],
    []
  );

  return (
    <Menu>
      <Flex gap={2} alignItems="center">
        <MenuButton
          type="button"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Flex gap={1}>
            <Text>{selectedOption.label}</Text>
            <Icon as={CaretDown} />
          </Flex>
        </MenuButton>
      </Flex>
      <MenuList>
        {options.map(option => (
          <MenuItem
            key={option.label}
            onClick={e => {
              e.stopPropagation();
              setSelectedOption(option);
              onChange(option);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export function PostConditionForm({
  values,
  errors,
  formikSetFieldValue,
  handleChange,
}: {
  values: FunctionFormikState;
  errors: FormikErrors<FunctionFormikState>;
  formikSetFieldValue: FormikSetFieldValueFunction;
  handleChange: any;
}) {
  return (
    <>
      {values.postConditionMode === PostConditionMode.Deny && (
        <Stack gap={4}>
          <Stack gap={2}>
            <PostConditionTypeMenu
              onChange={(option: Option<PostConditionType>) => {
                formikSetFieldValue('postConditionType', option.value);
              }}
            />
            {errors && <Caption color="error">{errors.postConditionType}</Caption>}
          </Stack>
          {values.postConditionType != null && (
            <Stack gap={4}>
              {postConditionParameterMap[values.postConditionType].map(parameter => (
                <Box key={parameter}>
                  {parameter !== 'postConditionMode' &&
                  parameter !== 'postConditionType' &&
                  parameter !== 'postConditionConditionCode' ? (
                    <Stack gap={2}>
                      <Text
                        fontSize="12px"
                        fontWeight="500"
                        display="block"
                        color="text"
                        mb="tight"
                      >
                        {postConditionParameterLabels[parameter]}
                      </Text>
                      <Box width="100%">
                        <Field
                          type={parameter === 'postConditionAmount' ? 'number' : 'text'}
                          name={parameter}
                          id={parameter}
                          component={Input}
                          onChange={handleChange}
                        />
                      </Box>
                      {errors[parameter] && <Caption color="error">{errors[parameter]}</Caption>}
                    </Stack>
                  ) : (
                    <Stack gap={2}>
                      <PostConditionConditionCodeMenu
                        onChange={(option: Option<PostConditionConditionCode>) => {
                          formikSetFieldValue('postConditionConditionCode', option.value);
                        }}
                        postConditionType={values.postConditionType as PostConditionType}
                      />
                      {errors.postConditionConditionCode && (
                        <Caption color="error">{errors.postConditionConditionCode}</Caption>
                      )}
                    </Stack>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
}
