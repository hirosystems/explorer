import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { Question, X } from '@phosphor-icons/react';

import { Flex } from '../../ui/Flex';
import { FormControl } from '../../ui/FormControl';
import { FormLabel } from '../../ui/FormLabel';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Switch } from '../../ui/Switch';
import { Text } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { useDisclosure } from '../../ui/hooks/useDisclosure';

export function SignerDistributionHeader({
  signerTitle,
  setOnlyShowPublicSigners,
  onlyShowPublicSigners,
}: {
  signerTitle: string;
  setOnlyShowPublicSigners: (value: boolean) => void;
  onlyShowPublicSigners: boolean;
}) {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Flex
      direction={['column', 'column', 'row', 'row', 'row']}
      justifyContent="space-between"
      gap={4}
      height={['auto', 'auto', 6, 6, 6]}
      alignItems={['flex-start', 'flex-start', 'flex-start', 'center', 'center']}
    >
      <Flex gap={2} alignItems="center">
        <Text fontSize="xs" fontWeight="semibold">
          {signerTitle}
        </Text>
        <Tooltip label="What's a Signer?">
          <Icon as={Question} size={4} color="iconSubdued" onClick={onToggle} />
        </Tooltip>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
              <Text lineHeight={5} fontSize={14}>
                The Nakamoto upgrade introduces a new role of "Signer." Signers participate in the
                Stacks protocol by validating and signing the blocks produced by Stacks miners. In
                order to continue to receive PoX payouts for stacking their STX tokens, Stackers
                must either become Signers themselves or delegate this responsibility to another
                Signer, such as via a Stacking Pool or hosted service. For more details on this
                please see the{' '}
                <Link
                  href="https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow"
                  color="purple.600"
                >
                  Stacks Docs
                </Link>
                .
              </Text>
            </Flex>
          </ModalContent>
        </Modal>
      </Flex>
      <FormControl display="flex" alignItems="center" gap={3} width="fit-content">
        <Switch
          id="only-show-public-signers"
          onChange={() => {
            setOnlyShowPublicSigners(!onlyShowPublicSigners);
          }}
          isChecked={onlyShowPublicSigners}
        />
        <FormLabel
          htmlFor="only-show-public-signers"
          m="0"
          fontSize={'14px'}
          lineHeight={'1.5em'}
          fontWeight={400}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
        >
          Show only public signers
        </FormLabel>
      </FormControl>
    </Flex>
  );
}
