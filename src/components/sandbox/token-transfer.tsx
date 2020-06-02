import * as React from 'react';

import { Formik } from 'formik';
import { Flex, Stack, Button } from '@blockstack/ui';
import { Field, Wrapper } from '@components/sandbox/common';
import { useSandboxState } from '@common/sandbox';
import { fetchAccount } from '@store/sandbox';

import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast, openSTXTransfer } from '@common/sandbox';
import { FinishedTxData } from '@blockstack/connect';

export const TokenTransfer = (props: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isLoading, doStartLoading, doFinishLoading } = useLoading();
  const { stxAddress } = useSandboxState();
  const dispatch = useDispatch();

  const intervalRef = React.useRef<number | null>(null);

  const initialValues = {
    recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    amount: 100,
    memo: 'hello world!',
  };
  const showToast = useTxToast();

  React.useEffect(() => {
    if (isLoading && !isOpen) {
      doFinishLoading();
    }
  }, [isLoading, isOpen]);

  const onSubmit = async ({ recipient, amount, memo }: any) => {
    try {
      setIsOpen(true);
      doStartLoading();

      await dispatch(fetchAccount(stxAddress));

      const popup = await openSTXTransfer({
        recipient,
        amount: amount.toString(),
        memo,
        finished: (txData: FinishedTxData) => {
          console.log(txData);
          doFinishLoading();
        },
      });

      intervalRef.current = setInterval(() => {
        if (popup?.closed && isOpen) {
          setIsOpen(false);
          intervalRef.current && clearInterval(intervalRef.current);
        }
      }, 250);

      // const tx = await makeSTXTokenTransfer({
      //   senderKey,
      //   recipient,
      //   amount: new BigNum(amount),
      //   memo,
      //   network: network(apiServer as string),
      // });

      // const { payload, error } = await dispatch(
      //   broadcastTransaction({ principal: identity?.address, tx })
      // );
      // if (error) return doFinishLoading();

      // props.showTransactionDialog();
      //
      // showToast(payload.transactions[0].txId);

      // setTimeout(async () => {
      //   const initialFetch = await dispatch(fetchTransaction(payload.transactions[0].txId));
      //   // @ts-ignore
      //   if (initialFetch.error) {
      //     await dispatch(fetchTransaction(payload.transactions[0].txId));
      //   }
      //   await dispatch(fetchAccount(identity?.address));
      //   doFinishLoading();
      // }, 3500);
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
