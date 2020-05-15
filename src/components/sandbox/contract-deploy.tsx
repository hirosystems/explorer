import * as React from 'react';
import BigNum from 'bn.js';
import { Formik } from 'formik';
import { Flex, Stack, Box, Button, ChevronIcon } from '@blockstack/ui';
import { Field, FieldBase, Wrapper } from '@components/sandbox/common';
import { SampleContracts } from '@common/sandbox/examples';
import { fetchTransaction } from '@store/transactions';
import { useDebugState, network } from '@common/sandbox';
import { broadcastTransaction, fetchAccount } from '@store/sandbox';
import {
  makeSmartContractDeploy,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@blockstack/stacks-transactions';
import { useDispatch } from 'react-redux';
import { useLoading } from '@common/hooks/use-loading';
import { useTxToast } from '@common/sandbox';
import { Popover } from '@components/popover/popover';

const Sample = (props: any) => {
  const [value, setValue] = React.useState(0);
  const handleValueClick = ({ value }: { value: number }) => {
    setValue(value);
    props.setFieldValue('codeBody', SampleContracts[value].source);
  };
  const ref = React.useRef(null);
  React.useEffect(() => console.log('ref', ref), [ref]);
  const inputValue = SampleContracts[value].name;
  return (
    <Box {...props}>
      <Popover
        onItemClick={handleValueClick}
        items={SampleContracts.map(({ name }, key: number) => ({
          label: name,
          value: key,
        }))}
        triggerRef={ref}
      >
        <Box position="relative">
          <FieldBase
            label="Sample contracts"
            type="text"
            value={inputValue}
            name="sampleContracts"
            ref={ref}
          />
          <Flex
            color="var(--colors-invert)"
            p="base"
            pt="40px"
            alignItems="center"
            position="absolute"
            bottom="0"
            right={0}
            height="100%"
          >
            <ChevronIcon size="22px" direction="down" />
          </Flex>
        </Box>
      </Popover>
    </Box>
  );
};

export const ContractDeploy = (props: any) => {
  const { identity } = useDebugState();
  const showToast = useTxToast();
  const dispatch = useDispatch();
  const { isLoading, doFinishLoading, doStartLoading } = useLoading();

  const initialValues = {
    senderKey: identity?.privateKey,
    contractName: SampleContracts[0].name,
    codeBody: SampleContracts[0].source,
    fee: 2000,
  };

  const onSubmit = async ({ senderKey, contractName, codeBody, fee, memo }: any) => {
    const address = identity?.address;
    if (!address) return;
    try {
      doStartLoading();
      await dispatch(fetchAccount(identity?.address));

      // hardcode some post conditions for now :)
      const postConditions = [
        makeStandardSTXPostCondition(address, FungibleConditionCode.Less, new BigNum(2)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.LessEqual, new BigNum(3)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, new BigNum(4)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.GreaterEqual, new BigNum(4)),
        makeStandardSTXPostCondition(address, FungibleConditionCode.Greater, new BigNum(1)),
      ];

      const tx = await makeSmartContractDeploy({
        senderKey,
        contractName,
        codeBody,
        fee: new BigNum(fee),
        postConditions,
        network,
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
    }
  };

  return (
    <Wrapper loading={isLoading} title="Contract deploy" {...props}>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} method="post">
            <Flex width="100%">
              <Stack isInline spacing="base" width="100%">
                <Stack spacing="base" width="100%">
                  <Field label="Sender key" name="senderKey" />
                  <Field type="number" name="fee" label="Fee rate" />
                  <Field name="contractName" label="Contract name" />
                  <Button type="submit" isLoading={isLoading}>
                    Submit
                  </Button>
                </Stack>
                <Box maxWidth="60%" width="100%" flexShrink={0}>
                  <Stack spacing="base" width="100%">
                    <Sample setFieldValue={setFieldValue} />
                    <Field label="Contract source code (editable)" name="codeBody" type="code" />
                  </Stack>
                </Box>
              </Stack>
            </Flex>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};
