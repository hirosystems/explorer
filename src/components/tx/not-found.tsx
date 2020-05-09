import React from 'react';

import { Button, Box, Flex } from '@blockstack/ui';
import { Title, Text } from '@components/typography';
import { Meta } from '@components/meta-head';
import { useProgressBar } from '@components/progress-bar';
import { useRouter } from 'next/router';
import { validateTxId, validateContractName } from '@common/utils';

const Pre = (props: any) => (
  <Text
    fontFamily={`"Fira Code", monospace`}
    bg="var(--colors-bg-light)"
    borderRadius="3px"
    px="extra-tight"
    border="1px solid var(--colors-border)"
    fontSize="14px"
    {...props}
  />
);

const TxIdMessage = ({ value }: { value?: string }) => (
  <>
    There is no current record of a transaction with ID: <Pre>{value}</Pre>
  </>
);

const ContractMessage = ({ value }: { value?: string }) => (
  <>
    There is no current record of a transaction containing a contract named: <Pre>{value}</Pre>
  </>
);

const GenericMessage = ({ value }: { value?: string }) => (
  <>
    There is no current record of a contract or transaction with this query: <Pre>{value}</Pre>
  </>
);

export const TxNotFound = ({ refresh }: { refresh: () => Promise<any> }) => {
  const buttonRef = React.useRef();
  const { query } = useRouter();
  const [validity, setValidity] = React.useState<
    { valid: boolean; type?: 'contract' | 'txid' } | undefined
  >();
  const searchQuery = query?.txid?.toString().trim();
  if (searchQuery) {
    if (searchQuery.includes('.')) {
      const isValidContract = validateContractName(searchQuery);
      if (isValidContract && !validity) {
        setValidity({
          valid: true,
          type: 'contract',
        });
      }
    } else {
      if (validateTxId(searchQuery) && !validity) {
        setValidity({
          valid: true,
          type: 'txid',
        });
      }

      !validity &&
        setValidity({
          valid: false,
        });
    }
  }

  const [loading, setLoading] = React.useState(false);
  const { start, done } = useProgressBar();
  const handleRefresh = async () => {
    setLoading(true);
    start();
    setTimeout(async () => {
      await refresh();
      setLoading(false);
      done();
    }, 3500);
  };
  return (
    <>
      <Meta title="Transaction not found" />
      <Flex
        maxWidth="700px"
        flexDirection="column"
        align="flex-start"
        justify="center"
        flexGrow={1}
      >
        <Title mb="base" as="h1" fontSize="36px">
          Transaction not found
        </Title>
        <Box>
          <Text maxWidth="544px">
            {validity?.type === 'txid' || searchQuery?.includes('0x') ? (
              <TxIdMessage value={searchQuery} />
            ) : validity?.type === 'contract' || searchQuery?.includes('.') ? (
              <ContractMessage value={searchQuery} />
            ) : (
              <GenericMessage value={searchQuery} />
            )}
          </Text>
        </Box>
        <Box mt="base">
          <Text maxWidth="460px">
            Transactions can take 60 or more seconds to confirm. If the you know the transaction was
            sent recently, feel free to refresh.
          </Text>
        </Box>
        <Button
          mt="loose"
          // @ts-ignore
          ref={buttonRef}
          onClick={async () => {
            if (!loading) {
              // @ts-ignore
              buttonRef?.current.blur();
              await handleRefresh();
            }
          }}
          isLoading={loading}
        >
          Refresh
        </Button>
      </Flex>
    </>
  );
};

export default TxNotFound;
