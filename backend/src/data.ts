// よろず屋の商品データ（第3回でデータベースに置き換えます）
export const items = [
  { id: 1, name: 'やくそう', price: 8, stock: 99, description: 'HPを少量回復する' },
  { id: 2, name: 'ポーション', price: 50, stock: 10, description: 'HPを大きく回復する' },
  { id: 3, name: 'エリクサー', price: 5000, stock: 1, description: 'HPとMPを全回復する伝説の薬' },
  { id: 4, name: '鉄の剣', price: 300, stock: 3, description: '頼りになる冒険者の相棒' },
  { id: 5, name: '魔法の杖', price: 800, stock: 2, description: '使うほど魔力が増す杖' },
]

// 冒険者の状態（第3回でデータベースに置き換えます）
export const player = {
  gold: 500,
  items: [] as { itemId: number; quantity: number }[],
}