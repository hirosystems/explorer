import { NonTupleValueType } from '@/app/sandbox/types/values';
import { logError } from '@/common/utils/error-utils';
import { isUint128 } from '@/common/utils/number-utils';

import {
  Cl,
  ClarityAbiFunction,
  FungibleComparator,
  FungibleConditionCode,
  FungiblePostCondition,
  NonFungibleComparator,
  NonFungibleConditionCode,
  NonFungiblePostCondition,
  PostCondition,
  PostConditionMode,
  PostConditionType,
  StxPostCondition,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  validateStacksAddress,
} from '@stacks/transactions';

import { FunctionFormikState } from './FunctionCallForm';

export type PostConditionConditionCode = FungibleConditionCode | NonFungibleConditionCode;

export function isFungibleConditionCode(
  code: PostConditionConditionCode
): code is FungibleConditionCode {
  return Object.values(FungibleConditionCode).includes(code as FungibleConditionCode);
}

export function isNonFungibleConditionCode(
  code: PostConditionConditionCode
): code is NonFungibleConditionCode {
  return Object.values(NonFungibleConditionCode).includes(code as NonFungibleConditionCode);
}

export function fungibleConditionCodeToComparator(code: FungibleConditionCode): FungibleComparator {
  switch (code) {
    case FungibleConditionCode.Equal:
      return 'eq';
    case FungibleConditionCode.Greater:
      return 'gt';
    case FungibleConditionCode.GreaterEqual:
      return 'gte';
    case FungibleConditionCode.Less:
      return 'lt';
    case FungibleConditionCode.LessEqual:
      return 'lte';
    default:
      return 'eq';
  }
}

export function nonFungibleConditionCodeToComparator(
  code: NonFungibleConditionCode
): NonFungibleComparator {
  switch (code) {
    case NonFungibleConditionCode.Sends:
      return 'sent';
    case NonFungibleConditionCode.DoesNotSend:
      return 'not-sent';
    default:
      return 'sent';
  }
}

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

// Map a post condition type to the keys of the post condition parameters needed to create it
export const postConditionParameterMap: Record<
  PostConditionType,
  (keyof PostConditionParameters)[]
> = {
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

// Checks if a key is a post condition parameter
export function isPostConditionParameter(key: string): key is keyof PostConditionParameters {
  const postConditionKeys = [
    'postConditionMode',
    'postConditionType',
    'postConditionAddress',
    'postConditionConditionCode',
    'postConditionAmount',
    'postConditionAssetAddress',
    'postConditionAssetContractName',
    'postConditionAssetName',
  ] as const satisfies readonly (keyof PostConditionParameters)[];
  return postConditionKeys.includes(key as keyof PostConditionParameters);
}

// Map a post condition parameter key to a label
// Doesn't include postConditionMode and postConditionType because they are handled by the Select component
export const postConditionParameterLabels: Record<string, string> = {
  postConditionAddress: 'Address',
  postConditionConditionCode: 'Condition Code',
  postConditionAmount: 'Amount',
  postConditionAssetAddress: 'Asset Address',
  postConditionAssetContractName: 'Asset Contract Name',
  postConditionAssetName: 'Asset Name',
};

// Creates a post condition from the form values
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

  if (
    postConditionType === PostConditionType.STX &&
    postConditionAddress &&
    postConditionConditionCode &&
    postConditionAmount != null &&
    isUint128(postConditionAmount) &&
    isFungibleConditionCode(postConditionConditionCode)
  ) {
    const postCondition = {
      type: 'stx-postcondition',
      address: postConditionAddress,
      condition: fungibleConditionCodeToComparator(postConditionConditionCode),
      amount: postConditionAmount.toString(),
    } as StxPostCondition;
    return [postCondition];
  } else if (
    postConditionType === PostConditionType.Fungible &&
    postConditionAddress &&
    postConditionAssetAddress &&
    postConditionAssetContractName &&
    postConditionAssetName &&
    postConditionConditionCode &&
    postConditionAmount != null &&
    isUint128(postConditionAmount) &&
    isFungibleConditionCode(postConditionConditionCode)
  ) {
    const postCondition = {
      type: 'ft-postcondition',
      address: postConditionAddress,
      condition: fungibleConditionCodeToComparator(postConditionConditionCode),
      asset: `${postConditionAssetAddress}.${postConditionAssetContractName}::${postConditionAssetName}`,
      amount: postConditionAmount.toString(),
    } as FungiblePostCondition;
    return [postCondition];
  } else if (
    postConditionType === PostConditionType.NonFungible &&
    postConditionAddress &&
    postConditionAssetAddress &&
    postConditionAssetContractName &&
    postConditionAssetName &&
    postConditionConditionCode &&
    isNonFungibleConditionCode(postConditionConditionCode)
  ) {
    const postCondition = {
      type: 'nft-postcondition',
      address: postConditionAddress,
      condition: nonFungibleConditionCodeToComparator(postConditionConditionCode),
      asset: `${postConditionAssetAddress}.${postConditionAssetContractName}::${postConditionAssetName}`,
      assetId: Cl.stringUtf8(postConditionAssetName),
    } as NonFungiblePostCondition;
    return [postCondition];
  } else {
    logError(
      new Error(`Error creating post condition for post condition type ${postConditionType}`),
      'getPostCondition',
      postConditionParameters
    );
    throw new Error(`Error creating post condition for post condition type ${postConditionType}`);
  }
}

