import { DoubleGradientBorderWrapper2 } from '@/common/components/DoubleGradientBorderWrapper2';
import { openModal, useOpenedModal } from '@/common/components/modals/modal-slice';
import { MODALS } from '@/common/constants/constants';
import { useIsInViewport } from '@/common/hooks/useIsInViewport';
import { useAppDispatch } from '@/common/state/hooks';
import { splitStxAddressIntoParts } from '@/common/utils/string-utils';
import { getToAddress } from '@/common/utils/transaction-utils';
import {
  truncateStxAddress,
  truncateStxContractId,
  validateStacksContractId,
} from '@/common/utils/utils';
import { DefaultBadge, DefaultBadgeIcon, DefaultBadgeLabel } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StacksIconBlock from '@/ui/icons/StacksIconBlock';
import { Box, Flex, Icon, Stack, useClipboard } from '@chakra-ui/react';
import { ArrowRight, Copy, QrCode } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { forwardRef, useRef } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { QRcode2 } from './QRcode2';

const BORDER_WIDTH = 1;

const Badge = ({
  value,
  copyValue,
  copiedText,
}: {
  value: string;
  copyValue: string;
  copiedText: string;
}) => {
  const { copied, copy } = useClipboard({
    value: copyValue,
    timeout: 750,
  });

  return (
    <Tooltip content={copiedText || 'Copied!'} open={copied} variant="redesignPrimary">
      <Flex
        px={3}
        py={1.5}
        bg="surfacePrimary"
        _hover={{
          bg: 'surfaceFifth',
        }}
        borderRadius="redesign.md"
        alignItems="center"
        cursor="pointer"
        onClick={() => copy()}
      >
        <Text textStyle="text-regular-2xl" color="textPrimary" whiteSpace="nowrap">
          {value}
        </Text>
      </Flex>
    </Tooltip>
  );
};

const AddressBadge = ({ address }: { address: string }) => {
  const isContract = validateStacksContractId(address);
  return address ? (
    <Badge
      copyValue={address}
      value={isContract ? truncateStxContractId(address) : truncateStxAddress(address)}
      copiedText={`Address copied to clipboard`}
    />
  ) : null;
};

const FromToBadges = ({ tx }: { tx: Transaction | MempoolTransaction }) => {
  const toAddress = getToAddress(tx);
  return (
    <Flex gap={1} alignItems="center">
      <AddressBadge address={tx.sender_address} />
      {toAddress ? (
        <>
          <Icon h={6} w={3.5} color="iconTertiary">
            <ArrowRight weight="bold" />
          </Icon>
          <AddressBadge address={toAddress} />
        </>
      ) : null}
    </Flex>
  );
};

const AddressLabelBadge = () => {
  return (
    <DefaultBadge
      icon={<DefaultBadgeIcon icon={<StacksIconBlock color="black" />} />}
      label={<DefaultBadgeLabel label={'Address'} />}
    />
  );
};

const QRCodeBadge = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      onClick={() => dispatch(openModal(MODALS.QR_CODE))}
      variant="unstyled"
      borderRadius="redesign.md"
      bg="surfacePrimary"
      h="fit-content"
      w="fit-content"
      p={2.5}
    >
      <Icon h={3.5} w={3.5} color="iconPrimary">
        <QrCode weight="bold" />
      </Icon>
    </Button>
  );
};

const StacksAddressSpelledOut = ({ principal }: { principal: string }) => {
  const stacksAddressParts = splitStxAddressIntoParts(principal);
  const firstHalf = stacksAddressParts.slice(0, stacksAddressParts.length / 2);
  const secondHalf = stacksAddressParts.slice(stacksAddressParts.length / 2);

  return (
    <Stack>
      <Flex gap={3} alignItems="center">
        {firstHalf.map((part, index) => (
          <Text
            key={index}
            textStyle="text-regular-sm"
            whiteSpace="nowrap"
            fontFamily="matterMono"
            color={index % 2 === 0 ? 'textPrimary' : 'textSecondary'}
          >
            {part}
          </Text>
        ))}
      </Flex>
      <Flex gap={3} alignItems="center">
        {secondHalf.map((part, index) => (
          <Text
            key={index}
            textStyle="text-regular-sm"
            whiteSpace="nowrap"
            fontFamily="matterMono"
            color={index % 2 === 0 ? 'textPrimary' : 'textSecondary'}
          >
            {part}
          </Text>
        ))}
      </Flex>
    </Stack>
  );
};

