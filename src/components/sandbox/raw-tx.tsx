import * as React from 'react';

import { Formik } from 'formik';
import { Flex, Box, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { useDebugState } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import { fetchTransaction } from '@store/transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast } from '@common/sandbox';

export const RawTx = (props: any) => {
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const { identity } = useDebugState();
  const dispatch = useDispatch();
  const initialValues = {
    rawTx: '',
  };
  const showToast = useTxToast();

  const onSubmit = async ({ rawTx }: any) => {
    if (rawTx === '') return;
    try {
      doStartLoading();

      await dispatch(fetchAccount(identity?.address));

      const { payload, error } = await dispatch(
        broadcastTransaction({ principal: identity?.address, tx: rawTx, isRaw: true })
      );
      if (error) return doFinishLoading();

      props.showTransactionDialog();

      showToast(payload.transactions[0].txId);

      setTimeout(async () => {
        const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));

        // todo: typing fix -- asyncThunk
        if ((initialFetch as any).error) {
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
                <Field type="textarea" name="rawTx" label="Raw transaction" />
                <Box>
                  <Button type="submit" isLoading={isLoading}>
                    Broadcast transaction
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
