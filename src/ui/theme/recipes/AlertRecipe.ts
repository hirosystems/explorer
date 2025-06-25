// import { alertAnatomy } from '@ark-ui/react';
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
      borderRadius: 'l3',
      px: '4',
      py: '3',
    },
    title: {
      fontWeight: 'medium',
    },
    description: {
      display: 'inline',
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
      info: {
        root: { colorPalette: 'neutral.sand-150' },
      },
      warning: {
        root: { colorPalette: 'orange' },
      },
      success: {
        root: { colorPalette: 'green' },
      },
      error: {
        root: { colorPalette: 'red' },
      },
      neutral: {
        // root: { colorPalette: 'var(--stacks-colors-neutral-sand-150)' },
        root: {
          backgroundColor: 'var(--stacks-colors-neutral-sand-150)',
          bg: 'var(--stacks-colors-neutral-sand-150)',
          borderRadius: 'var(--stacks-radii-redesign-md)',
          border: '1px solid red',
        },
      },
    },

    inline: {
      true: {
        content: {
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
      },
      false: {
        content: {
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },

    // variant: {
    //   subtle: {
    //     root: {
    //       bg: 'colorPalette.subtle',
    //       color: 'colorPalette.fg',
    //     },
    //   },

    //   surface: {
    //     root: {
    //       bg: 'colorPalette.subtle',
    //       color: 'colorPalette.fg',
    //       shadow: 'inset 0 0 0px 1px var(--shadow-color)',
    //       shadowColor: 'colorPalette.muted',
    //     },
    //     indicator: {
    //       color: 'colorPalette.fg',
    //     },
    //   },

    //   outline: {
    //     root: {
    //       color: 'colorPalette.fg',
    //       shadow: 'inset 0 0 0px 1px var(--shadow-color)',
    //       shadowColor: 'colorPalette.muted',
    //     },
    //     indicator: {
    //       color: 'colorPalette.fg',
    //     },
    //   },

    //   solid: {
    //     root: {
    //       bg: 'colorPalette.solid',
    //       color: 'colorPalette.contrast',
    //     },
    //     indicator: {
    //       color: 'colorPalette.contrast',
    //     },
    //   },
    // },

    //     size: {
    //       sm: {
    //         root: {
    //           gap: '2',
    //           px: '3',
    //           py: '3',
    //           textStyle: 'xs',
    //         },
    //         indicator: {
    //           textStyle: 'lg',
    //         },
    //       },
    //       md: {
    //         root: {
    //           gap: '3',
    //           px: '4',
    //           py: '4',
    //           textStyle: 'sm',
    //         },
    //         indicator: {
    //           textStyle: 'xl',
    //         },
    //       },
    //       lg: {
    //         root: {
    //           gap: '3',
    //           px: '4',
    //           py: '4',
    //           textStyle: 'md',
    //         },
    //         indicator: {
    //           textStyle: '2xl',
    //         },
    //       },
    //     },
  },

  // defaultVariants: {
  //   status: 'info',
  //   // variant: 'subtle',
  //   inline: false,
  // },
});
