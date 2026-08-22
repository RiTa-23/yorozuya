import { useCallback, useEffect, useState } from "react";
import { fetchItems, fetchPlayer, purchaseItem, sellItem, type Item, type Player } from "./api";

const WELCOME = "てんしゅ「いらっしゃい！なんでも屋にようこそ」";
const CONNECTION_ERROR =
  "てんしゅ「おや、お店とつながらないようじゃ…バックエンド（bun run dev）は起きておるか？」";

// 売買成功時の演出（浮き上がる金額表示など）を1回分だけ保持する。idは毎回変えて
// 同じ品を連打してもアニメーションが再生し直されるようにするためのキー
export type TradeFeedback = { id: number; itemId: number; kind: "buy" | "sell"; amount: number };
const FEEDBACK_DURATION_MS = 900;

export function useShop() {
  const [items, setItems] = useState<Item[]>([]);
  const [player, setPlayer] = useState<Player>({ gold: 0, items: [] });
  const [log, setLog] = useState<string[]>([WELCOME]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [connected, setConnected] = useState(false);
  const [feedback, setFeedback] = useState<TradeFeedback | null>(null);

  const pushLog = (message: string) => setLog((prev) => [message, ...prev].slice(0, 5));

  const triggerFeedback = (itemId: number, kind: "buy" | "sell", amount: number) => {
    const id = Date.now();
    setFeedback({ id, itemId, kind, amount });
    window.setTimeout(() => {
      setFeedback((current) => (current?.id === id ? null : current));
    }, FEEDBACK_DURATION_MS);
  };

  const loadAll = useCallback(async () => {
    try {
      const [nextItems, nextPlayer] = await Promise.all([fetchItems(), fetchPlayer()]);
      setItems(nextItems);
      setPlayer(nextPlayer);
      setConnected(true);
    } catch {
      setConnected(false);
      pushLog(CONNECTION_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const buy = async (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || busy) return;
    setBusy(true);
    try {
      const nextPlayer = await purchaseItem(itemId, 1);
      setPlayer(nextPlayer);
      setItems(await fetchItems());
      pushLog(`てんしゅ「${item.name}まいど！${item.price}ゴールドじゃ」`);
      triggerFeedback(itemId, "buy", item.price);
    } catch (err) {
      pushLog(`てんしゅ「${err instanceof Error ? err.message : "うまく買えなかったようじゃ"}」`);
    } finally {
      setBusy(false);
    }
  };

  const sell = async (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || busy) return;
    setBusy(true);
    try {
      const nextPlayer = await sellItem(itemId, 1);
      setPlayer(nextPlayer);
      setItems(await fetchItems());
      const sellPrice = Math.floor(item.price / 2);
      pushLog(`てんしゅ「${item.name}は${sellPrice}ゴールドで買い取ろう」`);
      triggerFeedback(itemId, "sell", sellPrice);
    } catch (err) {
      pushLog(`てんしゅ「${err instanceof Error ? err.message : "うまく売れなかったようじゃ"}」`);
    } finally {
      setBusy(false);
    }
  };

  return { items, player, log, loading, busy, connected, buy, sell, feedback };
}
