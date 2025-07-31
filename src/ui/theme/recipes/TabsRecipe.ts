import { tabsAnatomy } from '@ark-ui/react';
import { defineSlotRecipe } from '@chakra-ui/react';

export const tabsSlotRecipe = defineSlotRecipe({
  slots: [...tabsAnatomy.keys(), 'label'],
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
    label: {
      textStyle: 'text-regular-sm',
      color: 'textSecondary',
      mr: '2',
    },
  },

  variants: {
    size: {
      redesignSm: {
        trigger: {
          py: '1',
          px: '2',
          textStyle: 'text-medium-xs',
          borderRadius: 'redesign.sm',
        },
        label: {
          lineHeight: 'comfortable',
        },
      },
      redesignMd: {
        trigger: {
          py: '1',
          px: '3',
          textStyle: 'text-medium-sm',
          borderRadius: 'redesign.md',
        },
        label: {
          lineHeight: 'comfortable',
        },
      },
      redesignLg: {
        trigger: {
          py: '1',
          px: '3',
          textStyle: 'heading-xs',
          borderRadius: 'redesign.md',
        },
        label: {
          lineHeight: 'spacious',
        },
      },
      redesignXl: {
        trigger: {
          py: '1.5',
          px: '4',
          textStyle: 'heading-sm',
          borderRadius: 'redesign.lg',
        },
        label: {
          lineHeight: 'base',
        },
      },
      redesign2xl: {
        trigger: {
          py: '1.5',
          px: '4',
          textStyle: 'heading-md',
          borderRadius: 'redesign.lg',
        },
        label: {
          lineHeight: 'base',
        },
      },
    },

    variant: {
      primary: {
        root: {
          minWidth: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        },
        list: {
          display: 'inline-flex',
          position: 'relative',
          isolation: 'isolate',
          p: '0',
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
          whiteSpace: 'nowrap',
          _disabled: {
            cursor: 'not-allowed',
            _active: { bg: 'initial' },
          },
          _selected: {
            color: 'textPrimary',
            background: 'surfacePrimary',
          },
          _hover: {
            '&:not([data-selected]):hover': {
              background: 'surfaceTertiary',
              color: 'textPrimary',
            },
          },
        },
        content: {
          focusVisibleRing: 'inside',
          _horizontal: {
            flex: '0 0 100%',
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
      icons: {
        root: {
          minWidth: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        },
        list: {
          gap: '1',
          padding: '1',
          borderRadius: 'redesign.md',
          border: '1px solid var(--stacks-colors-border-secondary)',
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
          lineHeight: '0',
          borderRadius: 'redesign.sm',
          cursor: 'button',
          whiteSpace: 'nowrap',
          _selected: {
            color: 'textInvert',
            background: 'surfaceInvert',
            boxShadow: '{shadows.elevation2}',
          },
          _hover: {
            '&:not([data-selected]):hover': {
              background: 'surfaceTertiary',
              color: 'textPrimary',
            },
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
      redesignPrimary: {
        root: {},
        list: {
          display: 'inline-flex',
          position: 'relative',
          isolation: 'isolate',
          p: '0',
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
          fontFamily: 'var(--font-matter-mono)',
          whiteSpace: 'nowrap',
          _disabled: {
            cursor: 'not-allowed',
            _active: { bg: 'initial' },
          },
          _selected: {
            color: 'textInvert',
            background: 'surfaceInvert',
          },
          _hover: {
            '&:not([data-selected]):hover': {
              background: 'surfaceTertiary',
              color: 'textPrimary',
            },
          },
        },
        content: {
          focusVisibleRing: 'inside',
          _horizontal: {
            flex: '0 0 100%',
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
  compoundVariants: [
    {
      size: 'redesignMd',
      variant: 'icons',
      css: {
        trigger: {
          py: '1',
          px: '2',
        },
      },
    },
  ],

  defaultVariants: {},
});