const QRCodeModalBody = ({ principal }: { principal: string }) => {
  const { copied, copy } = useClipboard({
    value: principal,
    timeout: 750,
  });
  return (
    <Flex alignItems="center" justifyContent="center">
      <Stack alignItems="center" gap={8}>
        <Stack alignItems="center" gap={10}>
          <DoubleGradientBorderWrapper2 w="fit-content">
            <Flex p={7} alignItems="center" justifyContent="center" position="relative">
              <QRcode2 address={principal} size={115} showLogo={false} />
            </Flex>
          </DoubleGradientBorderWrapper2>
          <StacksAddressSpelledOut principal={principal} />
        </Stack>
        <Button variant="redesignTertiary" onClick={() => copy()} size="small" w="fit-content">
          <Flex alignItems="center" gap={1.5}>
            <Text textStyle="text-medium-md">Copy address</Text>
            <Icon h={3.5} w={3.5} color="iconSecondary">
              <Copy />
            </Icon>
          </Flex>
        </Button>
      </Stack>
    </Flex>
  );
};

const QRCodeModal = ({ principal }: { principal: string }) => {
  const modal = useOpenedModal();
  return (
    <RedesignModal
      open={modal === MODALS.QR_CODE}
      body={<QRCodeModalBody principal={principal} />}
    />
  );
};

export const AddressHeaderUnminimized = forwardRef<HTMLDivElement, { principal: string }>(
  ({ principal }, ref) => {
    return (
      <Flex
        bg={`linear-gradient(to bottom, var(--stacks-colors-border-primary), var(--stacks-colors-border-secondary))`}
        padding={`${BORDER_WIDTH}px`}
        borderRadius={`calc(var(--stacks-radii-redesign-xl) + ${BORDER_WIDTH}px)`}
        boxShadow="elevation2"
        ref={ref}
      >
        <Stack p={4} gap={3} w="full" borderRadius="redesign.xl" bg="surfaceSecondary">
          <AddressLabelBadge />
          <Flex gap={4} flexWrap="wrap">
            <Flex gap={2} flexWrap="wrap" alignItems="flex-end">
              <AddressBadge address={principal} />
              <QRCodeBadge />
              <QRCodeModal principal={principal} />
            </Flex>
          </Flex>
        </Stack>
      </Flex>
    );
  }
);

export const AddressHeaderMinimized = ({ principal }: { principal: string }) => {
  return (
    <Flex
      bg={`linear-gradient(to bottom, var(--stacks-colors-border-primary), var(--stacks-colors-border-secondary))`}
      padding={`${BORDER_WIDTH}px`}
      borderRadius={`calc(var(--stacks-radii-redesign-xl) + ${BORDER_WIDTH}px)`}
      boxShadow="elevation2"
    >
      <Flex
        p={2}
        gap={3}
        w="full"
        borderRadius="redesign.xl"
        bg="surfaceSecondary"
        alignItems="center"
      >
        <Flex gap={1} alignItems="center">
          <AddressLabelBadge />
          <AddressBadge address={principal} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const AddressHeader = ({ principal }: { principal: string }) => {
  const txHeaderRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useIsInViewport(txHeaderRef);

  return (
    <>
      <AddressHeaderUnminimized principal={principal} ref={txHeaderRef} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isHeaderInView ? 0 : 1,
          y: isHeaderInView ? -20 : 0,
          pointerEvents: isHeaderInView ? 'none' : 'auto',
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--stacks-z-index-docked)',
        }}
      >
        <Box borderRadius="redesign.xl" pt={3} px={6} bg="transparent">
          <AddressHeaderMinimized principal={principal} />
        </Box>
      </motion.div>
    </>
  );
};
