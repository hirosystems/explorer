import styled from '@emotion/styled';
import { Formik } from 'formik';
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';

import { openContractCall } from '@stacks/connect';
import {
  ClarityAbiFunction,
  ClarityAbiType,
  ClarityAbiTypeId,
  ClarityAbiTypePrincipal,
  ClarityValue,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostCondition,
  PostConditionMode,
  createAssetInfo,
  encodeClarityValue,
  getTypeString,
  isClarityAbiList,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  listCV,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  stringAsciiCV,
} from '@stacks/transactions';
import {
  Box,
  Button,
  ColorModeString,
  Flex,
  Input,
  Stack,
  color,
  useColorMode,
  usePrevious,
} from '@stacks/ui';

import { CONNECT_AUTH_ORIGIN } from '@common/constants';
import { useNetworkConfig } from '@common/hooks/use-network-config';
import { validateStacksAddress } from '@common/utils';

import { Dropdown } from '@components/Dropdown';
import { InfoCircleIcon } from '@components/icons/info-circle';
import { Section } from '@components/section';
import { Toggle } from '@components/toggle';
import { Tooltip } from '@components/tooltip';
import { Caption, Text } from '@components/typography';

import { ListValueType, NonTupleValueType, TupleValueType, ValueType } from '../../types';
import { encodeTuple, getTuple } from '../../utils';
import { Argument } from '../Argument';
import { PostCondition } from './PostCondition';
import { ReadOnlyField } from './ReadOnlyField';

interface FunctionViewProps {
  fn: ClarityAbiFunction;
  contractId: string;
  cancelButton: ReactNode;
}

enum PostConditionType {
  Stx = 'STXPostCondition',
  Fungible = 'FungiblePostCondition',
  NonFungible = 'NonFungiblePostCondition',
}

interface PostConditionParameters {
  postConditionAddress?: string;
  postConditionConditionCode?: NonFungibleConditionCode | FungibleConditionCode;
  postConditionAmount?: number;
  postConditionAssetAddress?: string;
  postConditionAssetContractName?: string;
  postConditionAssetName?: string;
}

type PostConditionParameterKeys = keyof PostConditionParameters;

