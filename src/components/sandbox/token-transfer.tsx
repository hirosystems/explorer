import * as React from 'react';
import BigNum from 'bn.js';
import { Formik } from 'formik';
import { Flex, Box, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { useDebugState, network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import { fetchTransaction } from '@store/transactions';
import { makeSTXTokenTransfer } from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast } from '@common/sandbox';

import { useConfigState } from '@common/hooks/use-config-state';

export const TokenTransfer = (props: any) => {
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const { identity } = useDebugState();
  const dispatch = useDispatch();
  const { apiServer } = useConfigState();
  const initialValues = {
    senderKey: identity?.privateKey,
    recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    amount: 100,
    memo: 'hello world!',
  };
  const showToast = useTxToast();

  const onSubmit = async ({ senderKey, recipient, amount, memo }: any) => {
    try {
      doStartLoading();

      await dispatch(fetchAccount(identity?.address));

      const tx = await makeSTXTokenTransfer({
        senderKey,
        recipient,
        amount: new BigNum(amount),
        memo,
        network: network(apiServer as string),
      });

      const { payload, error } = await dispatch(
        broadcastTransaction({ principal: identity?.address, tx })
      );
      if (error) return doFinishLoading();

      props.showTransactionDialog();

      showToast(payload.transactions[0].txId);

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
                <Field name="recipient" label="Recipient address" />
                <Field type="number" name="amount" label="uSTX amount" />
                <Field name="memo" label="Memo (message)" />
                <Box>
                  <Button type="submit" isLoading={isLoading}>
                    Send STX
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
