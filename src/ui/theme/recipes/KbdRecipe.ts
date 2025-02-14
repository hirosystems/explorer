import { defineRecipe } from '@chakra-ui/react';

export const kbdRecipe = defineRecipe({
  base: {
    fontSize: 'sm',
    pl: 1.5,
    pr: 2,
    py: 1,
    borderRadius: 'redesign.md',
    background: 'surfacePrimary',
    color: 'var(--stacks-colors-neutral-sand-400)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    lineHeight: '1',
  },
});
