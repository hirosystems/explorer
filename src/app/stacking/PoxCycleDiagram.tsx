import { useBreakpointValue } from '../../ui/hooks/useBreakpointValue';
import { VerticalPoxCycleDiagram } from './VerticalPoxCycleDiagram';
import { HorizontalPoxCycleDiagram } from './horizontal-pox-cycle-diagram/HorizontalPoxCycleDiagram';
import { usePoxCycle } from './usePoxCycle';

export const PoxCycleDiagram = () => {
  const poxCycleData = usePoxCycle();

  const poxCycleDiagram = useBreakpointValue(
    {
      lg: <HorizontalPoxCycleDiagram data={poxCycleData} />,
      md: <VerticalPoxCycleDiagram data={poxCycleData} />,
      sm: <VerticalPoxCycleDiagram data={poxCycleData} />,
      xs: <VerticalPoxCycleDiagram data={poxCycleData} />,
      base: <VerticalPoxCycleDiagram data={poxCycleData} />,
    },
    {
      fallback: 'lg',
      ssr: false,
    }
  );

  return poxCycleDiagram ?? null;
};
