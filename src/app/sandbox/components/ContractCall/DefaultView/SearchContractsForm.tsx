import { Box, Input, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

import { useGlobalContext } from '../../../../../common/context/useGlobalContext';
import { buildUrl } from '../../../../../common/utils/buildUrl';
import { onPaste, validateStacksAddress } from '../../../../../common/utils/utils';
import { Button } from '../../../../../components/ui/button';
import { Text } from '../../../../../ui/Text';
import { TextLink } from '../../../../../ui/TextLink';
import { Caption, Title } from '../../../../../ui/typography';

export const SearchContractsForm: FC<{ rootContractAddress: string }> = ({
  rootContractAddress,
}) => {
  const router = useRouter();
  const network = useGlobalContext().activeNetwork;

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{
        principal: rootContractAddress,
        contract_name: 'pox-4',
      }}
      validate={values => {
        const errors: any = {};
        const validPrincipal = validateStacksAddress(values.principal);
        if (!validPrincipal) {
          errors['principal'] = 'Invalid Stacks address.';
        }
        if (!values.contract_name) {
          errors['contract_name'] = 'Contract name required.';
        }
        return errors;
      }}
      onSubmit={({ principal, contract_name }) => {
        router.push(buildUrl(`/sandbox/contract-call/${principal}.${contract_name}`, network));
      }}
      render={({ handleChange, handleBlur, values, setValues, errors, handleSubmit }) => (
        <Form>
          <Stack p={6}>
            {/* <Box as="form"> */}
            <Stack gap={4}>
              <Title fontSize={6}>Call a contract</Title>
              <Text fontSize={'sm'}>
                Manually enter contract details below, or load a contract from your transactions to
                see available functions.
              </Text>
              <Caption>
                Hint: you can paste the{' '}
                <TextLink
                  display="inline"
                  textDecoration="underline"
                  href="https://docs.blockstack.org/smart-contracts/principals#smart-contracts-as-principals"
                  target="_blank"
                >
                  smart contracts' identifier
                </TextLink>{' '}
                in this format: [principal].[contract-name]
              </Caption>
              {Object.keys(errors)?.length ? (
                <Box
                  borderRadius="6px"
                  bg="rgba(207,0,0,0.05)"
                  border="1px solid rgba(207,0,0,0.1)"
                  px="16px"
                  py="8px"
                  color="red"
                  lineHeight="1.8"
                  fontSize="sm"
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
                color={'text'}
                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
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
                  })
                }
              />
              <Input
                id="contract_name"
                name="contract_name"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contract_name}
                placeholder="Enter the contract name"
                color={'text'}
              />
              <Box>
                <Button onClick={() => handleSubmit()} variant="primary">
                  Get contract
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Form>
      )}
    />
  );
};
