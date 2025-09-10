import { useIsInViewport } from '@/common/hooks/useIsInViewport';
import { getToAddress } from '@/common/utils/transaction-utils';
import { getTxTitle, getTxTypeColor } from '@/common/utils/transactions';
import {
  truncateStxAddress,
  truncateStxContractId,
  validateStacksContractId,
} from '@/common/utils/utils';
import {
  DefaultBadge,
  DefaultBadgeIcon,
  DefaultBadgeLabel,
  TransactionStatusBadge,
  TransactionTypeBadge,
} from '@/ui/Badge';
import { IconButtonBaseRedesign } from '@/ui/IconButton';
import { RedesignModal } from '@/ui/RedesignModal';
import { Text } from '@/ui/Text';
import { Tooltip } from '@/ui/Tooltip';
import StacksIconBlock from '@/ui/icons/StacksIconBlock';
import { Flex, Icon, Stack, useClipboard } from '@chakra-ui/react';
import { ArrowRight, QrCode } from '@phosphor-icons/react';
import { forwardRef, useRef, useState } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

import { QRcode } from '../StxBalance/QRcode';
import { DoubleGradientBorderWrapper2 } from '@/common/components/DoubleGradientBorderWrapper2';

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
        py={1}
        bg="surfacePrimary"
        _hover={{
          bg: 'surfaceFifth',
        }}
        borderRadius="redesign.md"
        alignItems="center"
        cursor="pointer"
        onClick={() => copy()}
      >
        <Text textStyle="text-medium-md" whiteSpace="nowrap">
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
      icon={<DefaultBadgeIcon icon={<StacksIconBlock />} />}
      label={<DefaultBadgeLabel label={'Address'} />}
    />
  );
};

const QRCodeBadge = ({
  principal,
  qrShowing,
  toggleViewQrCode,
}: {
  principal: string;
  qrShowing: boolean;
  toggleViewQrCode: () => void;
}) => {
  return (
    <IconButtonBaseRedesign
      onClick={toggleViewQrCode}
      h={3}
      w={3}
      color="iconPrimary"
      p={2.5}
      bg="surfacePrimary"
      borderRadius="redesign.md"
      variant="redesignPrimary"
    >
      <QrCode weight="bold" />
    </IconButtonBaseRedesign>
  );
};

const QRCodeModalBody = ({ principal }: { principal: string }) => {
  return (
    <Flex>
      <DoubleGradientBorderWrapper2 w="fit-content">
        <QRcode address={principal} />
      </DoubleGradientBorderWrapper2>
    </Flex>
  );
};

const QRCodeModal = ({
  qrShowing,
  toggleViewQrCode,
  principal,
}: {
  qrShowing: boolean;
  toggleViewQrCode: () => void;
  principal: string;
}) => {
  return <RedesignModal open={qrShowing} body={<QRCodeModalBody principal={principal} />} />;
};

export const AddressHeaderUnminimized = forwardRef<
  HTMLDivElement,
  { principal: string; qrShowing: boolean; toggleViewQrCode: () => void }
>(({ principal, qrShowing, toggleViewQrCode }, ref) => {
  return (
    <Flex
      bg={`linear-gradient(to bottom, orange, var(--stacks-colors-surface-primary))`}
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
            <QRCodeBadge
              principal={principal}
              qrShowing={qrShowing}
              toggleViewQrCode={toggleViewQrCode}
            />
            <QRCodeModal
              qrShowing={qrShowing}
              toggleViewQrCode={toggleViewQrCode}
              principal={principal}
            />
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
});

export const AddressHeaderMinimized = ({ principal }: { principal: string }) => {
  return (
    <Flex
      bg={`linear-gradient(to bottom, ${getTxTypeColor(tx.tx_type)}, var(--stacks-colors-surface-primary))`}
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
          <TransactionTypeBadge tx={tx} withoutLabel />
          <TransactionStatusBadge tx={tx} withoutLabel />
        </Flex>
        <Flex gap={3} alignItems="center">
          <Text textStyle="text-medium-md">{getTxTitle(tx)}</Text>
          <Flex alignItems="center" gap={2} hideBelow="md">
            <TxIdBadge tx={tx} />
            <FromToBadges tx={tx} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const AddressHeader = ({ principal }: { principal: string }) => {
  const txHeaderRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useIsInViewport(txHeaderRef);

  const [qrShowing, setQrShowing] = useState(false);
  const toggleViewQrCode = () => setQrShowing(v => !v);

  return (
    <>
      <AddressHeaderUnminimized
        principal={principal}
        ref={txHeaderRef}
        qrShowing={qrShowing}
        toggleViewQrCode={toggleViewQrCode}
      />
      {/* <motion.div
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
      </motion.div> */}
    </>
  );
};
