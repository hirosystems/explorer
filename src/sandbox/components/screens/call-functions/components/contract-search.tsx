import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { contractSearchQueryState } from '@sandbox/store/sandbox';
import { useFormik } from 'formik';
import { onPaste, validateStacksAddress } from '@common/utils';
import { Box, color, Flex, Stack } from '@stacks/ui';
import { Caption, Link, Text, Title } from '@components/typography';
import { Error } from '@sandbox/components/error';
import { Input } from '@components/inputs';
import { Button } from '@components/button';
import { functionCallViewState } from '@sandbox/store/views';

export const ContractSearch: React.FC = () => {
  const setView = useSetRecoilState(functionCallViewState);
  const setQuery = useSetRecoilState(contractSearchQueryState);
  const { handleSubmit, handleChange, handleBlur, values, setValues, errors } = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      principal: 'SP000000000000000000002Q6VF78',
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
    onSubmit: ({ principal, contract_name }) => {
      setQuery(`${principal}.${contract_name}`);
      setView('function-overview');
    },
  });

  const handlePaste = useCallback(
    (e: any) =>
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
      }),
    [setValues]
  );
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
            <Error>{errors?.principal || errors?.contract_name}</Error>
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
          />
          <Input
            id="contract_name"
            name="contract_name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contract_name}
            placeholder="Enter the contract name"
          />
          <Box>
            <Button type="submit">Get contract</Button>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};
