// 講座で作るAPIをそのまま叩くだけのクライアント（RPCは使わず素のfetch）。
// バックエンドは講座資料の通り http://localhost:3000 に固定。

const API_BASE = "http://localhost:3000";

export type Item = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
};

export type OwnedItem = { itemId: number; quantity: number };
export type Player = { gold: number; items: OwnedItem[] };

async function toJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const message = typeof data?.message === "string" ? data.message : "エラーが発生しました";
    throw new Error(message);
  }
  return data as T;
}

export function fetchItems(): Promise<Item[]> {
  return fetch(`${API_BASE}/api/items`).then((res) => toJson<Item[]>(res));
}

export function fetchPlayer(): Promise<Player> {
  return fetch(`${API_BASE}/api/player`).then((res) => toJson<Player>(res));
}

export function purchaseItem(itemId: number, quantity = 1): Promise<Player> {
  return fetch(`${API_BASE}/api/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, quantity }),
  }).then((res) => toJson<Player>(res));
}

export function sellItem(itemId: number, quantity = 1): Promise<Player> {
  return fetch(`${API_BASE}/api/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, quantity }),
  }).then((res) => toJson<Player>(res));
}
