import { FocusEvent, HTMLAttributes, MutableRefObject } from 'react';

interface FocusWithinProps {
  /** Whether the focus within events should be disabled. */
  isDisabled?: boolean;
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: (e: FocusEvent) => void;
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: (e: FocusEvent) => void;
  /** Handler that is called when the the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
  ref: MutableRefObject<{ isFocusWithin: boolean }>;
}

interface FocusWithinResult {
  /** Props to spread onto the target element. */
  focusWithinProps: HTMLAttributes<HTMLElement>;
}

/**
 * Handles focus events for the target and its descendants.
 */
export function useFocusWithin(props: FocusWithinProps): FocusWithinResult {
  const state = props.ref.current;

  if (props.isDisabled) {
    return { focusWithinProps: {} };
  }

  const onFocus = (e: FocusEvent) => {
    if (!state.isFocusWithin) {
      if (props.onFocusWithin) {
        props.onFocusWithin(e);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(true);
      }

      state.isFocusWithin = true;
    }
  };

  const onBlur = (e: FocusEvent) => {
    // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
    // when moving focus inside the element. Only trigger if the currentTarget doesn't
    // include the relatedTarget (where focus is moving).
    if (state.isFocusWithin && !e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
      if (props.onBlurWithin) {
        props.onBlurWithin(e);
      }

      if (props.onFocusWithinChange) {
        props.onFocusWithinChange(false);
      }

      state.isFocusWithin = false;
    }
  };

  return {
    focusWithinProps: {
      onFocus: onFocus,
      onBlur: onBlur,
    },
  };
}
