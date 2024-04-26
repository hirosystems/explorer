import { useBreakpointValue } from '../../../ui/hooks/useBreakpointValue';

export function useIsDesktop() {
  return useBreakpointValue({ base: false, lg: true });
}
