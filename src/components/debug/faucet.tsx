import * as React from 'react';
import { Flex, Stack, Button } from '@blockstack/ui';

import { useDebugState } from '@common/debug';
import { useDispatch } from 'react-redux';
import { fetchAccount, requestFaucetFunds } from '@store/debug';

import { fetchTransaction } from '@store/transactions';

import { Formik } from 'formik';
import { Field, Wrapper } from '@components/debug/common';

export const Faucet = (props: any) => {
  const { identity } = useDebugState();

  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const onSubmit = async (values: any) => {
    setLoading(true);
    let account = await dispatch(fetchAccount(values.stacks_address));
    if (account.error) return setLoading(false);

    const { payload, error: faucetError } = await dispatch(
      requestFaucetFunds(values.stacks_address)
    );
    if (faucetError) return setLoading(false);

    setTimeout(async () => {
      const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));
      // @ts-ignore
      if (initialFetch.error) {
        await dispatch(fetchTransaction(payload.transactions[0].txId));
      }

      let account = await dispatch(fetchAccount(values.stacks_address));
      if (account.error) return setLoading(false);

      setLoading(false);
    }, 3500);
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
              <Stack spacing="base" width="100%">
                <Field label="Stacks address" name="stacks_address" />
                <Button
                  type="submit"
                  style={{
                    pointerEvents: loading ? 'none' : 'unset',
                  }}
                  isLoading={loading}
                >
                  Submit
                </Button>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
