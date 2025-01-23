import { defineSlotRecipe } from '@chakra-ui/react';

export const dialogSlotRecipe = defineSlotRecipe({
  slots: [
    'header',
    'body',
    'footer',
    'backdrop',
    'title',
    'content',
    'trigger',
    'positioner',
    'description',
    'closeTrigger',
  ],
  className: 'chakra-dialog',
  base: {},
  variants: {
    variant: {
      redesignPrimary: {
        header: {
          p: 0,
          mb: 3,
        },
        content: {
          borderRadius: 'redesign.xl',
          boxShadow: '{shadows.elevation2}',
          py: 5,
          px: 6,
          bg: 'surfaceTertiary',
        },
        body: {
          p: 0,
        },
        backdrop: {
          backdropFilter: 'blur(4px)',
          bg: {
            _light: 'black.alpha.200',
            _dark: 'black.alpha.500',
          },
        },
      },
    },
  },
  defaultVariants: {},
});
