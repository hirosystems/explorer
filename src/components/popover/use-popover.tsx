import React, { useState, useEffect, useCallback } from 'react';
import { useEventListener } from '@stacks/ui';
import { useControlledHover } from '@common/hooks/use-controlled-hover';
import { useFocus } from 'use-events';
import { UsePopoverProps } from '@components/popover/types';
import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { useClickOutside } from 'use-events';

export const usePopover = ({
  length,
  triggerRef,
  showOnClickOrFocus,
  lockBodyScroll,
  wrapperRef,
}: UsePopoverProps) => {
  const timeoutRef = React.useRef<number | null>(null);
  const removeFocusRef = React.useRef<number | null>(null);

  const [isVisible, setVisible] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [hoverDelay, setHoverDelay] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<number | undefined>(undefined);
  const [childIsInFocus, setChildFocus] = useState(false);
  const [localTriggerFocusState, setTriggerFocus] = useState(false);
  const [wrapperFocus, bindWrapperFocus] = useFocus();
  const bindHover = useControlledHover(setHovered);

  const isInFocus = localTriggerFocusState || wrapperFocus;

  if (lockBodyScroll) {
    useLockBodyScroll(isVisible);
  }

  const handleHoverDelay = () => {
    if (!hoverDelay) {
      setHoverDelay(true);
      setTimeout(() => {
        setHoverDelay(false);
      }, 180);
    }
  };

  useEffect(() => {
    const triggerRefFocus =
      triggerRef?.current === (typeof document !== 'undefined' && document?.activeElement);
    if ((triggerRefFocus && !localTriggerFocusState) || (wrapperFocus && !localTriggerFocusState)) {
      setTriggerFocus(true);
      setChildFocus(false);
      setCurrentFocus(undefined);
    }
    if ((!triggerRefFocus && localTriggerFocusState) || (!wrapperFocus && localTriggerFocusState)) {
      setTriggerFocus(false);
    }
  }, [
    typeof document !== 'undefined' && document,
    typeof document !== 'undefined' && document?.activeElement,
    triggerRef,
    wrapperFocus,
  ]);

  // Hide and remove current focus of a child
  const hideImmediately = () => {
    triggerRef?.current?.blur();
    setCurrentFocus(undefined);
    setVisible(false);
    setHovered(false);
    setChildFocus(false);
    handleHoverDelay();
  };

  // Set childFocus to true, and set the key of child that is focused
  const handleChildFocus = useCallback(
    (key: number) => () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      setChildFocus(true);
      setCurrentFocus(key);
    },
    []
  );

  // if we are on the last child, and other child hasn't canceled the timout, we will remove childFocus
  const handleChildBlur = useCallback(
    (isLast: boolean, key: number) => () => {
      timeoutRef.current = window.setTimeout(() => {
        if (isLast && currentFocus === key) {
          setChildFocus(false);
          setCurrentFocus(undefined);
        }
      }, 50);
    },
    [currentFocus]
  );

  const lastItem = length - 1;

  const setNextNumber = useCallback(() => {
    if (currentFocus === undefined) {
      setCurrentFocus(0);
    }
    if (currentFocus === lastItem) {
      if (length === 1) {
        return setCurrentFocus(undefined);
      }
      return setCurrentFocus(0);
    } else if (currentFocus === 0) {
      return setCurrentFocus(1);
    } else if (currentFocus && currentFocus > 0) {
      return setCurrentFocus(currentFocus + 1);
    }
  }, [currentFocus]);

  const setPrevNumber = useCallback(() => {
    if (currentFocus === undefined) {
      return setCurrentFocus(lastItem);
    }
    if (currentFocus === lastItem) {
      if (length === 1) {
        return setCurrentFocus(undefined);
      }
      return setCurrentFocus(currentFocus - 1);
    } else if (currentFocus === 0) {
      return setCurrentFocus(length - 1);
    } else if (currentFocus && currentFocus <= length - 1) {
      return setCurrentFocus(currentFocus - 1);
    }
  }, [currentFocus]);

  const handleKeyDown = useCallback(
    e => {
      if (isVisible && e.key === 'Escape') {
        hideImmediately();
      }
      if (isVisible || isInFocus) {
        if (e.keyCode === 40) {
          // down arrow
          e.preventDefault();
          if (!isVisible) {
            setVisible(true);
          }
          setNextNumber();
        } else if (e.keyCode === 38) {
          // up arrow
          e.preventDefault();
          if (!isVisible) {
            setVisible(true);
          }
          setPrevNumber();
        }
      }
    },
    [isVisible, isInFocus, currentFocus]
  );

  useEventListener('keydown', handleKeyDown);

  useEffect(() => {
    if (!isVisible) {
      if (isInFocus || (!showOnClickOrFocus && isHovered)) {
        setVisible(true);
      }
    } else {
      if (
        (!isInFocus && !showOnClickOrFocus && !isHovered) ||
        (!showOnClickOrFocus && !isHovered)
      ) {
        removeFocusRef.current = window.setTimeout(hideImmediately, 100);
      } else if (!childIsInFocus) {
        if (!isInFocus && !isHovered) {
          removeFocusRef.current = window.setTimeout(hideImmediately, 100);
        }
      } else {
        if (removeFocusRef.current) {
          clearTimeout(removeFocusRef.current);
        }
      }
    }
  }, [isVisible, isInFocus, isHovered, showOnClickOrFocus, childIsInFocus]);

  const handleItemClick = (callback: () => void) => (e: any) => {
    e?.preventDefault();
    hideImmediately();
    callback && callback();
  };

  const triggerOnclick = showOnClickOrFocus
    ? {
        onClick: () => {
          triggerRef?.current?.focus?.();
        },
      }
    : {};

  useClickOutside([wrapperRef], () => hideImmediately());

  return {
    isVisible,
    bindHover,
    handleChildFocus,
    handleChildBlur,
    setVisible,
    currentFocus,
    setCurrentFocus,
    hideImmediately,
    handleItemClick,
    triggerProps: {
      ...triggerOnclick,
      ...bindWrapperFocus,
    },
    wrapper: {
      pointerEvents: hoverDelay ? 'none' : 'all',
    },
  };
};
