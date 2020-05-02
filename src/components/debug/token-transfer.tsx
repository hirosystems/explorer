import * as React from 'react';
import { Formik } from 'formik';
import { Flex, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/debug/common';
import { useDebugState, network } from '@common/debug';
import { broadcastTransaction, fetchAccount } from '@store/debug';
import { fetchTransaction } from '@store/transactions';
import { makeSTXTokenTransfer } from '@blockstack/stacks-transactions';
import BigNum from 'bn.js';
import { useDispatch } from 'react-redux';

export const TokenTransfer = (props: any) => {
  const [loading, setLoading] = React.useState(false);
  const { identity } = useDebugState();
  const dispatch = useDispatch();
  const initialValues = {
    senderKey: identity?.privateKey,
    recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    amount: 100,
    memo: 'hello world!',
  };

  const onSubmit = async ({ senderKey, recipient, amount, fee, memo }: any) => {
    try {
      setLoading(true);
      await dispatch(fetchAccount(identity?.address));
      const tx = await makeSTXTokenTransfer({
        senderKey,
        recipient,
        amount: new BigNum(amount),
        memo,
        network,
      });

      const { payload, error } = await dispatch(
        broadcastTransaction({ principal: identity?.address, tx })
      );
      if (error) return setLoading(false);
      setTimeout(async () => {
        const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));
        // @ts-ignore
        if (initialFetch.error) {
          await dispatch(fetchTransaction(payload.transactions[0].txId));
        }
        await dispatch(fetchAccount(identity?.address));
        setLoading(false);
      }, 3500);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper loading={loading} {...props}>
      <Formik initialValues={initialValues as any} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack spacing="base" width="100%">
                <Field label="Sender key" name="senderKey" />
                <Field type="number" name="amount" label="uSTX amount" />
                <Field name="memo" label="Memo (message)" />
                <Field name="recipient" label="Recipient address" />
                <Button type="submit" isLoading={loading}>
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