// Validates the function parameters
export const checkFunctionParameters = (fn: ClarityAbiFunction, values: FunctionFormikState) => {
  const errors: Record<string, string> = {};

  Object.keys(values).forEach(arg => {
    // Skip post condition parameters
    if (isPostConditionParameter(arg as keyof PostConditionParameters)) return;

    const type = fn.args.find(({ name }) => name === arg)?.type;
    const isOptional = type && isClarityAbiOptional(type);
    const optionalTypeIsPrincipal =
      isOptional && isClarityAbiPrimitive(type.optional) && type.optional === 'principal';

    // If the argument is not optional and is not provided, add an error
    if (!isOptional && (values[arg] == null || values[arg] === '')) {
      errors[arg] = `${arg} is required`;
      return;
    }

    // Validate principal arguments
    if (type === 'principal' || (optionalTypeIsPrincipal && !!values[arg])) {
      const validPrincipal = validateStacksAddress(
        (values[arg] as NonTupleValueType).toString().split('.')[0]
      );
      if (!validPrincipal) {
        errors[arg] = 'Invalid Stacks address';
        return;
      }
    }

    // Validate uint128 arguments
    if (type === 'uint128' && !isUint128(values[arg] as number)) {
      errors[arg] = 'Invalid uint128 value';
      return;
    }
  });

  return errors;
};

