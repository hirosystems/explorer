import React, { useState, useEffect, useCallback } from 'react';
import { useEventListener } from '@blockstack/ui';
import { useControlledHover } from '@common/hooks/use-controlled-hover';
import { useFocus } from 'use-events';
import { UsePopoverProps } from '@components/popover/types';

export const usePopover = ({ length, triggerRef }: UsePopoverProps) => {
  const timeoutRef = React.useRef<number | undefined>(undefined);
  const removeFocusRef = React.useRef<number | undefined>(undefined);
  const [isVisible, setVisible] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [hoverDelay, setHoverDelay] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<number | undefined>(undefined);
  const [childIsInFocus, setChildFocus] = useState(false);
  const [wrapperFocus, bindWrapperFocus] = useFocus();

  const [localTriggerFocusState, setTriggerFocus] = useState(false);

  const isInFocus = localTriggerFocusState;

  const bindHover = useControlledHover(setHovered);

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
    if (triggerRefFocus && !localTriggerFocusState) {
      setTriggerFocus(true);
      setChildFocus(false);
      setCurrentFocus(undefined);
    }
    if (!triggerRefFocus && localTriggerFocusState) {
      setTriggerFocus(false);
    }
  }, [
    typeof document !== 'undefined' && document,
    typeof document !== 'undefined' && document?.activeElement,
    triggerRef,
    wrapperFocus,
  ]);

  // Hide and remove current focus of a child
  const hideImmediately = useCallback(() => {
    setVisible(false);
    setHovered(false);
    setCurrentFocus(undefined);
    setChildFocus(false);
    triggerRef?.current?.blur();
    handleHoverDelay();
  }, []);

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
      timeoutRef.current = setTimeout(() => {
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
      setCurrentFocus(0);
    } else if (currentFocus === 0) {
      setCurrentFocus(1);
    } else if (currentFocus && currentFocus > 0) {
      setCurrentFocus(currentFocus + 1);
    }
  }, [currentFocus]);

  const setPrevNumber = useCallback(() => {
    if (currentFocus === undefined) {
      return;
    }
    if (currentFocus === lastItem) {
      setCurrentFocus(currentFocus - 1);
    } else if (currentFocus === 0) {
      setCurrentFocus(length - 1);
    } else if (currentFocus && currentFocus <= length - 1) {
      setCurrentFocus(currentFocus - 1);
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
      if (isInFocus || (!hoverDelay && isHovered)) {
        setVisible(true);
      }
    } else {
      if (!childIsInFocus) {
        if (!isInFocus && !isHovered) {
          removeFocusRef.current = setTimeout(hideImmediately, 100);
        }
      } else {
        if (removeFocusRef.current) {
          clearTimeout(removeFocusRef.current);
        }
      }
    }
  }, [isVisible, isInFocus, isHovered, childIsInFocus]);

  const handleItemClick = (callback: () => void) => (e: any) => {
    e?.preventDefault();
    hideImmediately();
    callback && callback();
  };

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
      ...bindWrapperFocus,
    },
  };
};
