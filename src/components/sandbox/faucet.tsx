import * as React from 'react';
import { Flex, Stack, Button, Box } from '@stacks/ui';
import { useDispatch } from 'react-redux';
import { fetchAccount } from '@store/sandbox';
import { fetchTransaction } from '@store/transactions';
import { Formik } from 'formik';
import { Field, Wrapper } from '@components/sandbox/common';
import { useSandboxState } from '@common/hooks/use-sandbox-state';
import { useLoading } from '@common/hooks/use-loading';

export const Faucet = (props: any) => {
  const { identity, doFetchAccount, doRequestFaucetFunds } = useSandboxState();
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();

  const dispatch = useDispatch();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const onSubmit = async (values: any) => {
    ref?.current?.blur();
    try {
      doStartLoading();
      const account: any = await doFetchAccount(values.stacks_address);
      if (account.error) return doFinishLoading();

      const payload = await doRequestFaucetFunds(values.stacks_address);
      const txid = payload?.transactions?.length ? payload?.transactions[0].txId : undefined;
      if (!txid) return doFinishLoading();
      props.showTransactionDialog();
      doFinishLoading();

      const initialFetch: any = await dispatch(fetchTransaction(txid));

      if (initialFetch.error) return;
      await dispatch(fetchAccount(values.stacks_address));
    } catch (e) {
      doFinishLoading();
    }
  };

  return (
    <Wrapper loading={isLoading} {...props}>
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
                      pointerEvents: isLoading ? 'none' : 'unset',
                    }}
                    isLoading={isLoading}
                    ref={ref as any}
                  >
                    Request STX
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
