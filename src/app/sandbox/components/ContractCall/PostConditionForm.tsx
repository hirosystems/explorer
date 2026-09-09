import { Select } from '@/common/components/Select';
import { Button } from '@/ui/Button';
import { Box, Flex, Stack, chakra } from '@chakra-ui/react';
import { Field, FieldArray, FormikErrors } from 'formik';

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
  PostConditionType,
  PoxComparator,
  PoxConditionCode,
  PoxPostCondition,
  StakingPostCondition,
  StxPostCondition,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  validateStacksAddress,
} from '@stacks/transactions';

import { isUint128 } from '../../../../common/utils/number-utils';
import { Input } from '../../../../ui/Input';
import { Text } from '../../../../ui/Text';
import { Caption } from '../../../../ui/typography';
import { NonTupleValueType } from '../../types/values';
import { FormikSetFieldValueFunction, FunctionFormikState } from './FunctionView';

type PostConditionConditionCode =
  | FungibleConditionCode
  | NonFungibleConditionCode
  | PoxConditionCode;

function isFungibleConditionCode(code: PostConditionConditionCode): code is FungibleConditionCode {
  return Object.values(FungibleConditionCode).includes(code as FungibleConditionCode);
}

function isNonFungibleConditionCode(
  code: PostConditionConditionCode
): code is NonFungibleConditionCode {
  return Object.values(NonFungibleConditionCode).includes(code as NonFungibleConditionCode);
}

function fungibleConditionCodeToComparator(code: FungibleConditionCode): FungibleComparator {
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

function isConditionCodeValidForType(
  postConditionType: PostConditionType,
  code: PostConditionConditionCode
): boolean {
  if (postConditionType === PostConditionType.NonFungible) {
    return isNonFungibleConditionCode(code);
  }
  if (postConditionType === PostConditionType.PoX) {
    return isPoxConditionCode(code);
  }
  return isFungibleConditionCode(code);
}

function isPoxConditionCode(code: PostConditionConditionCode): code is PoxConditionCode {
  return Object.values(PoxConditionCode).includes(code as PoxConditionCode);
}

function poxConditionCodeToComparator(code: PoxConditionCode): PoxComparator {
  switch (code) {
    case PoxConditionCode.WillNotPerform:
      return 'will-not-perform';
    case PoxConditionCode.MayPerform:
      return 'may-perform';
    case PoxConditionCode.WillPerform:
      return 'will-perform';
    default:
      return 'will-perform';
  }
}

function nonFungibleConditionCodeToComparator(
  code: NonFungibleConditionCode
): NonFungibleComparator {
  switch (code) {
    case NonFungibleConditionCode.Sends:
      return 'sent';
    case NonFungibleConditionCode.DoesNotSend:
      return 'not-sent';
    case NonFungibleConditionCode.MaybeSent:
      return 'maybe-sent';
    default:
      return 'sent';
  }
}

export interface PostConditionParameters {
  postConditionType?: PostConditionType;
  postConditionAddress?: string;
  postConditionConditionCode?: PostConditionConditionCode;
  postConditionAmount?: number | string;
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
  [PostConditionType.Staking]: [
    'postConditionAddress',
    'postConditionConditionCode',
    'postConditionAmount',
  ],
  [PostConditionType.PoX]: ['postConditionAddress', 'postConditionConditionCode'],
};

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
  { label: 'Staking Post Condition', value: PostConditionType.Staking },
  { label: 'PoX Post Condition', value: PostConditionType.PoX },
];

