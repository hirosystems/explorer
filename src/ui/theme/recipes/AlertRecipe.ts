// import { alertAnatomy } from '@ark-ui/react'; // not exported
import { defineSlotRecipe } from '@chakra-ui/react';

export const alertSlotRecipe = defineSlotRecipe({
  //   slots: alertAnatomy.keys(),
  slots: ['root', 'title', 'description', 'indicator', 'content'],
  className: 'chakra-alert',

  base: {
    root: {
      width: 'full',
      display: 'flex',
      alignItems: 'flex-start',
      position: 'relative',
      borderRadius: 'var(--stacks-radii-redesign-md)',
      px: 4,
      py: 3,
      bg: 'transparent', // override default bg
    },
    title: {
      fontStyle: 'text-medium-sm',
      color: 'textPrimary',
    },
    description: {
      display: 'inline',
      fontStyle: 'text-regular-xs',
      color: 'textPrimary',
    },
    indicator: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      width: '1em',
      height: '1em',
      _icon: { boxSize: 'full' },
    },
    content: {
      display: 'flex',
      flex: '1',
      gap: '1',
    },
  },

  variants: {
    status: {
      warning: {
        root: {
          backgroundColor: 'transactionStatus.pending',
        },
        indicator: {
          color: 'var(--stacks-colors-feedback-bronze-600)',
        },
      },
      error: {
        root: {
          backgroundColor: 'var(--stacks-colors-feedback-red-150)',
        },
        indicator: {
          color: 'iconError',
        },
      },
      neutral: {
        root: {
          backgroundColor: 'var(--stacks-colors-neutral-sand-150)',
        },
        indicator: {
          color: 'iconTertiary',
        },
      },
    },
  },
});
