// Native STX has no asset identifier; the explorer uses the literal `stx` token id for it (served by
// GET /extended/v3/tokens/stx/holders and /supply), and LunarCrush exposes it via coin id 830.
export const STX_ASSET_ID = 'stx';
export const STX_DECIMALS = 6;
export const STX_LUNARCRUSH_ID = '830';
export const STX_LOGO_URL = '/stx-square.svg';
export const STX_NAME = 'Stacks';
export const STX_SYMBOL = 'STX';

// Native STX sends are `token_transfer` transactions; this filter powers the
// Transfers tab and the Overview's recent-transfers list.
export const STX_TX_FILTERS = { transactionType: ['token_transfer'] };