const postConditionParameterMap: Record<PostConditionType, PostConditionParameterKeys[]> = {
  [PostConditionType.Stx]: [
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

const postConditionParameterLabels: Record<string, string> = {
  postConditionAddress: 'Address',
  postConditionConditionCode: 'Condition Code',
  postConditionAmount: 'Amount',
  postConditionAssetAddress: 'Asset Address',
  postConditionAssetContractName: 'Asset Contract Name',
  postConditionAssetName: 'Asset Name',
};

const PostConditionOptions = [
  { label: 'STX Post Condition', value: PostConditionType.Stx },
  { label: 'Fungible Post Condition', value: PostConditionType.Fungible },
  { label: 'Non-Fungible Post Condition', value: PostConditionType.NonFungible },
];

function getPostCondition(
  postConditionType: PostConditionType,
  postConditionParameters: PostConditionParameters
): PostCondition[] {
  const {
    postConditionAddress,
    postConditionConditionCode,
    postConditionAmount,
    postConditionAssetAddress,
    postConditionAssetContractName,
    postConditionAssetName,
  } = postConditionParameters;
  let postCondition;

  if (postConditionType === PostConditionType.Stx) {
    if (
      postConditionAddress &&
      postConditionConditionCode &&
      postConditionAmount != null &&
      !isNaN(postConditionAmount) &&
      postConditionAmount >= 0
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
      !isNaN(postConditionAmount) &&
      postConditionAmount >= 0
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

  if (!postCondition) throw new Error('Post condition is undefined');
  return [postCondition];
}

interface FormType {
  [key: string]: ValueType | ListValueType;
}

type InitialValuesType = FormType & PostConditionParameters;

const checkFunctionParameters = (fn: ClarityAbiFunction, values: any) => {
  const errors: Record<string, string> = {};
  Object.keys(values).forEach(arg => {
    const type = fn.args.find(({ name }) => name === arg)?.type;
    const isOptional = type && isClarityAbiOptional(type);
    const optionalTypeIsPrincipal =
      isOptional && isClarityAbiPrimitive(type.optional) && type.optional === 'principal';
    if (type === 'principal' || (optionalTypeIsPrincipal && !!values[arg])) {
      const validPrincipal = validateStacksAddress(
        (values[arg] as NonTupleValueType).toString().split('.')[0]
      );
      if (!validPrincipal) {
        errors[arg] = 'Invalid Stacks address.';
      }
    }
  });
  return errors;
};

const checkPostConditionParameters = (
  values: InitialValuesType,
  postConditionType: PostConditionType | undefined
) => {
  if (!postConditionType) return {};
  const errors: Record<string, string> = {};
  Object.keys(values).forEach((arg: string | keyof PostConditionParameters) => {
    // @ts-ignore
    if (!postConditionParameterMap[postConditionType].includes(arg)) return;
    if (!values[arg]) errors[arg] = `${postConditionParameterLabels[arg]} is required`;
    if (arg === 'postConditionAddress' || arg === 'postConditionAssetAddress') {
      if (!validateStacksAddress(values[arg])) {
        errors[arg] = 'Invalid Stacks address.';
      }
    }
    if (arg === 'postConditionAmount') {
      // @ts-ignore
      if (Number.isInteger(values[arg]) && !Number.isFinite(values[arg]) && values[arg] < 0) {
        errors[arg] = 'Invalid amount';
      }
    }
  });
  return errors;
};

export const FunctionView: FC<FunctionViewProps> = ({ fn, contractId, cancelButton }) => {
  const [readOnlyValue, setReadonlyValue] = useState<ClarityValue[]>();
  const [isPostConditionModeEnabled, setPostConditionMode] = useState<PostConditionMode>(
    PostConditionMode.Deny
  );
  const [showPostCondition, setShowPostCondition] = useState(false);
  const [postConditionType, setPostConditionType] = useState<PostConditionType | undefined>(
    undefined
  );
  const prevIsPostConditionModeEnabled = usePrevious(isPostConditionModeEnabled);
  const network = useNetworkConfig();
  const { colorMode } = useColorMode();

  const initialFunctionParameterValues = useMemo(
    () =>
      fn.args.reduce((argsAcc, arg) => {
        const tuple = getTuple(arg.type);
        const isList = isClarityAbiList(arg.type);
        argsAcc[arg.name] = !!tuple
          ? tuple.reduce((tupleAcc, tupleEntry) => {
              tupleAcc[tupleEntry.name] = '';
              return tupleAcc;
            }, {} as Record<string, string | number>)
          : isList
          ? []
          : '';
        return argsAcc;
      }, {} as FormType),
    [fn]
  );

  useEffect(() => {
    if (!showPostCondition) {
      setPostConditionType(undefined);
    }
    if (
      prevIsPostConditionModeEnabled === PostConditionMode.Deny &&
      isPostConditionModeEnabled === PostConditionMode.Allow &&
      showPostCondition
    ) {
      setShowPostCondition(false);
    }
  }, [showPostCondition, isPostConditionModeEnabled, prevIsPostConditionModeEnabled]);

  const initialPostConditionParameterValues: PostConditionParameters = {
    postConditionAddress: undefined,
    postConditionAmount: undefined,
    postConditionConditionCode: undefined,
    postConditionAssetName: undefined,
    postConditionAssetAddress: undefined,
    postConditionAssetContractName: undefined,
  };

  return (
    <Formik
      initialValues={
        {
          ...initialFunctionParameterValues,
          ...initialPostConditionParameterValues,
        } as InitialValuesType
      }
      validateOnChange={false}
      validateOnBlur={false}
      validate={values => {
        const functionParametersErrors = checkFunctionParameters(fn, values);
        const postConditionParametersErrors = checkPostConditionParameters(
          values,
          postConditionType
        );
        const errors = Object.assign({}, functionParametersErrors, postConditionParametersErrors);
        if (showPostCondition && !postConditionType) {
          errors.postConditionType = 'Post condition is undefined';
        }
        return errors;
      }}
      onSubmit={async values => {
        const final: Record<string, ClarityValue> = {};

        Object.keys(values).forEach(arg => {
          const type = fn.args.find(({ name }) => name === arg)?.type;
          if (!type) return;
          const tuple = getTuple(type);
          const isList = isClarityAbiList(type);
          const optionalType = isClarityAbiOptional(type) ? type?.optional : undefined;
          if (tuple) {
            final[arg] = encodeTuple(tuple, values[arg] as TupleValueType);
          } else if (isList) {
            const listValues = values[arg] as ListValueType;
            const listType = type.list.type;
            const optionalListType = isClarityAbiOptional(listType)
              ? listType?.optional
              : undefined;
            const listTuple = getTuple(listType);
            const listData = listValues.map(listValue =>
              listTuple
                ? encodeTuple(listTuple, listValue as TupleValueType)
                : encodeClarityValue(
                    optionalListType || listType,
                    (listValue as NonTupleValueType).toString()
                  )
            );
            final[arg] = listCV(listData);
          } else {
            final[arg] = encodeClarityValue(
              optionalType || type,
              (values[arg] as NonTupleValueType).toString()
            );
          }
        });
        if (fn.access === 'public') {
          const {
            postConditionAddress,
            postConditionConditionCode,
            postConditionAmount,
            postConditionAssetAddress,
            postConditionAssetContractName,
            postConditionAssetName,
          } = values;

          const postConditions =
            showPostCondition && postConditionType
              ? getPostCondition(postConditionType, {
                  postConditionAddress,
                  postConditionConditionCode,
                  postConditionAmount,
                  postConditionAssetAddress,
                  postConditionAssetContractName,
                  postConditionAssetName,
                })
              : undefined;
          try {
            await openContractCall({
              contractAddress: contractId.split('.')[0],
              contractName: contractId.split('.')[1],
              functionName: encodeURIComponent(fn.name),
              functionArgs: Object.values(final),
              network,
              authOrigin: CONNECT_AUTH_ORIGIN,
              postConditions: postConditions,
              postConditionMode: isPostConditionModeEnabled,
            });
          } catch (err) {
            console.log({ err });
          }
        } else {
          setReadonlyValue(Object.values(final));
        }
      }}
      render={({ handleSubmit, handleChange, values, errors, setFieldValue }) => {
        return (
          <Section
            overflowY="visible"
            flexGrow={1}
            title={`${fn.name} (${fn.access} function)`}
            borderRadius={'0'}
          >
            {readOnlyValue ? (
              <ReadOnlyField
                fn={fn}
                readOnlyValue={readOnlyValue}
                contractId={contractId}
                cancelButton={cancelButton}
              />
            ) : (
              <Box p="extra-loose" as="form" onSubmit={handleSubmit}>
                <Flex marginBottom="16px" justifyContent="flex-end">
                  <Toggle
                    onClick={() =>
                      setPostConditionMode(
                        isPostConditionModeEnabled === PostConditionMode.Deny
                          ? PostConditionMode.Allow
                          : PostConditionMode.Deny
                      )
                    }
                    label={
                      isPostConditionModeEnabled === PostConditionMode.Deny
                        ? 'Deny Mode'
                        : 'Allow Mode'
                    }
                    value={isPostConditionModeEnabled === PostConditionMode.Allow ? true : false}
                  />
                  <Tooltip
                    label={
                      <Box>
                        Allow mode is less secure than Deny mode. Allow mode permits asset transfers
                        that are not covered by post conditions. In Deny mode no other asset
                        transfers are permitted besides those named in the post conditions
                      </Box>
                    }
                  >
                    <Flex alignItems="center" marginLeft="8px">
                      <InfoCircleIcon size="18px" />
                    </Flex>
                  </Tooltip>
                </Flex>
                {fn.args.length ? (
                  <Stack mb="extra-loose" spacing="base">
                    {fn.args.map(({ name, type }) => (
                      <Argument
                        handleChange={handleChange}
                        name={name}
                        type={type}
                        error={errors[name]}
                        key={name}
                        value={values[name]}
                      />
                    ))}
                    {fn.access === 'public' && (
                      <PostConditionButton
                        type="button"
                        disabled={isPostConditionModeEnabled === PostConditionMode.Allow}
                        showPostCondition={showPostCondition}
                        onClick={() => {
                          setShowPostCondition(!showPostCondition);
                        }}
                        colorMode={colorMode}
                      >
                        {!showPostCondition
                          ? 'Add post condition (optional)'
                          : 'Remove post condition'}
                      </PostConditionButton>
                    )}
                    {showPostCondition && (
                      <Box>
                        <Box maxWidth="260px" maxHeight="42px" height="42px" marginBottom="16px">
                          <Dropdown
                            defaultOption={{ label: 'Select a post condition', value: undefined }}
                            options={PostConditionOptions}
                            onChange={option => {
                              if (option.value === PostConditionType.Stx) {
                                setPostConditionType(PostConditionType.Stx);
                              } else if (option.value === PostConditionType.Fungible) {
                                setPostConditionType(PostConditionType.Fungible);
                              } else if (option.value === PostConditionType.NonFungible) {
                                setPostConditionType(PostConditionType.NonFungible);
                              }
                            }}
                          />
                          {errors && (
                            <Caption color={color('feedback-error')}>
                              {errors.postConditionType}
                            </Caption>
                          )}
                        </Box>

                        {postConditionType && (
                          <Stack>
                            {postConditionParameterMap[postConditionType].map(parameter => (
                              <Box>
                                {parameter !== 'postConditionConditionCode' ? (
                                  <Box key={parameter}>
                                    <Text
                                      fontSize="12px"
                                      fontWeight="500"
                                      display="block"
                                      color={color('text-caption')}
                                      htmlFor={parameter}
                                      mb="tight"
                                    >
                                      {postConditionParameterLabels[parameter]}
                                    </Text>
                                    <Box width="100%">
                                      <Input
                                        width="100%"
                                        type={
                                          parameter === 'postConditionAmount' ? 'number' : 'text'
                                        }
                                        name={parameter}
                                        id={parameter}
                                        onChange={handleChange}
                                        value={values[parameter]}
                                      />
                                    </Box>
                                  </Box>
                                ) : (
                                  <Box
                                    maxWidth="260px"
                                    maxHeight="42px"
                                    height="42px"
                                    marginBottom="16px"
                                    key={parameter}
                                  >
                                    <Dropdown
                                      defaultOption={{
                                        label: `Select a condition code`,
                                        value: undefined,
                                      }}
                                      options={
                                        postConditionType === PostConditionType.NonFungible
                                          ? [
                                              {
                                                label: 'Does not send',
                                                value: NonFungibleConditionCode.DoesNotSend,
                                              },
                                              {
                                                label: 'Sends',
                                                value: NonFungibleConditionCode.Sends,
                                              },
                                            ]
                                          : [
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
                                            ]
                                      }
                                      onChange={option =>
                                        setFieldValue('postConditionConditionCode', option.value)
                                      }
                                    />
                                  </Box>
                                )}
                                {errors && (
                                  <Caption color={color('feedback-error')}>
                                    {errors[parameter]}
                                  </Caption>
                                )}
                              </Box>
                            ))}
                          </Stack>
                        )}
                      </Box>
                    )}
                  </Stack>
                ) : null}
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Button type="submit">Call function</Button>
                  {cancelButton}
                </Flex>
              </Box>
            )}
          </Section>
        );
      }}
    />
  );
};

const PostConditionButton = styled(Button, {
  shouldForwardProp: propName =>
    propName !== 'disabled' && propName !== 'showPostCondition' && propName !== 'colorMode',
})<{
  disabled: boolean;
  showPostCondition: boolean;
  colorMode: ColorModeString | undefined;
}>`
  background-color: ${props =>
    props.disabled === true
      ? '#747478'
      : props.showPostCondition
      ? '#dc3545'
      : props.colorMode === 'light'
      ? 'black'
      : 'white'};
  opacity: ${props => (props.disabled === true ? '0.2' : null)};
  color: ${props => (props.colorMode === 'light' ? 'white' : 'black')};

  :hover {
    background-color: ${props =>
      props.disabled === true
        ? '#505053'
        : props.showPostCondition
        ? '#dc3545'
        : props.colorMode === 'light'
        ? '#040404c7'
        : 'white'};
    filter: ${props =>
      props.disabled === true
        ? null
        : props.showPostCondition
        ? 'brightness(85%)'
        : props.colorMode === 'light'
        ? null
        : 'brightness(85%)'};
  }
`;
