import React from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { useFocusWithin } from '@common/hooks/use-focus-within';

export function useRecoilFocus(
  atom: RecoilState<boolean>
): [boolean, any, { removeFocus: () => void }] {
  const [isFocused, setIsFocused] = useRecoilState(atom);

  const ref = React.useRef({
    isFocusWithin: false,
  });

  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setIsFocused,
    ref,
  });

  const removeFocus = () => {
    setIsFocused(false);
    ref.current.isFocusWithin = false;
  };

  return [isFocused, focusWithinProps, { removeFocus }];
}
