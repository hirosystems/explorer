export interface TokenTransfer {
  /** Hex encoded transaction hash -- the transaction that originated / triggered this event. */
  tx_id: string;
  asset_type: 'stx' | 'ft' | 'nft';
  event_type: 'transfer' | 'mint' | 'burn';
  /**
   * For `asset_type` of `ft` or `nft`, this is the `{owner-address}.{contract-name}.{token-name}`.
   * For `asset_type` of `stx`, this field is irrelevant.
   * @example "SC3H92H297DX3YDPFHZGH90G8Z4NPH4VE8E83YWAQ.Stack-o-puppers.puppers"
   */
  asset_id: string;
  /**
   * The principal of the address or contract that was debited. For `event_type` of `mint` this is irrelevant (there is no sender).
   * @example "SC3H92H297DX3YDPFHZGH90G8Z4NPH4VE8E83YWAQ.Stack-o-puppers-central-bank" -- a contract that holds/sends/receives assets.
   * @example "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH" - a Stacks account/user public address.
   */
  sender: string;
  /**
   * The principal of the address or contract that was credited. For `event_type` of `burn` this is irrelevant (there is no recipient).
   * @example "SC3H92H297DX3YDPFHZGH90G8Z4NPH4VE8E83YWAQ.Stack-o-puppers-central-bank" -- a contract that holds/sends/receives assets.
   * @example "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH" - a Stacks account/user public address.
   */
  recipient: string;
  /**
   * For an `asset_type` of `stx` or `ft`, this is a hex-encoded 128-bit unsigned-integer.
   * For an `asset_type` of `nft`, this is a hex-encoded Clarity value -- typically a Buffer representation of an ascii string, or a unique integer.
   */
  value: string;
  /**
   * Set to `pending` if the originating tx is in the mempool.
   * Set to `unconfirmed` if the originating tx has been minted into a block, but the block is not old enough.
   * Set to `confirmed` if the originating tx has been minted and in an old enough block.
   */
  pending: 'pending' | 'unconfirmed' | 'confirmed' | '';
}
