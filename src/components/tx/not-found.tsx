import React from 'react';

import { Button, Box, Flex } from '@blockstack/ui';
import { Title, Text, Pre } from '@components/typography';
import { Meta } from '@components/meta-head';
import { useLoading } from '@common/hooks/use-loading';
import { useRouter } from 'next/router';
import { validateTxId, validateContractName } from '@common/utils';
import { useToast } from '@common/hooks/use-toast';

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

export const TxNotFound = ({ refresh }: { refresh: (query?: string) => Promise<any> }) => {
  const buttonRef = React.useRef<any | null>(null);
  const { query } = useRouter();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();
  const { addCriticalToast } = useToast();
  const refreshTimer = React.useRef<any | null>(null);
  const toastTimer = React.useRef<any | null>(null);
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

  const handleRefresh = React.useCallback(async () => {
    doStartLoading();
    // @ts-ignore
    refreshTimer.current = setTimeout(async () => {
      const action = await refresh(searchQuery);
      if (action.error) {
        toastTimer.current = setTimeout(() => {
          addCriticalToast({
            message: 'Transaction not found',
            description: 'There is no record of this transaction, try refreshing again soon.',
          });
        }, 500);
      }
      doFinishLoading();
    }, 3500);
  }, [searchQuery]);

  // clear timeout if component unmounts
  React.useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(refreshTimer.current);
    };
  }, []);
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
            if (!isLoading) {
              // @ts-ignore
              buttonRef?.current.blur();
              await handleRefresh();
            }
          }}
          isLoading={isLoading}
        >
          Refresh
        </Button>
      </Flex>
    </>
  );
};

export default TxNotFound;
