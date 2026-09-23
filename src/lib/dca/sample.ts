import type { DcaStatus } from "./types";

// Показательный образец в формате /status. Используется как заглушка, пока
// живой фид пуст (Worker поднят, но VPS ещё не пушит). В UI помечается плашкой
// «example data». Цифры правдоподобные, не выдаём за реальные.
export const SAMPLE_STATUS: DcaStatus = {
  updated_at: "2026-09-23 09:00:00",
  mode: "paper",
  started_at: "2026-09-08 06:20:00",
  totals: { variants: 6, realized_pnl: 12.4, unrealized_pnl: -3.1, deals_done: 41, capital: 252 },
  variants: [
    {
      name: "BTC·small-300·take3", symbol: "BTCUSDT", price: 79800, capital: 42,
      realized_pnl: 3.1, unrealized_pnl: -1.2, total_pnl: 1.9, deals_done: 8,
      slots_total: 4, slots_active: 1, entry_filter: "откат5", waiting_for_signal: false,
      take_profit_pct: 1.5, safety_orders: 5, grid_coverage_pct: 30,
      stats: { deals: 8, winrate_pct: 100, avg_hours: 26, median_hours: 19, max_hours: 71, best_pnl: 0.71, worst_pnl: 0.09, realized_pnl: 3.1 },
      slots: [{
        id: 1, state: "in_position", deals_done: 8, realized_pnl: 3.1,
        opened_at: "2026-09-21 03:20:00", hours_in_position: 40, avg_price: 78849,
        invested: 8.87, unrealized_pnl: -1.2, drawdown_pct: 4.2,
        safety_orders_filled: 1, safety_orders_total: 5,
        take_profit_price: 81214, to_take_profit_pct: 1.8,
        next_buy_price: 71910, to_next_buy_pct: -9.9,
        grid: [
          { step: 1, price: 75695, amount_usdt: 3.3, deviation_pct: 4, status: "filled", distance_pct: -5.1 },
          { step: 2, price: 71910, amount_usdt: 3.9, deviation_pct: 9, status: "pending", distance_pct: -9.9 },
          { step: 3, price: 67368, amount_usdt: 4.6, deviation_pct: 15, status: "pending", distance_pct: -15.6 },
          { step: 4, price: 61918, amount_usdt: 5.5, deviation_pct: 22, status: "pending", distance_pct: -22.4 },
          { step: 5, price: 55378, amount_usdt: 6.6, deviation_pct: 31, status: "pending", distance_pct: -30.6 },
        ],
      }],
    },
    {
      name: "ETH·small-300·take8", symbol: "ETHUSDT", price: 3120, capital: 42,
      realized_pnl: 4.2, unrealized_pnl: 0.0, total_pnl: 4.2, deals_done: 11,
      slots_total: 4, slots_active: 0, entry_filter: "тихо-1.5", waiting_for_signal: true,
      take_profit_pct: 1.0, safety_orders: 5, grid_coverage_pct: 30,
      stats: { deals: 11, winrate_pct: 100, avg_hours: 14, median_hours: 11, max_hours: 33, best_pnl: 0.52, worst_pnl: 0.12, realized_pnl: 4.2 },
      slots: [],
    },
    {
      name: "SOL·small-300·take3", symbol: "SOLUSDT", price: 178, capital: 42,
      realized_pnl: 2.8, unrealized_pnl: -0.6, total_pnl: 2.2, deals_done: 9,
      slots_total: 4, slots_active: 1, entry_filter: "откат3", waiting_for_signal: false,
      take_profit_pct: 1.5, safety_orders: 5, grid_coverage_pct: 30,
      stats: { deals: 9, winrate_pct: 100, avg_hours: 18, median_hours: 15, max_hours: 40, best_pnl: 0.6, worst_pnl: 0.1, realized_pnl: 2.8 },
      slots: [{
        id: 1, state: "in_position", deals_done: 9, realized_pnl: 2.8, opened_at: "2026-09-22 12:00:00",
        hours_in_position: 21, avg_price: 181, invested: 8.9, unrealized_pnl: -0.6, drawdown_pct: 1.7,
        safety_orders_filled: 0, safety_orders_total: 5, take_profit_price: 184, to_take_profit_pct: 3.4,
        next_buy_price: 172, to_next_buy_pct: -3.4,
        grid: [
          { step: 1, price: 172, amount_usdt: 3.3, deviation_pct: 3, status: "pending", distance_pct: -3.4 },
          { step: 2, price: 165, amount_usdt: 3.9, deviation_pct: 7, status: "pending", distance_pct: -7.3 },
          { step: 3, price: 156, amount_usdt: 4.6, deviation_pct: 12, status: "pending", distance_pct: -12.4 },
        ],
      }],
    },
    {
      name: "нов3:откат3-tp1.5", symbol: "XRPUSDT", price: 2.4, capital: 42,
      realized_pnl: 1.1, unrealized_pnl: -0.9, total_pnl: 0.2, deals_done: 5,
      slots_total: 4, slots_active: 1, entry_filter: "нов3:откат3-tp1.5", waiting_for_signal: false, is_new: true,
      take_profit_pct: 1.5, safety_orders: 5, grid_coverage_pct: 30,
      stats: { deals: 5, winrate_pct: 100, avg_hours: 9, median_hours: 8, max_hours: 16, best_pnl: 0.3, worst_pnl: 0.08, realized_pnl: 1.1 },
      slots: [{ id: 1, state: "in_position", deals_done: 5, realized_pnl: 1.1, hours_in_position: 12, avg_price: 2.45, invested: 8.8, unrealized_pnl: -0.9, drawdown_pct: 3.1, safety_orders_filled: 2, safety_orders_total: 5, take_profit_price: 2.49, to_take_profit_pct: 3.7, next_buy_price: 2.28, to_next_buy_pct: -5.0, grid: [] }],
    },
    {
      name: "DOGE·small-300·take8", symbol: "DOGEUSDT", price: 0.21, capital: 42,
      realized_pnl: 0.9, unrealized_pnl: -0.4, total_pnl: 0.5, deals_done: 6,
      slots_total: 4, slots_active: 1, entry_filter: "объём-x2", waiting_for_signal: false,
      take_profit_pct: 1.0, safety_orders: 5, grid_coverage_pct: 30,
      stats: { deals: 6, winrate_pct: 100, avg_hours: 22, median_hours: 20, max_hours: 44, best_pnl: 0.2, worst_pnl: 0.05, realized_pnl: 0.9 },
      slots: [],
    },
    {
      name: "BNB·small-300·take3", symbol: "BNBUSDT", price: 620, capital: 42,
      realized_pnl: 0.3, unrealized_pnl: 0.0, total_pnl: 0.3, deals_done: 2,
      slots_total: 4, slots_active: 0, entry_filter: "часы-ночь", waiting_for_signal: true,
      take_profit_pct: 1.5, safety_orders: 5, grid_coverage_pct: 30,
      stats: { deals: 2, winrate_pct: 100, avg_hours: 30, median_hours: 30, max_hours: 33, best_pnl: 0.18, worst_pnl: 0.12, realized_pnl: 0.3 },
      slots: [],
    },
  ],
};
