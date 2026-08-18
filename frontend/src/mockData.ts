// UIモック比較用のダミーデータ。
// フィールド名は講座で作るAPIのレスポンス形にそろえてある（実装フェーズでそのままfetch結果に差し替える想定）。

export type Item = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
};

export type OwnedItem = { itemId: number; quantity: number };

export type Player = { gold: number; items: OwnedItem[] };

export const ITEM_ICONS: Record<number, string> = {
  1: "🌿",
  2: "🧪",
  3: "✨",
  4: "🗡️",
  5: "🪄",
};

export function initialItems(): Item[] {
  return [
    { id: 1, name: "やくそう", price: 8, stock: 99, description: "HPを少量回復する" },
    { id: 2, name: "ポーション", price: 50, stock: 10, description: "HPを大きく回復する" },
    { id: 3, name: "エリクサー", price: 5000, stock: 1, description: "HPとMPを全回復する伝説の薬" },
    { id: 4, name: "鉄の剣", price: 300, stock: 3, description: "頼りになる冒険者の相棒" },
    { id: 5, name: "魔法の杖", price: 800, stock: 2, description: "使うほど魔力が増す杖" },
  ];
}

export function initialPlayer(): Player {
  return { gold: 500, items: [{ itemId: 2, quantity: 1 }] };
}
