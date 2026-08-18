import { ITEM_ICONS } from "./mockData";
import { useMockShop } from "./useMockShop";

// 案B: 現代スマホRPGガチャ風（グラデーション×カード×丸みフォント）
const RARITY_RING: Record<number, string> = {
  1: "from-emerald-300 to-emerald-500",
  2: "from-sky-300 to-sky-500",
  3: "from-amber-300 via-orange-400 to-fuchsia-500",
  4: "from-slate-300 to-slate-500",
  5: "from-violet-300 to-purple-500",
};

export function ModernShop() {
  const { items, player, log, buy, sell } = useMockShop();

  return (
    <div
      className="min-h-full bg-gradient-to-b from-indigo-50 via-white to-pink-50 p-4 pb-28 sm:p-8"
      style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest opacity-80">SHOP</p>
              <h1 className="text-xl font-black">よろず屋</h1>
            </div>
            <div className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-black text-amber-600 shadow">
              🪙 {player.gold} G
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center rounded-3xl bg-white p-3 text-center shadow-md shadow-slate-200"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-2xl shadow-inner ${RARITY_RING[item.id]}`}
              >
                {ITEM_ICONS[item.id]}
              </div>
              <p className="mt-2 text-sm font-bold text-slate-700">{item.name}</p>
              <p className="text-[11px] leading-tight text-slate-400">{item.description}</p>
              <p className="mt-1 text-sm font-black text-amber-500">{item.price} G</p>
              <p className="text-[10px] text-slate-400">在庫 {item.stock}</p>
              <button
                type="button"
                onClick={() => buy(item.id)}
                disabled={item.stock <= 0}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 py-1.5 text-xs font-bold text-white shadow transition active:scale-95 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
              >
                購入する
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-md shadow-slate-200">
          <p className="mb-2 text-xs font-bold text-slate-500">🎒 所持アイテム</p>
          {player.items.length === 0 ? (
            <p className="text-xs text-slate-400">まだ何も持っていません</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {player.items.map((owned) => {
                const item = items.find((i) => i.id === owned.itemId);
                if (!item) return null;
                return (
                  <div
                    key={owned.itemId}
                    className="flex items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3 text-xs"
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-sm ${RARITY_RING[item.id]}`}
                    >
                      {ITEM_ICONS[item.id]}
                    </span>
                    <span className="font-bold text-slate-600">
                      {item.name} ×{owned.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => sell(owned.itemId)}
                      className="rounded-full bg-white px-2 py-0.5 font-bold text-purple-500 shadow"
                    >
                      売却
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-2xl px-4 pb-4">
        <div className="flex items-end gap-2 rounded-3xl bg-white/95 p-3 shadow-xl shadow-slate-300 backdrop-blur">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-lg">
            🧑‍🌾
          </div>
          <p className="text-xs leading-relaxed text-slate-600">{log[0]}</p>
        </div>
      </div>
    </div>
  );
}
