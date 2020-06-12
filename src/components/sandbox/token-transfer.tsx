import * as React from 'react';
import BigNum from 'bn.js';
import { Formik } from 'formik';
import { Flex, Box, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { network } from '@common/sandbox';
import { fetchTransaction } from '@store/transactions';
import { makeSTXTokenTransfer } from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useConfigState } from '@common/hooks/use-config-state';
import { useSandboxState } from '@common/hooks/use-sandbox-state';

export const TokenTransfer = (props: any) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const { identity, doFetchAccount, doBroadcastTransaction } = useSandboxState();
  const dispatch = useDispatch();
  const { apiServer } = useConfigState();
  const initialValues = {
    senderKey: identity?.privateKey,
    recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    amount: 100,
    memo: 'hello world!',
  };

  const makeAndBroadcastTx = async ({ senderKey, recipient, amount, memo, principal }: any) => {
    const tx = await makeSTXTokenTransfer({
      senderKey,
      recipient,
      amount: new BigNum(amount),
      memo,
      network: network(apiServer as string),
    });
    return doBroadcastTransaction({ principal, tx });
  };

  const onSubmit = async ({ senderKey, recipient, amount, memo }: any) => {
    if (!identity) return;
    ref?.current?.blur();
    doStartLoading();
    try {
      const [account, response] = await Promise.all(
        [
          doFetchAccount(identity.address),
          makeAndBroadcastTx({
            senderKey,
            recipient,
            amount,
            memo,
            principal: identity.address,
          }),
        ].map((promise: Promise<any>) => promise.catch(e => console.log(e)))
      );

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
                <Field name="recipient" label="Recipient address" />
                <Field type="number" name="amount" label="uSTX amount" />
                <Field name="memo" label="Memo (message)" />
                <Box>
                  <Button
                    ref={ref as any}
                    type="submit"
                    style={{
                      pointerEvents: isLoading ? 'none' : 'unset',
                    }}
                    isLoading={isLoading}
                  >
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
