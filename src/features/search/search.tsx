import { SearchResultsCard } from '@/features/search/dropdown/search-results-card';
import { SearchBox } from '@/features/search/search-field/search-box';
import { Box, BoxProps } from '@/ui/components';

type Variant = 'default' | 'small';

export function SearchComponent({ variant, ...props }: BoxProps & { variant?: Variant }) {
  return (
    <Box position="relative" {...props}>
      <SearchBox variant={variant} />
      <SearchResultsCard />
    </Box>
  );
}
