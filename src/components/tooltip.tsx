import * as React from 'react';
import { Portal } from '@blockstack/ui';
// import { Tooltip as TooltipBase, TooltipProps } from '@blockstack/ui';
import BaseTooltip, { useTooltip, TooltipPopup } from '@reach/tooltip';

const centered = (triggerRect: any, tooltipRect: any) => {
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const left = triggerCenter - tooltipRect.width / 2;
  const maxLeft = window.innerWidth - tooltipRect.width - 2;
  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + 8 + window.scrollY,
  };
};
export function Tooltip({ children, label, 'aria-label': ariaLabel }: any) {
  // get the props from useTooltip
  const [trigger, tooltip] = useTooltip();

  // destructure off what we need to position the triangle
  const { isVisible, triggerRect } = tooltip;

  const { onMouseDown, ...triggerProps } = trigger;
  return (
    <>
      {React.cloneElement(children, triggerProps)}
      {isVisible && (
        // The Triangle. We position it relative to the trigger, not the popup
        // so that collisions don't have a triangle pointing off to nowhere.
        // Using a Portal may seem a little extreme, but we can keep the
        // positioning logic simpler here instead of needing to consider
        // the popup's position relative to the trigger and collisions
        <Portal>
          <div
            style={{
              position: 'absolute',
              left: triggerRect ? triggerRect.left - 10 + triggerRect.width / 2 : 'unset',
              top: triggerRect ? triggerRect.bottom + window.scrollY : 'unset',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid black',
            }}
          />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={label}
        aria-label={ariaLabel}
        style={{
          position: 'absolute',
          background: 'var(--colors-invert)',
          color: 'var(--colors-bg)',
          border: 'none',
          borderRadius: '3px',
          padding: '0.5em 1em',
          fontSize: '12px',
        }}
        position={centered}
      />
    </>
  );
}
