import { Field as CUIField, Fieldset } from '@chakra-ui/react';

import { Switch } from '../../ui/Switch';

export function SignersDistributionFilter({
  onlyShowPublicSigners,
  setOnlyShowPublicSigners,
}: {
  onlyShowPublicSigners: boolean;
  setOnlyShowPublicSigners: (value: boolean) => void;
}) {
  return (// TODO: upgrade to v3. This may be broken
    <Fieldset.Root display="flex" alignItems="center" gap={3} width="fit-content">
      <CUIField.Root></CUIField.Root>
      <Switch
        id="only-show-public-signers"
        onChange={() => {
          setOnlyShowPublicSigners(!onlyShowPublicSigners);
        }}
        checked={onlyShowPublicSigners}
      />
      <CUIField.Root>
        <CUIField.Label
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
        </CUIField.Label>
      </CUIField.Root>
    </Fieldset.Root>
  );
}
