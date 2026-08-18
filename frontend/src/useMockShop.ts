import { useState } from "react";
import { initialItems, initialPlayer, type Item, type Player } from "./mockData";

// 実装フェーズでは、この中身をAPI呼び出し（fetch）に差し替える。
// 呼び出し側（Retro/Modernコンポーネント）から見たインターフェースは変えない想定。
export function useMockShop() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [player, setPlayer] = useState<Player>(initialPlayer);
  const [log, setLog] = useState<string[]>(["てんしゅ「いらっしゃい！なんでも屋にようこそ」"]);

  const pushLog = (message: string) => setLog((prev) => [message, ...prev].slice(0, 5));

  const buy = (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (item.stock <= 0) {
      pushLog(`てんしゅ「${item.name}は在庫切れじゃ、すまんな」`);
      return;
    }
    if (player.gold < item.price) {
      pushLog("てんしゅ「お金が足りないようじゃが…？」");
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, stock: i.stock - 1 } : i)));
    setPlayer((prev) => {
      const owned = prev.items.find((i) => i.itemId === itemId);
      const nextItems = owned
        ? prev.items.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev.items, { itemId, quantity: 1 }];
      return { gold: prev.gold - item.price, items: nextItems };
    });
    pushLog(`てんしゅ「${item.name}まいど！${item.price}ゴールドじゃ」`);
  };

  const sell = (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    const owned = player.items.find((i) => i.itemId === itemId);
    if (!item || !owned || owned.quantity <= 0) {
      pushLog("てんしゅ「それは持っておらんじゃろう？」");
      return;
    }
    const refund = Math.floor(item.price / 2);
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, stock: i.stock + 1 } : i)));
    setPlayer((prev) => ({
      gold: prev.gold + refund,
      items: prev.items
        .map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    }));
    pushLog(`てんしゅ「${item.name}は${refund}ゴールドで買い取ろう」`);
  };

  return { items, player, log, buy, sell };
}
