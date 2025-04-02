'use client';

import { CopyButtonRedesign } from '@/common/components/CopyButton';
import { TxLink } from '@/common/components/ExplorerLinks';
import { useContractById } from '@/common/queries/useContractById';
import { Button } from '@/ui/Button';
import { Text } from '@/ui/Text';
import { Flex, Icon, Stack } from '@chakra-ui/react';
import { ArrowRight, ArrowsOutSimple } from '@phosphor-icons/react';
import { useCallback, useRef, useState } from 'react';

import {
  ContractCallTransaction,
  MempoolContractCallTransaction,
  MempoolSmartContractTransaction,
  SmartContractTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { CodeEditor } from './CodeEditor';

const DEFAULT_HEIGHT = '252px';
const BUTTONS_HEIGHT = 8;

export function Source({
  tx,
}: {
  tx:
    | ContractCallTransaction
    | MempoolContractCallTransaction
    | SmartContractTransaction
    | MempoolSmartContractTransaction;
}) {
  const txContractId =
    'contract_call' in tx ? tx.contract_call.contract_id : tx.smart_contract.contract_id;
  const { data: txContract } = useContractById(txContractId);
  const sourceCode = txContract?.source_code;
  const [codeHeight, setCodeHeight] = useState(DEFAULT_HEIGHT);
  const [isCodeHeightExpanded, setIsCodeHeightExpanded] = useState(false);
  const editorRef = useRef<any>(null);
  const toggleHeight = useCallback(() => {
    setIsCodeHeightExpanded(!isCodeHeightExpanded);
    if (isCodeHeightExpanded) {
      setCodeHeight(DEFAULT_HEIGHT);
    } else {
      setCodeHeight(editorRef.current?.getContentHeight());
    }
  }, [isCodeHeightExpanded]);
  return (
    <Flex position="relative" w="full">
      <Flex
        className="floating-buttons"
        position={'absolute'}
        top={4}
        right={4}
        gap={1.5}
        zIndex="docked"
      >
        <TxLink txId={txContractId} variant="noUnderline">
          <Button
            aria-label={'expand source code'}
            py={2}
            px={3}
            h={BUTTONS_HEIGHT}
            w="fit-content"
            bg="surfaceInvert"
          >
            <Flex alignItems="center" gap={1}>
              <Text color="var(--stacks-colors-neutral-sand-050)" textStyle="text-medium-xs">
                View Deployment
              </Text>
              <Icon color="iconInvert" h={3.5} w={3.5}>
                <ArrowRight />
              </Icon>
            </Flex>
          </Button>
        </TxLink>
        <Button
          aria-label={'expand source code'}
          onClick={toggleHeight}
          p={1.5}
          h={BUTTONS_HEIGHT}
          w={BUTTONS_HEIGHT}
          minW={BUTTONS_HEIGHT}
          bg="surfaceInvert"
        >
          <Icon color="iconInvert" h={3.5} w={3.5}>
            <ArrowsOutSimple />
          </Icon>
        </Button>
        <CopyButtonRedesign
          initialValue={sourceCode || ''}
          iconProps={{
            color: 'iconInvert',
            h: 3.5,
            w: 3.5,
            _hover: {},
          }}
          buttonProps={{
            p: 1.5,
            bg: 'surfaceInvert',
            h: BUTTONS_HEIGHT,
            w: BUTTONS_HEIGHT,
            minW: BUTTONS_HEIGHT,
            _hover: {},
            _groupHover: {},
          }}
        />
      </Flex>
      <Stack height={codeHeight} w="full">
        <CodeEditor code={sourceCode || ''} ref={editorRef} />
      </Stack>
    </Flex>
  );
}
