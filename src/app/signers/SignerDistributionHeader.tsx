import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Question, X } from '@phosphor-icons/react';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { useDisclosure } from '../../ui/hooks/useDisclosure';

export function SignerDistributionHeader({ signerTitle }: { signerTitle: string }) {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Flex direction="row" height="auto" alignItems="center">
      <Flex gap={2} alignItems="center">
        <Text fontSize="xs" fontWeight="semibold">
          {signerTitle}
        </Text>
        <Tooltip label="What's a Signer?">
          <Icon as={Question} size={4} color="iconSubdued" onClick={onToggle} />
        </Tooltip>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <Flex flexDirection="column" p={6} gap={4}>
              <Flex justifyContent="space-between">
                <Flex gap={2} alignItems="center">
                  <Icon as={Question} size={6} color="iconSubdued" onClick={onToggle} />
                  <Text fontSize={20} fontWeight="medium">
                    What's a Signer?
                  </Text>
                </Flex>
                <Icon as={X} size={6} color="iconSubdued" onClick={onToggle} />
              </Flex>
              <Box>
                <Stack gap={10}>
                  <Text lineHeight={5} fontSize={14}>
                    The Nakamoto upgrade introduces a new role of "Signer." Signers participate in
                    the Stacks protocol by validating and signing the blocks produced by Stacks
                    miners. In order to continue to receive PoX payouts for stacking their STX
                    tokens, Stackers must either become Signers themselves or delegate this
                    responsibility to another Signer, such as via a Stacking Pool or hosted service.
                    For more details on this please see the{' '}
                    <Link
                      href="https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow"
                      color="interactive"
                    >
                      Stacks Docs
                    </Link>
                    .
                  </Text>
                  <Stack gap={4}>
                    <Text fontSize={20} fontWeight="medium">
                      Run a Signer
                    </Text>
                    <Text fontSize={14}>
                      If you're intereseted in running a Signer, checkout the{' '}
                      <Link
                        href="https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/running-a-signer"
                        color="interactive"
                      >
                        documentation
                      </Link>
                      .
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </Flex>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
}
