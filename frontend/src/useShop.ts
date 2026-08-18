import { useCallback, useEffect, useState } from "react";
import { fetchItems, fetchPlayer, purchaseItem, sellItem, type Item, type Player } from "./api";

const WELCOME = "てんしゅ「いらっしゃい！なんでも屋にようこそ」";
const CONNECTION_ERROR =
  "てんしゅ「おや、お店とつながらないようじゃ…バックエンド（bun run dev）は起きておるか？」";

export function useShop() {
  const [items, setItems] = useState<Item[]>([]);
  const [player, setPlayer] = useState<Player>({ gold: 0, items: [] });
  const [log, setLog] = useState<string[]>([WELCOME]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [connected, setConnected] = useState(false);

  const pushLog = (message: string) => setLog((prev) => [message, ...prev].slice(0, 5));

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
      pushLog(`てんしゅ「${item.name}は${Math.floor(item.price / 2)}ゴールドで買い取ろう」`);
    } catch (err) {
      pushLog(`てんしゅ「${err instanceof Error ? err.message : "うまく売れなかったようじゃ"}」`);
    } finally {
      setBusy(false);
    }
  };

  return { items, player, log, loading, busy, connected, buy, sell };
}
