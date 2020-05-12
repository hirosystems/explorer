import * as React from 'react';
import { Formik } from 'formik';
import { Flex, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { useDebugState, network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import { fetchTransaction } from '@store/transactions';
import { makeSTXTokenTransfer } from '@blockstack/stacks-transactions';
import BigNum from 'bn.js';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';

export const TokenTransfer = (props: any) => {
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const { identity } = useDebugState();
  const dispatch = useDispatch();
  const initialValues = {
    senderKey: identity?.privateKey,
    recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    amount: 100,
    memo: 'hello world!',
  };

  const onSubmit = async ({ senderKey, recipient, amount, memo }: any) => {
    try {
      doStartLoading();
      console.log('identity', identity);
      await dispatch(fetchAccount(identity?.address));

      const tx = await makeSTXTokenTransfer({
        senderKey,
        recipient,
        amount: new BigNum(amount),
        memo,
        network,
      });
      console.log('tx', tx);

      const { payload, error } = await dispatch(
        broadcastTransaction({ principal: identity?.address, tx })
      );
      if (error) return doFinishLoading();
      setTimeout(async () => {
        const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));
        // @ts-ignore
        if (initialFetch.error) {
          await dispatch(fetchTransaction(payload.transactions[0].txId));
        }
        await dispatch(fetchAccount(identity?.address));
        doFinishLoading();
      }, 3500);
    } catch (e) {
      console.log(e);
      doFinishLoading();
    }
  };

  return (
    <Wrapper loading={isLoading} {...props}>
      <Formik initialValues={initialValues as any} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack spacing="base" maxWidth="560px" width="100%">
                <Field label="Sender key" name="senderKey" />
                <Field name="recipient" label="Recipient address" />
                <Field type="number" name="amount" label="uSTX amount" />
                <Field name="memo" label="Memo (message)" />
                <Button type="submit" isLoading={isLoading}>
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
