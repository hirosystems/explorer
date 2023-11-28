import { Grid, GridProps } from '../../../ui/Grid';

export function Wrapper(props: GridProps) {
  return (
    <Grid
      gridColumnGap="32px"
      gridTemplateColumns={['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)']}
      gridRowGap={['32px', '32px', 'unset']}
      maxWidth="100%"
      alignItems="flex-start"
      {...props}
    />
  );
}
