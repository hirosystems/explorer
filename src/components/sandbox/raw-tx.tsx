import * as React from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { Flex, Box, Stack, Button } from '@stacks/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { fetchTransaction } from '@store/transactions';
import { useLoading } from '@common/hooks/use-loading';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

export const RawTx = (props: any) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const { identity, doFetchAccount, doBroadcastTransaction } = useSandboxState();
  const dispatch = useDispatch();
  const initialValues = {
    rawTx: '',
  };

  const onSubmit = async ({ rawTx }: any) => {
    if (rawTx === '' || !identity) return;
    ref?.current?.blur();
    try {
      doStartLoading();
      const [account, response] = await Promise.all([
        doFetchAccount(),
        doBroadcastTransaction({ principal: identity.address, tx: rawTx, isRaw: true }),
      ]);
      if (!response || !response.transactions?.length || !response.transactions[0].txId)
        return doFinishLoading();
      props.showTransactionDialog();
      await Promise.all([
        dispatch(fetchTransaction(response.transactions[0].txId)),
        doFetchAccount(identity?.address),
      ]);
      doFinishLoading();
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
                  <Button ref={ref as any} type="submit" isLoading={isLoading}>
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
