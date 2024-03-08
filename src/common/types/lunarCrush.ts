export interface LunarCrushCoin {
  config?: { coin: string; generated: number };
  data?: {
    id: number;
    name: string;
    symbol: string;
    price: number | null;
    price_btc: number | null;
    market_cap: number | null;
    percent_change_24h: number | null;
    percent_change_7d: number | null;
    volume_24h: number | null;
    max_supply: number | null;
    circulating_supply: number | null;
    close: number | null;
    galaxy_score: number | null;
    alt_rank: number | null;
    volatility: number | null;
    market_cap_rank: number | null;
  };
  error?: string;
}