export const emptyPostCondition: PostConditionParameters = {
  postConditionType: undefined,
  postConditionAddress: '',
  postConditionAmount: '',
  postConditionConditionCode: undefined,
  postConditionAssetName: '',
  postConditionAssetAddress: '',
  postConditionAssetContractName: '',
};

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

  if (
    postConditionType === PostConditionType.STX &&
    postConditionAddress &&
    postConditionConditionCode != null &&
    postConditionAmount != null &&
    isUint128(postConditionAmount) &&
    isFungibleConditionCode(postConditionConditionCode)
  ) {
    postCondition = {
      type: 'stx-postcondition',
      address: postConditionAddress,
      condition: fungibleConditionCodeToComparator(postConditionConditionCode),
      amount: postConditionAmount.toString(),
    } as StxPostCondition;
  } else if (
    postConditionType === PostConditionType.Fungible &&
    postConditionAddress &&
    postConditionAssetAddress &&
    postConditionAssetContractName &&
    postConditionAssetName &&
    postConditionConditionCode != null &&
    postConditionAmount != null &&
    isUint128(postConditionAmount) &&
    isFungibleConditionCode(postConditionConditionCode)
  ) {
    postCondition = {
      type: 'ft-postcondition',
      address: postConditionAddress,
      condition: fungibleConditionCodeToComparator(postConditionConditionCode),
      asset: `${postConditionAssetAddress}.${postConditionAssetContractName}::${postConditionAssetName}`,
      amount: postConditionAmount.toString(),
    } as FungiblePostCondition;
  } else if (
    postConditionType === PostConditionType.NonFungible &&
    postConditionAddress &&
    postConditionAssetAddress &&
    postConditionAssetContractName &&
    postConditionAssetName &&
    postConditionConditionCode != null &&
    isNonFungibleConditionCode(postConditionConditionCode)
  ) {
    postCondition = {
      type: 'nft-postcondition',
      address: postConditionAddress,
      condition: nonFungibleConditionCodeToComparator(postConditionConditionCode),
      asset: `${postConditionAssetAddress}.${postConditionAssetContractName}::${postConditionAssetName}`,
      assetId: Cl.stringUtf8(postConditionAssetName),
    } as NonFungiblePostCondition;
  } else if (
    postConditionType === PostConditionType.Staking &&
    postConditionAddress &&
    postConditionConditionCode != null &&
    postConditionAmount != null &&
    isUint128(postConditionAmount) &&
    isFungibleConditionCode(postConditionConditionCode)
  ) {
    postCondition = {
      type: 'staking-postcondition',
      address: postConditionAddress,
      condition: fungibleConditionCodeToComparator(postConditionConditionCode),
      amount: postConditionAmount.toString(),
    } as StakingPostCondition;
  } else if (
    postConditionType === PostConditionType.PoX &&
    postConditionAddress &&
    postConditionConditionCode != null &&
    isPoxConditionCode(postConditionConditionCode)
  ) {
    postCondition = {
      type: 'pox-postcondition',
      address: postConditionAddress,
      condition: poxConditionCodeToComparator(postConditionConditionCode),
    } as PoxPostCondition;
  } else if (
    postConditionType !== PostConditionType.STX &&
    postConditionType !== PostConditionType.Fungible &&
    postConditionType !== PostConditionType.NonFungible &&
    postConditionType !== PostConditionType.Staking &&
    postConditionType !== PostConditionType.PoX
  ) {
    throw new Error(`There is no post condition type that matches ${postConditionType}`);
  }

  return postCondition ? [postCondition as PostCondition] : [];
}

export function getPostConditions(
  postConditionParameters: PostConditionParameters[]
): PostCondition[] {
  return postConditionParameters.flatMap(getPostCondition);
}