// Validates the post condition parameters
export const checkPostConditionParameters = (
  formikState: FunctionFormikState
): Record<string, string> => {
  const errors: Record<string, string> = {};
  // If the post condition mode is allow, there are no post condition parameters to validate
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
      !validateStacksAddress(formikState[key].split('.')[0])
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

export interface Option<V extends string, L extends string> {
  label: L;
  value: V;
}

export type PostConditionTypeLabel =
  | 'STX Post Condition'
  | 'Fungible Post Condition'
  | 'Non-Fungible Post Condition';

export const PostConditionTypeLabelMap: Record<PostConditionType, PostConditionTypeLabel> = {
  [PostConditionType.STX]: 'STX Post Condition',
  [PostConditionType.Fungible]: 'Fungible Post Condition',
  [PostConditionType.NonFungible]: 'Non-Fungible Post Condition',
};

export type PostConditionTypeValue =
  | 'stx-post-condition'
  | 'fungible-post-condition'
  | 'non-fungible-post-condition';

export const PostConditionTypeValueMap: Record<PostConditionType, PostConditionTypeValue> = {
  [PostConditionType.STX]: 'stx-post-condition',
  [PostConditionType.Fungible]: 'fungible-post-condition',
  [PostConditionType.NonFungible]: 'non-fungible-post-condition',
};

export const PostConditionTypeValueMapReversed: Record<PostConditionTypeValue, PostConditionType> =
  {
    'stx-post-condition': PostConditionType.STX,
    'fungible-post-condition': PostConditionType.Fungible,
    'non-fungible-post-condition': PostConditionType.NonFungible,
  };

export const PostConditionTypeOptions = [
  {
    label: PostConditionTypeLabelMap[PostConditionType.STX],
    value: PostConditionTypeValueMap[PostConditionType.STX],
  },
  {
    label: PostConditionTypeLabelMap[PostConditionType.Fungible],
    value: PostConditionTypeValueMap[PostConditionType.Fungible],
  },
  {
    label: PostConditionTypeLabelMap[PostConditionType.NonFungible],
    value: PostConditionTypeValueMap[PostConditionType.NonFungible],
  },
];

export type PostConditionConditionCodeLabel =
  | 'Does not send'
  | 'Sends'
  | 'Equal'
  | 'Greater'
  | 'GreaterEqual'
  | 'Less'
  | 'LessEqual';

export const PostConditionConditionCodeLabelMap: Record<
  PostConditionConditionCode,
  PostConditionConditionCodeLabel
> = {
  [NonFungibleConditionCode.DoesNotSend]: 'Does not send',
  [NonFungibleConditionCode.Sends]: 'Sends',
  [FungibleConditionCode.Equal]: 'Equal',
  [FungibleConditionCode.Greater]: 'Greater',
  [FungibleConditionCode.GreaterEqual]: 'GreaterEqual',
  [FungibleConditionCode.Less]: 'Less',
  [FungibleConditionCode.LessEqual]: 'LessEqual',
};

export type PostConditionConditionCodeValue =
  | 'does-not-send'
  | 'sends'
  | 'equal'
  | 'greater'
  | 'greater-equal'
  | 'less'
  | 'less-equal';

export const PostConditionConditionCodeValueMap: Record<
  PostConditionConditionCode,
  PostConditionConditionCodeValue
> = {
  [NonFungibleConditionCode.DoesNotSend]: 'does-not-send',
  [NonFungibleConditionCode.Sends]: 'sends',
  [FungibleConditionCode.Equal]: 'equal',
  [FungibleConditionCode.Greater]: 'greater',
  [FungibleConditionCode.GreaterEqual]: 'greater-equal',
  [FungibleConditionCode.Less]: 'less',
  [FungibleConditionCode.LessEqual]: 'less-equal',
};

export const PostConditionConditionCodeValueMapReversed: Record<
  PostConditionConditionCodeValue,
  PostConditionConditionCode
> = {
  'does-not-send': NonFungibleConditionCode.DoesNotSend,
  sends: NonFungibleConditionCode.Sends,
  equal: FungibleConditionCode.Equal,
  greater: FungibleConditionCode.Greater,
  'greater-equal': FungibleConditionCode.GreaterEqual,
  less: FungibleConditionCode.Less,
  'less-equal': FungibleConditionCode.LessEqual,
};

export function getPostConditionConditionCodeOptions(
  postConditionType: PostConditionType
): Option<PostConditionConditionCodeValue, PostConditionConditionCodeLabel>[] {
  if (postConditionType === PostConditionType.NonFungible) {
    return [
      {
        label: PostConditionConditionCodeLabelMap[NonFungibleConditionCode.DoesNotSend],
        value: PostConditionConditionCodeValueMap[NonFungibleConditionCode.DoesNotSend],
      },
      {
        label: PostConditionConditionCodeLabelMap[NonFungibleConditionCode.Sends],
        value: PostConditionConditionCodeValueMap[NonFungibleConditionCode.Sends],
      },
    ];
  }
  return [
    {
      label: PostConditionConditionCodeLabelMap[FungibleConditionCode.Equal],
      value: PostConditionConditionCodeValueMap[FungibleConditionCode.Equal],
    },
    {
      label: PostConditionConditionCodeLabelMap[FungibleConditionCode.Greater],
      value: PostConditionConditionCodeValueMap[FungibleConditionCode.Greater],
    },
    {
      label: PostConditionConditionCodeLabelMap[FungibleConditionCode.GreaterEqual],
      value: PostConditionConditionCodeValueMap[FungibleConditionCode.GreaterEqual],
    },
    {
      label: PostConditionConditionCodeLabelMap[FungibleConditionCode.Less],
      value: PostConditionConditionCodeValueMap[FungibleConditionCode.Less],
    },
    {
      label: PostConditionConditionCodeLabelMap[FungibleConditionCode.LessEqual],
      value: PostConditionConditionCodeValueMap[FungibleConditionCode.LessEqual],
    },
  ];
}
