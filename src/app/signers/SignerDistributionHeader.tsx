import { Flex } from '../../ui/Flex';
import { FormControl } from '../../ui/FormControl';
import { FormLabel } from '../../ui/FormLabel';
import { Switch } from '../../ui/Switch';
import { Text } from '../../ui/Text';

export function SignerDistributionHeader({
  signerTitle,
  setOnlyShowPublicSigners,
  onlyShowPublicSigners,
}: {
  signerTitle: string;
  setOnlyShowPublicSigners: (value: boolean) => void;
  onlyShowPublicSigners: boolean;
}) {
  return (
    <Flex
      direction={['column', 'column', 'row', 'row', 'row']}
      justifyContent="space-between"
      gap={4}
      height={['auto', 'auto', 6, 6, 6]}
      alignItems={['flex-start', 'flex-start', 'flex-start', 'center', 'center']}
    >
      <Text fontSize="xs" fontWeight="semibold">
        {signerTitle}
      </Text>
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
