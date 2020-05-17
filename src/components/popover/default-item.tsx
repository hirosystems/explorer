import React, { useEffect } from 'react';
import { Box } from '@blockstack/ui';
import { useFocus } from 'use-events';
import { Text } from '@components/typography';

export const PopoverItem = ({
  children,
  onFocus,
  onBlur,
  option,
  onClick,
  focused,
  active,
  placement,
  ...rest
}: any) => {
  const [localFocus, setLocalFocus] = React.useState<boolean>(false);

  const [focus, focusBind] = useFocus();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleFocus = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onFocus(e);
    focusBind.onFocus(e as any);
  };

  const handleBlur = (e?: React.FocusEvent) => {
    e?.preventDefault();
    onBlur(e);
    focusBind.onBlur(e as any);
  };

  useEffect(() => {
    if (focused && ref.current) {
      setLocalFocus(true);
      ref.current.focus();
      handleFocus();
    }
    if (!focused && localFocus && ref.current) {
      setLocalFocus(false);
      ref.current.blur();
      handleBlur();
    }
  }, [focused, ref]);

  return (
    <Box
      py="tight"
      px="base"
      bg={focus ? 'var(--colors-bg-alt)' : 'var(--colors-bg-light)'}
      _hover={{ cursor: 'pointer', bg: 'var(--colors-bg-alt)' }}
      role="listitem"
      tabIndex={0}
      outline="none"
      onKeyPress={e => {
        if (e.key === 'Enter') {
          onClick(e);
        }
      }}
      {...rest}
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={ref}
      textAlign={placement === 'right' ? 'right' : 'left'}
    >
      <Text fontSize="14px" color={active ? 'var(--colors-accent)' : 'var(--colors-text-body)'}>
        {option.label}
      </Text>
    </Box>
  );
};
