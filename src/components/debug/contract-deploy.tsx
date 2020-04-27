import * as React from 'react';
import { Text, Flex, Box, Stack, Button } from '@blockstack/ui';
import { Input, FormLabel } from '@components/debug/common';
import { Title } from '@components/typography';
import { handleDebugFormSubmit, Key } from '@common/debug';
import { useFormik } from 'formik';
import Link from 'next/link';
import { CodeEditor } from '@components/code-editor';
import { SampleContracts } from '@common/debug/examples';

export const ContractDeploy = (props: any) => {
  const path = '/debug/broadcast/contract-deploy';
  const [txid, setTxid] = React.useState('');
  const formik = useFormik({
    initialValues: {
      origin_key: '',
      contract_name: SampleContracts[0].contractName,
      source_code: SampleContracts[0].contractSource,
      fee_rate: 123456,
    },
    onSubmit: async values => {
      const text = await handleDebugFormSubmit(values, path);
      const regex = /0x[A-Fa-f0-9]{64}/;
      // @ts-ignore
      const txid = regex.exec(text);
      if (txid && txid.length) {
        setTxid(txid[0]);
      }
    },
  });

  return (
    <Flex
      as="form"
      //@ts-ignore
      onSubmit={formik.handleSubmit}
      action=""
      method="post"
    >
      <Stack isInline>
        <Box flexShrink={0} pr="base" minWidth="400px">
          <Stack spacing="base">
            <Title as="h2">Contract Deploy</Title>
            <Box>
              <FormLabel htmlFor="origin_key">Sender key</FormLabel>
              <Input
                list="origin_keys"
                name="origin_key"
                placeholder="Secret key hash"
                onChange={formik.handleChange}
                value={formik.values.origin_key}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="fee_rate">uSTX tx fee</FormLabel>
              <Input
                type="number"
                id="fee_rate"
                name="fee_rate"
                onChange={formik.handleChange}
                value={formik.values.fee_rate}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="contract_name">Contract name</FormLabel>
              <Input
                type="text"
                id="contract_name"
                name="contract_name"
                onChange={formik.handleChange}
                value={formik.values.contract_name}
                pattern="^[a-zA-Z]([a-zA-Z0-9]|[-_!?+&lt;&gt;=/*])*$|^[-+=/*]$|^[&lt;&gt;]=?$"
                maxLength={128}
              />
            </Box>
            <Box>
              <Button type="submit">Submit</Button>
            </Box>
          </Stack>
        </Box>
        <Box width="calc(100% - 400px)">
          <Stack>
            <Box>
              <FormLabel htmlFor="source_code">Contract source code (Clarity)</FormLabel>
              <CodeEditor
                id="source_code"
                name="source_code"
                onChange={formik.handleChange}
                code={formik.values.source_code}
              />
            </Box>

            {txid !== '' ? (
              <Box pt="extra-loose">
                <Box mb="base-tight">
                  <Text as="h3" fontWeight="bold">
                    Transaction
                  </Text>
                </Box>
                <Box>
                  <Link href="/txid/[txid]" as={`/txid/${txid}`} passHref>
                    <a href={`/txid/${txid}`} target="_blank">
                      {txid}
                    </a>
                  </Link>
                </Box>
              </Box>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
