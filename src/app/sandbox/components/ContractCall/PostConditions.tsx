import { Box } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { Flex } from '@/ui/Flex';
import { Icon } from '@/ui/Icon';
import { Input } from '@/ui/Input';
import { Menu } from '@/ui/Menu';
import { MenuButton } from '@/ui/MenuButton';
import { MenuItem } from '@/ui/MenuItem';
import { MenuList } from '@/ui/MenuList';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Caption } from '@/ui/typography';
import { CaretDown } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';

import {
  ClarityAbiFunction,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostConditionMode,
  createAssetInfo,
  isClarityAbiOptional,
  isClarityAbiPrimitive,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  stringAsciiCV,
  validateStacksAddress,
} from '@stacks/transactions';

import { NonTupleValueType } from '../../types/values';
import { InitialValuesType } from './FunctionView';

export enum PostConditionType {
  Stx = 'STXPostCondition',
  Fungible = 'FungiblePostCondition',
  NonFungible = 'NonFungiblePostCondition',
}

export interface PostConditionParameters {
  postConditionAddress?: string;
  postConditionConditionCode?: NonFungibleConditionCode | FungibleConditionCode;
  postConditionAmount?: number;
  postConditionAssetAddress?: string;
  postConditionAssetContractName?: string;
  postConditionAssetName?: string;
}

export type PostConditionParameterKeys = keyof PostConditionParameters;

export const postConditionParameterMap: Record<PostConditionType, PostConditionParameterKeys[]> = {
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

export const postConditionParameterLabels: Record<string, string> = {
  postConditionAddress: 'Address',
  postConditionConditionCode: 'Condition Code',
  postConditionAmount: 'Amount',
  postConditionAssetAddress: 'Asset Address',
  postConditionAssetContractName: 'Asset Contract Name',
  postConditionAssetName: 'Asset Name',
};

export const PostConditionOptions = [
  { label: 'STX Post Condition', value: PostConditionType.Stx },
  { label: 'Fungible Post Condition', value: PostConditionType.Fungible },
  { label: 'Non-Fungible Post Condition', value: PostConditionType.NonFungible },
];

export function getPostCondition(
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

export const checkFunctionParameters = (fn: ClarityAbiFunction, values: InitialValuesType) => {
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

export const checkPostConditionParameters = (
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

interface Option<T> {
  label: string;
  value: T;
}

function getPostConditionConditionCodeOptions(postConditionType: PostConditionType): Option[] {
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

// export const PostConditionButton = styled(Button, {
//   shouldForwardProp: propName =>
//     propName !== 'disabled' && propName !== 'showPostCondition' && propName !== 'colorMode',
// })<{
//   disabled: boolean;
//   showPostCondition: boolean;
//   colorMode: ColorMode | undefined;
// }>`
//   background-color: ${props =>
//     props.disabled === true
//       ? 'slate.200'
//       : props.showPostCondition
//         ? '#dc3545'
//         : props.colorMode === 'light'
//           ? 'black'
//           : 'white'};
//   opacity: ${props => (props.disabled === true ? '0.2' : null)};
//   color: ${props => (props.colorMode === 'light' ? 'white' : 'black')};
//   :hover {
//     background-color: ${props =>
//       props.disabled === true
//         ? '#505053'
//         : props.showPostCondition
//           ? '#dc3545'
//           : props.colorMode === 'light'
//             ? '#040404c7'
//             : 'white'};
//     filter: ${props =>
//       props.disabled === true
//         ? null
//         : props.showPostCondition
//           ? 'brightness(85%)'
//           : props.colorMode === 'light'
//             ? null
//             : 'brightness(85%)'};
//   }
// `;

export function PostConditionConditionCodeMenu({
  onChange,
  postConditionType,
}: {
  onChange: (option: any) => void;
  postConditionType: PostConditionType;
}) {
  const [selectedOption, setSelectedOption] = useState<Option<PostConditionType | undefined>>({
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
            onClick={e => {
              e.stopPropagation();

              setSelectedOption(option);
              // setFieldValue('postConditionConditionCode', option.value)
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

export function PostConditionMenu({ onChange }: { onChange: (option: any) => void }) {
  const [selectedOption, setSelectedOption] = useState<Option<PostConditionType | undefined>>({
    label: 'Select a post condition',
    value: undefined,
  });
  const options = useMemo(
    () => [
      { label: 'STX Post Condition', value: PostConditionType.Stx },
      { label: 'Fungible Post Condition', value: PostConditionType.Fungible },
      { label: 'Non-Fungible Post Condition', value: PostConditionType.NonFungible },
    ],
    []
  );

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

export function PostCondition({
  postConditionMode,
  values,
  errors,
  formikHandleChange,
}: {
  postConditionMode: PostConditionMode;
  values: any;
  errors: any;
  formikHandleChange: any;
}) {
  const [showPostCondition, setShowPostCondition] = useState(false);
  const [postConditionType, setPostConditionType] = useState<PostConditionType | undefined>(
    undefined
  );
  const isButtonDisabled = useMemo(
    () => postConditionMode === PostConditionMode.Allow,
    [postConditionMode]
  );

  useEffect(() => {
    if (!showPostCondition) {
      setPostConditionType(undefined);
    }
    if (postConditionMode === PostConditionMode.Allow && showPostCondition) {
      setShowPostCondition(false);
    }
  }, [showPostCondition, postConditionMode]);

  const initialPostConditionParameterValues: PostConditionParameters = {
    postConditionAddress: undefined,
    postConditionAmount: undefined,
    postConditionConditionCode: undefined,
    postConditionAssetName: undefined,
    postConditionAssetAddress: undefined,
    postConditionAssetContractName: undefined,
  };

  return (
    <>
      <Button
        isDisabled={isButtonDisabled}
        onClick={() => {
          setShowPostCondition(!showPostCondition);
        }}
        backgroundColor={showPostCondition ? 'red.500' : 'purple.500'}
        color="white"
        _hover={
          isButtonDisabled
            ? {}
            : {
                backgroundColor: showPostCondition ? 'red.600' : 'purple.600',
              }
        }
      >
        {!showPostCondition ? 'Add post condition (optional)' : 'Remove post condition'}
      </Button>
      {showPostCondition && (
        <Stack gap={4}>
          <Box>
            <PostConditionMenu
              onChange={(option: Option<PostConditionType>) => {
                setPostConditionType(option.value);
              }}
            />
            {errors && ( // TODO: check that errors is working
              <Caption color="error">
                {/** TODO: make sure this is the right color */}
                {errors.postConditionType}
              </Caption>
            )}
          </Box>
          {postConditionType && (
            <Stack gap={4}>
              {postConditionParameterMap[postConditionType].map(parameter => (
                <Box>
                  {parameter !== 'postConditionConditionCode' ? (
                    <Stack key={parameter} gap={2}>
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
                        <Input
                          width="100%"
                          type={parameter === 'postConditionAmount' ? 'number' : 'text'}
                          name={parameter}
                          id={parameter}
                          // onChange={formikHandleChange}
                          value={values[parameter]} // TODO: check that this is working
                        />
                      </Box>
                    </Stack>
                  ) : (
                    <Box key={parameter}>
                      <PostConditionConditionCodeMenu
                        onChange={() => {}}
                        postConditionType={postConditionType}
                      />
                    </Box>
                  )}
                  {Object.keys(errors).length > 0 && ( // TODO: check that errors is working
                    <Caption color="error">
                      {/**TODO: check that this is the right color */}
                      {errors[parameter]}
                    </Caption>
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
