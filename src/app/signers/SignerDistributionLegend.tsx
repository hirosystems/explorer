import { ReactNode, useMemo } from 'react';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Stack } from '../../ui/Stack';
import { Text, TextProps } from '../../ui/Text';
import { useColorMode } from '../../ui/hooks/useColorMode';
import { getSignerDistributionPieChartColor } from './SignerDistributionPieChart';
import { PoxSigner } from './data/useSigners';
import { getSignerKeyName } from './utils';

export function SignerLegendItem({
  signerName,
  signerVotingPower,
  isKnownSigner = true,
  ...rest
}: {
  signerName: string | ReactNode;
  signerVotingPower: number | ReactNode;
  isKnownSigner?: boolean;
} & TextProps) {
  const colorMode = useColorMode();
  return (
    <Flex justifyContent="space-between" gap={2}>
      <Flex direction="row" gap={2} alignItems="center">
        <Box
          height={2}
          width={2}
          borderRadius="50%"
          backgroundColor={
            typeof signerVotingPower === 'number'
              ? getSignerDistributionPieChartColor(
                  isKnownSigner,
                  signerVotingPower,
                  colorMode.colorMode
                )
              : 'textSubdued'
          }
        />
        {typeof signerName === 'string' ? (
          <Text fontSize="sm" {...rest}>
            {signerName}
          </Text>
        ) : (
          signerName
        )}
      </Flex>
      {typeof signerVotingPower === 'number' ? (
        <Text fontSize="sm" fontWeight="semibold" {...rest}>
          {signerVotingPower.toFixed(2)}%
        </Text>
      ) : (
        signerVotingPower
      )}
    </Flex>
  );
}

export function removeStackingDaoFromName(name: string) {
  let newName = name;
  if (name.includes('(StackingDAO)')) {
    newName = newName.replace('(StackingDAO)', '');
    newName = newName.trim();
    newName = newName + '*';
  }
  return newName;
}

export function SignersDistributionLegendLayout({
  signersLegendItems,
  footNotes,
}: {
  signersLegendItems: ReactNode;
  footNotes?: ReactNode;
}) {
  return (
    <Stack height="100%" gap={6}>
      <Stack flex="1" minHeight={0} gap={2} justifyContent="center">
        {signersLegendItems}
      </Stack>
      {footNotes ? <Box>{footNotes}</Box> : null}
    </Stack>
  );
}

export function SignersDistributionLegend({
  signers,
  onlyShowPublicSigners,
}: {
  signers: PoxSigner[];
  onlyShowPublicSigners: boolean;
}) {
  const knownSigners = useMemo(
    () =>
      signers
        .filter(signer => getSignerKeyName(signer.signing_key) !== 'unknown')
        .map(signer => {
          let name = getSignerKeyName(signer.signing_key);
          let nameWithoutStackingDao = removeStackingDaoFromName(name);

          return {
            value: signer.weight_percent,
            name: nameWithoutStackingDao,
          };
        })
        .reduce(
          (acc, curr) => {
            const existingSigner = acc.find(s => s.name === curr.name);
            if (existingSigner) {
              existingSigner.value += curr.value;
              return acc;
            }
            return [...acc, curr];
          },
          [] as { name: string; value: number }[]
        ),
    [signers]
  );
  const unknownSigners = useMemo(
    () => signers.filter(signer => getSignerKeyName(signer.signing_key) === 'unknown'),
    [signers]
  );

  const filteredSigners = onlyShowPublicSigners
    ? knownSigners
    : knownSigners
        .concat({
          name: `Other signers (${unknownSigners.length})`,
          value: unknownSigners.reduce((acc, signer) => acc + signer.weight_percent, 0),
        })
        .sort((a, b) => b.value - a.value);

  return (
    <SignersDistributionLegendLayout
      signersLegendItems={
        <>
          {filteredSigners.map((signer, index) => (
            <SignerLegendItem
              key={index}
              signerName={signer.name}
              signerVotingPower={signer.value}
              isKnownSigner={!signer.name.includes(`Other signers`)}
            />
          ))}
        </>
      }
      footNotes={
        <Text fontSize="medium" color="textSubdued">
          *Stacking DAO pool
        </Text>
      }
    />
  );
}
