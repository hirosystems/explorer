import * as React from 'react';
import { Flex, Stack, Button, Box } from '@blockstack/ui';

import { useDebugState } from '@common/sandbox';
import { useDispatch } from 'react-redux';
import { fetchAccount, requestFaucetFunds } from '@store/sandbox';
import { useRouter } from 'next/router';
import { fetchTransaction } from '@store/transactions';

import { useToast } from '@common/hooks/use-toast';

import { Formik } from 'formik';
import { Field, Wrapper } from '@components/sandbox/common';
import { truncateMiddle } from '@common/utils';
import { useProgressBar } from '@components/progress-bar';

export const Faucet = (props: any) => {
  const { identity } = useDebugState();
  const { start, done } = useProgressBar();
  const router = useRouter();

  const { addPositiveToast } = useToast();

  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const startLoading = () => {
    setLoading(true);
    start();
  };

  const stopLoading = () => {
    done();
    setLoading(false);
  };

  const onSubmit = async (values: any) => {
    try {
      startLoading();
      const account = await dispatch(fetchAccount(values.stacks_address));
      if (account.error) return stopLoading();

      const { payload, error: faucetError } = await dispatch(
        requestFaucetFunds(values.stacks_address)
      );
      if (faucetError) return stopLoading();

      const txid = payload.transactions[0].txId;

      addPositiveToast({
        message: `Transaction: ${truncateMiddle(txid)} submitted!`,
        description: `Transactions can take 60 or more seconds to confirm.`,
        action: {
          label: 'View transaction',
          onClick: () => {
            router.push('/txid/[txid]', `/txid/${txid}`);
          },
        },
      });

      stopLoading();

      setTimeout(async () => {
        const initialFetch = await dispatch(fetchTransaction(txid));
        // @ts-ignore
        if (initialFetch.error as any) return;
        await dispatch(fetchAccount(values.stacks_address));
      }, 20000);
    } catch (e) {
      stopLoading();
    }
  };

  return (
    <Wrapper loading={loading} title="Contract deploy" {...props}>
      <Formik
        enableReinitialize
        initialValues={{
          stacks_address: identity?.address,
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack spacing="base" maxWidth="560px" width="100%">
                <Field label="Stacks address" name="stacks_address" />
                <Box>
                  <Button
                    type="submit"
                    style={{
                      pointerEvents: loading ? 'none' : 'unset',
                    }}
                    isLoading={loading}
                    loadingText="Processing..."
                  >
                    Submit
                  </Button>
                </Box>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
