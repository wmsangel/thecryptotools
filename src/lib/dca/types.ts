// Формат, который отдаёт Cloudflare Worker dca-status (/status) — подмножество
// статуса бумажного бота (izn.dca), которое безопасно показывать: без ключей,
// без реального депозита. Публикуются только paper-прогоны.

export interface GridLevel {
  step: number;
  price: number;
  amount_usdt: number;
  deviation_pct: number;
  status: "filled" | "pending" | "not_placed";
  distance_pct: number;
}

export interface SlotStats {
  deals: number;
  winrate_pct: number | null;
  avg_hours: number | null;
  median_hours: number | null;
  max_hours: number | null;
  best_pnl: number | null;
  worst_pnl: number | null;
  realized_pnl: number;
}

export interface HistoryDeal {
  opened_at?: string;
  closed_at?: string;
  avg_price?: number;
  exit_price?: number;
  qty?: number;
  invested?: number;
  pnl: number;
  safety_orders?: number;
  hours: number;
}

export interface Slot {
  id: number;
  state: "in_position" | "started" | "idle";
  deals_done: number;
  realized_pnl: number;
  history?: HistoryDeal[];
  opened_at?: string;
  hours_in_position?: number;
  avg_price?: number;
  invested?: number;
  unrealized_pnl?: number;
  drawdown_pct?: number;
  safety_orders_filled?: number;
  safety_orders_total?: number;
  take_profit_price?: number | null;
  to_take_profit_pct?: number | null;
  next_buy_price?: number | null;
  to_next_buy_pct?: number | null;
  grid?: GridLevel[];
  stats?: SlotStats;
}

export interface Variant {
  name: string; // сырой id, напр. "BTC·small-300·take3"
  symbol: string; // "BTCUSDT"
  price?: number;
  capital?: number;
  realized_pnl: number;
  unrealized_pnl: number;
  total_pnl?: number;
  deals_done: number;
  slots_total?: number;
  slots_active?: number;
  entry_filter?: string | null;
  waiting_for_signal?: boolean;
  is_new?: boolean;
  scheme?: string | null;
  take_profit_pct?: number;
  safety_orders?: number;
  grid_coverage_pct?: number;
  stats?: SlotStats;
  slots?: Slot[];
}

export interface DcaStatus {
  updated_at: string | null;
  mode?: string | null;
  started_at?: string | null;
  totals?: {
    variants?: number;
    realized_pnl?: number;
    unrealized_pnl?: number;
    deals_done?: number;
    capital?: number;
  };
  variants: Variant[];
}
