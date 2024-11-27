'use client';

import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Question, X } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';

import { BtcStxBlockLinks } from '../../../common/components/BtcStxBlockLinks';
import { KeyValueHorizontal } from '../../../common/components/KeyValueHorizontal';
import { Section } from '../../../common/components/Section';
import { Timestamp } from '../../../common/components/Timestamp';
import { Value } from '../../../common/components/Value';
import '../../../common/components/loaders/skeleton-text';
import { useSuspenseBlockByHeightOrHash } from '../../../common/queries/useBlockByHash';
import { SkeletonTxsList } from '../../../features/txs-list/SkeletonTxsList';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { Stack } from '../../../ui/Stack';
import { Text } from '../../../ui/Text';
import { useDisclosure } from '../../../ui/hooks/useDisclosure';
import { PageTitle } from '../../_components/PageTitle';
import { TowColLayout } from '../../_components/TwoColLayout';
import { BlockBtcAnchorBlockCard } from './BlockBtcAnchorBlockCard';

const BlockTxsList = dynamic(
  () => import('./tx-lists/BlockTxsList').then(mod => mod.BlockTxsList),
  {
    loading: () => (
      <Section title={'Transactions'}>
        <SkeletonTxsList />
      </Section>
    ),
    ssr: false,
  }
);

export default function BlockPage({ params: { hash } }: any) {
  const { data: block } = useSuspenseBlockByHeightOrHash(hash);
  const title = (block && `STX Block #${block.height.toLocaleString()}`) || '';
  const { isOpen, onToggle, onClose } = useDisclosure();
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <TowColLayout>
        <Section title="Summary">
          <KeyValueHorizontal label={'Hash'} value={<Value>{hash}</Value>} copyValue={hash} />
          {block && (
            <>
              <KeyValueHorizontal
                label={'Block height'}
                value={
                  <BtcStxBlockLinks
                    btcBlockHeight={block.burn_block_height}
                    stxBlockHeight={block.height}
                    stxBlockHash={block.hash}
                  />
                }
              />
              <KeyValueHorizontal label={'Mined'} value={<Timestamp ts={block.block_time} />} />
              <KeyValueHorizontal label={'Transactions'} value={<Value>{block.tx_count}</Value>} />
              {block.tenure_height !== null && (
                <KeyValueHorizontal
                  label={'Tenure Height'}
                  value={<Value>{block.tenure_height}</Value>}
                />
              )}
              {!block.canonical ? (
                <KeyValueHorizontal
                  label={'Canonical'}
                  value={
                    <Flex gap={2}>
                      <Value>False</Value>
                      <Icon as={Question} size={4} color="iconSubdued" onClick={onToggle} />
                      <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                          <Flex flexDirection="column" p={6} gap={4}>
                            <Flex justifyContent="space-between">
                              <Flex gap={2} alignItems="center">
                                <Icon
                                  as={Question}
                                  size={6}
                                  color="iconSubdued"
                                  onClick={onToggle}
                                />
                                <Text fontSize={20} fontWeight="medium">
                                  Non-Canonical Blocks
                                </Text>
                              </Flex>
                              <Icon as={X} size={6} color="iconSubdued" onClick={onToggle} />
                            </Flex>
                            <Box>
                              <Stack gap={5}>
                                <Text lineHeight={5} fontSize={14}>
                                  In the Bitcoin network, non-canonical blocks occur when two blocks
                                  are mined simultaneously, causing a temporary split in the
                                  blockchain. The BTC protocol follows the longest chain rule: so
                                  whichever chain gains an additional block first becomes the
                                  canonical chain. Miners switch to the longest chain, and the block
                                  from the shorter chain is orphaned and excluded from the main
                                  blockchain.
                                </Text>
                                <Text lineHeight={5} fontSize={14}>
                                  On the Stacks blockchain, blocks mined on top of an orphaned BTC
                                  block also become orphaned, and are discarded, as they are built
                                  on a block that is not part of the Bitcoin main chain.
                                </Text>
                              </Stack>
                            </Box>
                          </Flex>
                        </ModalContent>
                      </Modal>
                    </Flex>
                  }
                />
              ) : null}
            </>
          )}
        </Section>
        <BlockBtcAnchorBlockCard />
      </TowColLayout>
      <BlockTxsList blockHash={hash} />
    </>
  );
}
