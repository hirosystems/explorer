import { VerticalPoxCycleDiagram } from './VerticalPoxCycleDiagram';
import { HorizontalPoxCycleDiagram } from './horizontal-pox-cycle-diagram/HorizontalPoxCycleDiagram';
import { usePoxCycle } from './usePoxCycle';

export const PoxCycleDiagram = () => {
  const poxCycleData = usePoxCycle();

  return (
    <>
      <HorizontalPoxCycleDiagram data={poxCycleData} hideBelow="lg" />
      <VerticalPoxCycleDiagram data={poxCycleData} hideFrom="lg" />
    </>
  );
};
