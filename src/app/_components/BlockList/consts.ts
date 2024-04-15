export const FADE_DURATION = 700;
export const BURN_BLOCKS_QUERY_KEY_EXTENSION = 'blockList';
export const BURN_BLOCKS_BLOCK_LIST_UNGROUPED_QUERY_KEY_EXTENSION = 'blockList-ungrouped';
export const mobileBorderCss = {
  '.has-horizontal-scroll &:before': {
    // Adds a border to the left of the first column
    content: '""',
    position: 'absolute',
    right: '-6px',
    top: 0,
    bottom: 0,
    width: '2px',
    height: 'var(--stacks-sizes-14)',
    backgroundColor: 'borderPrimary',
  },
};
