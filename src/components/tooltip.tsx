import * as React from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';

export const Tooltip: React.FC<TippyProps & { label: TippyProps['content'] }> = ({
  label,
  'aria-label': ariaLabel = label,
  ...rest
}: any) => {
  return (
    <>
      <Tippy
        content={label}
        aria-label={ariaLabel}
        trigger="mouseenter"
        hideOnClick={undefined}
        {...rest}
      />
    </>
  );
};
