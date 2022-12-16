import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Box, Button, Flex, Input, Stack, color, useColorMode } from '@stacks/ui';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { onPaste, validateStacksAddress } from '@common/utils';

import { buildUrl } from '@components/links';
import { Caption, Link, Text, Title } from '@components/typography';

export const SearchContractsForm: FC<{ rootContractAddress: string }> = ({
  rootContractAddress,
}) => {
  const router = useRouter();
  const network = useAppSelector(selectActiveNetwork);
  const { handleSubmit, handleChange, handleBlur, values, setValues, errors } = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    initialValues: {
      principal: rootContractAddress,
      contract_name: 'pox',
    },
    validate: values => {
      const errors: any = {};
      const validPrincipal = validateStacksAddress(values.principal);
      if (!validPrincipal) {
        errors['principal'] = 'Invalid Stacks address.';
      }
      if (!values.contract_name) {
        errors['contract_name'] = 'Contract name required.';
      }
      return errors;
    },
    onSubmit: ({ principal, contract_name }) =>
      router.push(buildUrl(`/sandbox/contract-call/${principal}.${contract_name}`, network)),
  });

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) =>
    onPaste(e, (value: string) => {
      const cleanValue = value.trim().toString();
      if (cleanValue.includes('.')) {
        const [principal, contract_name] = cleanValue.split('.');

        setTimeout(() => {
          void setValues({
            principal,
            contract_name,
          });
        }, 0);
      }
    });
  const { colorMode } = useColorMode();

  return (
    <Flex maxHeight="900px" flexDirection="column" p="loose">
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing="base">
          <Title fontSize="24px">Call a contract</Title>
          <Text color={color('text-body')} maxWidth="42ch" lineHeight="1.6" display="block" my={0}>
            Manually enter contract details below, or load a contract from your transactions to see
            available functions.
          </Text>
          <Caption>
            Hint: you can paste the{' '}
            <Link
              display="inline"
              textDecoration="underline"
              href="https://docs.blockstack.org/smart-contracts/principals#smart-contracts-as-principals"
              target="_blank"
            >
              smart contracts' identifier
            </Link>{' '}
            in this format: [principal].[contract-name]
          </Caption>
          {Object.keys(errors)?.length ? (
            <Box
              borderRadius="6px"
              bg="rgba(207,0,0,0.05)"
              border="1px solid rgba(207,0,0,0.1)"
              px="base"
              py="tight"
              color="red"
              lineHeight="1.8"
              fontSize="14px"
              wordBreak="break-all"
            >
              {errors?.principal || errors?.contract_name}
            </Box>
          ) : null}
          <Input
            id="principal"
            name="principal"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.principal}
            placeholder="Enter the contract address"
            onPaste={handlePaste}
            color={colorMode === 'light' ? '#000' : '#fff'}
          />
          <Input
            id="contract_name"
            name="contract_name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contract_name}
            placeholder="Enter the contract name"
            color={colorMode === 'light' ? '#000' : '#fff'}
          />
          <Box>
            <Button type="submit">Get contract</Button>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};
