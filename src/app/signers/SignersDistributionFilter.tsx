import { FormControl } from '@/ui/FormControl';
import { FormLabel } from '@/ui/FormLabel';
import { Switch } from '@/ui/Switch';

export function SignersDistributionFilter({
  onlyShowPublicSigners,
  setOnlyShowPublicSigners,
}: {
  onlyShowPublicSigners: boolean;
  setOnlyShowPublicSigners: (value: boolean) => void;
}) {
  return (
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
  );
}
