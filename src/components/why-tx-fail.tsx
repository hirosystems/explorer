import useSWR from 'swr';

import {
  Box,
  Button,
  Card,
  CardBody,
  Code,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import ReactMarkdown from 'react-markdown';

import { Badge } from '@/common/components/Badge';

const fetcher = (url: RequestInfo | URL) => fetch(url).then(res => res.json());

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const WhyTxFail = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, error } = useSWR(`https://hackathon-txfail.vercel.app/api/tx/${tx.tx_id}`, fetcher);

  if (error) return null;
  if (!data) return null;

  return (
    <Badge
      labelProps={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      background={`bg.${useColorMode().colorMode}`}
      gap={'4px'}
      color="white"
      bg="rgba(255,255,255,0.24)"
      border={'none'}
      onClick={onOpen}
      style={{ cursor: 'pointer' }}
    >
      <strong>🔍 Investigate 🧙🏻</strong>
      {/* <Icon as={IconComponent} size="16px" color="currentColor" /> */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>why tx fail?!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="24px">
              {data.reasons.length === 0 && (
                <Text>
                  Unable to determine why this transaction failed. Please try again later.
                </Text>
              )}
              {data.reasons.length > 0 &&
                data.reasons.map((reason, i) => (
                  <Card key={i}>
                    <CardBody>
                      <VStack spacing="12px" align="stretch">
                        <Box>
                          <ReactMarkdown>{reason.description}</ReactMarkdown>
                          {reason.readMore && (
                            <Button
                              as="a"
                              href={reason.readMore}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="link"
                              colorScheme="blue"
                            >
                              Read more &rarr;
                            </Button>
                          )}
                        </Box>

                        {reason.references?.length > 0 && (
                          <VStack spacing="12px" divider={true}>
                            {reason.references.map((ref, i) => (
                              <li key={i}>
                                <Button
                                  as="a"
                                  href={ref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="link"
                                  colorScheme="blue"
                                >
                                  {ref}
                                </Button>
                              </li>
                            ))}
                          </VStack>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              {data.rawLogs.length > 0 && (
                <VStack spacing="12px" align="stretch">
                  <Divider />
                  <Text>Raw logs</Text>
                  {data.rawLogs.map((log, i) => (
                    <Code key={i} wordBreak="break-all" borderRadius="3px">
                      {log}
                    </Code>
                  ))}
                </VStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Badge>
  );
};

export default WhyTxFail;
