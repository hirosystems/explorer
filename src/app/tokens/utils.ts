export const getHasSBTCInName = (name: string, symbol: string) => {
  if (!name || !symbol) {
    return false;
  }
  return name.toLowerCase().includes('sbtc') || symbol.toLowerCase().includes('sbtc');
};
export const getIsSBTC = (contractPrincipal: string) => {
  if (!contractPrincipal) {
    return false;
  }
  return contractPrincipal === 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';
};
