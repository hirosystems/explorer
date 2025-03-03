import { tabsAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@chakra-ui/react';

export const tabsSlotRecipe = defineSlotRecipe({
  slots: tabsAnatomy.keys(),
  className: 'stacks-tabs',
  base: {
    root: {
      minWidth: 0,
    },
    list: {
      py: 6,
    },
    content: {},
    trigger: {
      color: '{colors.slate.700}',
      borderRadius: 'lg',
      fontSize: 'md',
      fontWeight: 'semibold',
      border: 'none',
      '--indicator-color': 'transparent !important',
      _selected: {
        bg: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
        color: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
      },
    },
  },

  variants: {
    size: {
      sm: {
        list: {
          gap: '1',
        },
        trigger: {
          py: '1',
          px: '2',
          fontSize: 'xs',
          borderRadius: 'redesign.sm',
          fontWeight: 'medium',
          _selected: {
            boxShadow: '{shadows.elevation2}',
          },
        },
      },
      md: {
        trigger: {
          py: '1',
          px: '3',
          fontSize: 'sm',
          borderRadius: 'redesign.md',
          fontWeight: 'medium',
        },
      },
      lg: {
        trigger: {
          py: '1',
          px: '3',
          fontSize: 'xl',
          borderRadius: 'redesign.md',
          fontWeight: 'regular',
        },
      },
      xlg: {
        trigger: {
          py: '1.5',
          px: '4',
          fontSize: '2xl',
          borderRadius: 'redesign.lg',
          fontWeight: 'regular',
        },
      },
      xxlg: {
        trigger: {
          py: '1.5',
          px: '4',
          fontSize: '3.5xl',
          borderRadius: 'redesign.lg',
          fontWeight: 'regular',
        },
      },
    },

    variant: {
      primary: {
        root: {
          minWidth: 0,
          position: 'relative',
          _horizontal: {
            display: 'block',
          },
          _vertical: {
            display: 'flex',
          },
        },
        list: {
          display: 'inline-flex',
          position: 'relative',
          isolation: 'isolate',
          _horizontal: {
            flexDirection: 'row',
          },
          _vertical: {
            flexDirection: 'column',
          },
        },
        trigger: {
          outline: '0',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'medium',
          position: 'relative',
          cursor: 'button',
          color: 'textSecondary',
          fontFamily: 'var(--font-instrument-sans)',
          _disabled: {
            cursor: 'not-allowed',
            _active: { bg: 'initial' },
          },
          _selected: {
            color: 'textInvert',
            background: 'surfaceInvert',
          },
        },
        content: {
          focusVisibleRing: 'inside',
          _horizontal: {
            width: '100%',
          },
          _vertical: {
            height: '100%',
          },
        },
        indicator: {
          zIndex: -1,
        },
      },
    },
  },

  defaultVariants: {},
});