export const checkFunctionParameters = (fn: ClarityAbiFunction, values: FunctionFormikState) => {
  const errors: Record<string, string> = {};
  fn.args.forEach(({ name: arg, type }) => {
    const isOptional = isClarityAbiOptional(type);
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
  formikState: PostConditionParameters
): FormikErrors<PostConditionParameters> => {
  const errors: Record<string, string> = {};
  if (formikState.postConditionType == null) {
    return { postConditionType: 'Post-condition type is required' };
  }
  const postConditionParameters =
    postConditionParameterMap[formikState.postConditionType as PostConditionType];
  postConditionParameters?.forEach(key => {
    const value = formikState[key];
    if (value == null || (typeof value === 'string' && value.trim() === '')) {
      errors[key] = `${postConditionParameterLabels[key]} is required`;
      return;
    }
    if (
      (key === 'postConditionAddress' || key === 'postConditionAssetAddress') &&
      typeof value === 'string' &&
      !validateStacksAddress(value.split('.')[0])
    ) {
      errors[key] = 'Invalid Stacks address';
      return;
    }
    if (
      key === 'postConditionConditionCode' &&
      !isConditionCodeValidForType(
        formikState.postConditionType as PostConditionType,
        value as PostConditionConditionCode
      )
    ) {
      errors[key] = 'Condition code does not match the selected post condition type';
      return;
    }
    if (key === 'postConditionAmount') {
      if (!isUint128(value as number | string)) {
        errors[key] = 'Invalid amount';
        return;
      }
    }
  });
  return errors;
};

export function checkPostConditions(
  postConditions: PostConditionParameters[]
): FormikErrors<PostConditionParameters>[] {
  return postConditions.map(checkPostConditionParameters);
}

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
      {
        label: 'May send',
        value: NonFungibleConditionCode.MaybeSent,
      },
    ];
  }
  if (postConditionType === PostConditionType.PoX) {
    return [
      {
        label: 'Will not perform',
        value: PoxConditionCode.WillNotPerform,
      },
      {
        label: 'May perform',
        value: PoxConditionCode.MayPerform,
      },
      {
        label: 'Will perform',
        value: PoxConditionCode.WillPerform,
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

const postConditionTypeSelectOptions = PostConditionOptions.map(option => ({
  label: option.label,
  value: String(option.value),
}));

function getIndexedPostConditionErrors(
  errors: FormikErrors<FunctionFormikState>,
  index: number
): FormikErrors<PostConditionParameters> {
  if (!Array.isArray(errors.postConditions)) return {};
  const indexedErrors = errors.postConditions[index];
  return indexedErrors && typeof indexedErrors === 'object' ? indexedErrors : {};
}

export function PostConditionForm({
  values,
  errors,
  formikSetFieldValue,
}: {
  values: FunctionFormikState;
  errors: FormikErrors<FunctionFormikState>;
  formikSetFieldValue: FormikSetFieldValueFunction;
}) {
  return (
    <FieldArray name="postConditions">
      {({ push, remove }) => (
        <Stack gap={4}>
          <Flex justifyContent="space-between" alignItems="center" gap={3} flexWrap="wrap">
            <Box>
              <Text fontSize="sm" fontWeight="semibold">
                Conditions
              </Text>
              <Caption color="textSubdued">
                {values.postConditions.length === 0
                  ? 'No post-conditions added'
                  : `${values.postConditions.length} post-condition${
                      values.postConditions.length === 1 ? '' : 's'
                    } added`}
              </Caption>
            </Box>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => push({ ...emptyPostCondition })}
            >
              Add post-condition
            </Button>
          </Flex>

          {values.postConditions.map((postCondition, index) => {
            const indexedErrors = getIndexedPostConditionErrors(errors, index);
            const postConditionType = postCondition.postConditionType;
            const conditionCodeOptions =
              postConditionType == null
                ? []
                : getPostConditionConditionCodeOptions(postConditionType).map(option => ({
                    label: option.label,
                    value: String(option.value),
                  }));

            return (
              <Box
                key={index}
                borderWidth="1px"
                borderColor="borderSecondary"
                borderRadius="md"
                p={4}
              >
                <Stack gap={4}>
                  <Flex justifyContent="space-between" alignItems="center" gap={3}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Post-condition {index + 1}
                    </Text>
                    <Button
                      type="button"
                      variant="text"
                      aria-label={`Remove post-condition ${index + 1}`}
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </Flex>

                  <Stack gap={2}>
                    <Select
                      placeholder="Post-condition type"
                      items={postConditionTypeSelectOptions}
                      label={`Post-condition ${index + 1} type`}
                      value={postConditionType == null ? [] : [String(postConditionType)]}
                      onValueChange={details => {
                        const value = details.value[0];
                        if (value == null) return;
                        void formikSetFieldValue(`postConditions.${index}`, {
                          ...emptyPostCondition,
                          postConditionType: Number(value) as PostConditionType,
                        });
                      }}
                      size="sm"
                    />
                    {indexedErrors.postConditionType && (
                      <Caption color="error">{indexedErrors.postConditionType}</Caption>
                    )}
                  </Stack>

                  {postConditionType != null && (
                    <Stack gap={4}>
                      {postConditionParameterMap[postConditionType].map(parameter => {
                        const fieldName = `postConditions.${index}.${parameter}`;
                        return (
                          <Box key={parameter}>
                            {parameter !== 'postConditionConditionCode' ? (
                              <Stack gap={2}>
                                <chakra.label
                                  htmlFor={`post-condition-${index}-${parameter}`}
                                  fontSize="12px"
                                  fontWeight="500"
                                  display="block"
                                  color="text"
                                  mb="tight"
                                >
                                  {postConditionParameterLabels[parameter]}
                                </chakra.label>
                                <Box width="100%">
                                  <Field
                                    type={parameter === 'postConditionAmount' ? 'number' : 'text'}
                                    name={fieldName}
                                    id={`post-condition-${index}-${parameter}`}
                                    as={Input}
                                  />
                                </Box>
                                {indexedErrors[parameter] && (
                                  <Caption color="error">{indexedErrors[parameter]}</Caption>
                                )}
                              </Stack>
                            ) : (
                              <Stack gap={2}>
                                <Select
                                  placeholder="Condition code"
                                  items={conditionCodeOptions}
                                  label={`Post-condition ${index + 1} condition code`}
                                  value={
                                    postCondition.postConditionConditionCode == null
                                      ? []
                                      : [String(postCondition.postConditionConditionCode)]
                                  }
                                  onValueChange={details => {
                                    const value = details.value[0];
                                    if (value == null) return;
                                    void formikSetFieldValue(
                                      fieldName,
                                      Number(value) as PostConditionConditionCode
                                    );
                                  }}
                                  size="sm"
                                />
                                {indexedErrors.postConditionConditionCode && (
                                  <Caption color="error">
                                    {indexedErrors.postConditionConditionCode}
                                  </Caption>
                                )}
                              </Stack>
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </FieldArray>
  );
}
