import { useMemo } from 'react';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Stack } from '../../ui/Stack';
import { Text, TextProps } from '../../ui/Text';
import { getSignerDistributionPieChartColor } from './SignerDistributionPieChart';
import { SignerInfo } from './data/useSigners';
import { getSignerKeyName } from './utils';

export function SignerLegendItem({
  signerName,
  signerVotingPower,
  ...rest
}: {
  signerName: string;
  signerVotingPower: number;
} & TextProps) {
  return (
    <Flex justifyContent="space-between" gap={2}>
      <Flex direction="row" gap={2} alignItems="center">
        <Box
          height={2}
          width={2}
          borderRadius="50%"
          backgroundColor={getSignerDistributionPieChartColor(signerVotingPower, 'light')}
        />
        <Text fontSize="sm" {...rest}>
          {signerName}
        </Text>
      </Flex>
      <Text fontSize="sm" fontWeight="semibold" {...rest}>
        {signerVotingPower.toFixed(2)}%
      </Text>
    </Flex>
  );
}

export function SignersDistributionLegend({
  signers,
  onlyShowPublicSigners,
}: {
  signers: SignerInfo[];
  onlyShowPublicSigners: boolean;
}) {
  const knownSigners = useMemo(
    () =>
      signers
        .filter(signer => getSignerKeyName(signer.signing_key) !== 'unknown')
        .map(signer => ({
          value: signer.weight_percent,
          name: getSignerKeyName(signer.signing_key),
        })),
    [signers]
  );
  const unknownSigners = useMemo(
    () =>
      signers
        .filter(signer => getSignerKeyName(signer.signing_key) === 'unknown')
        .reduce((acc, signer) => acc + signer.weight_percent, 0),
    [signers]
  );

  const filiteredSigners = onlyShowPublicSigners
    ? knownSigners
    : knownSigners
        .concat({ name: 'Private signers', value: unknownSigners })
        .sort((a, b) => b.value - a.value);

  return (
    <Stack gap={2} width='100%'>
      {filiteredSigners.map(signer => (
        <SignerLegendItem
          key={signer.name}
          signerName={signer.name}
          signerVotingPower={signer.value}
        />
      ))}
    </Stack>
  );
}
