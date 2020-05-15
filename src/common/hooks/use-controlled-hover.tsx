import React from 'react';

export function useControlledHover(
  setter: (state: boolean) => void,
  pause?: boolean
): {
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
} {
  const bind = React.useMemo(
    () => ({
      onMouseEnter: (e: React.MouseEvent) => (!pause ? setter(true) : null),
      onMouseLeave: (e: React.MouseEvent) => (!pause ? setter(false) : null),
    }),
    [pause]
  );

  return bind;
}
