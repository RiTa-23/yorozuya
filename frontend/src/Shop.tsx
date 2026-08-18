import { useState, type ReactNode } from "react";
import type { Item, OwnedItem } from "./api";
import { FALLBACK_ICON, ITEM_ICONS } from "./itemIcons";
import { useShop } from "./useShop";

function PixelWindow({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white p-1 ${className}`}>
      <div className="border-2 border-[#10182c] bg-[#10182c] p-3 text-[#f0f0f0]">
        {title && (
          <div className="mb-2 border-b-2 border-[#4a5580] pb-1 text-sm tracking-widest text-[#ffd54a]">
            ▼{title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// 商品棚の1枠。木の板（棚）に品物が乗っているイメージ。
function ShelfSlot({
  icon,
  name,
  description,
  price,
  stock,
  disabled,
  actionLabel,
  onAction,
}: {
  icon: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  disabled?: boolean;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="bg-white p-1">
      <div className="flex h-full flex-col border-2 border-[#10182c] bg-[#10182c] p-2.5 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center border-2 border-[#8a5a2e] bg-gradient-to-b from-[#4a3220] to-[#2b1c12] text-2xl shadow-[inset_0_-4px_0_#8a5a2e]">
          {icon}
        </div>
        <p className="text-xs tracking-wide text-[#f0f0f0]">{name}</p>
        <p className="mt-0.5 text-[9px] leading-tight text-[#a3acd6]">{description}</p>
        <div className="mt-auto pt-2">
          <p className="text-sm text-[#ffd54a]">{price}G</p>
          {stock !== undefined && <p className="text-[9px] text-[#a3acd6]">ざいこ {stock}</p>}
          <button
            type="button"
            onClick={onAction}
            disabled={disabled}
            className="mt-1.5 w-full border-2 border-[#f0f0f0] bg-[#10182c] py-1 text-[10px] tracking-widest text-[#f0f0f0] transition hover:bg-[#4a5580] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type Mode = "buy" | "sell";

export function Shop() {
  const { items, player, log, loading, busy, connected, buy, sell } = useShop();
  const [mode, setMode] = useState<Mode>("buy");

  const ownedEntries: { owned: OwnedItem; item: Item }[] = player.items.flatMap((owned) => {
    const item = items.find((i) => i.id === owned.itemId);
    return item ? [{ owned, item }] : [];
  });

  return (
    <div
      className="min-h-screen pb-8 text-[#f0f0f0]"
      style={{
        fontFamily: "'DotGothic16', monospace",
        backgroundColor: "#241a12",
        backgroundImage: [
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,196,74,0.16), transparent 70%)",
          "repeating-linear-gradient(180deg, rgba(0,0,0,0.16) 0 2px, transparent 2px 34px)",
          "linear-gradient(180deg, #2b2015 0%, #241a12 100%)",
        ].join(", "),
      }}
    >
      {/* 看板 */}
      <div className="flex justify-center pt-6">
        <div className="relative">
          <div className="absolute -top-3 left-3 h-3 w-1 bg-[#8a5a2e]" />
          <div className="absolute -top-3 right-3 h-3 w-1 bg-[#8a5a2e]" />
          <div className="bg-white p-1">
            <div className="border-2 border-[#10182c] bg-gradient-to-b from-[#6b4226] to-[#4a3220] px-6 py-2 shadow-[inset_0_0_0_2px_#8a5a2e]">
              <p className="text-lg tracking-[0.3em] text-[#ffd54a]">よろずや</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-2xl space-y-4 px-4 sm:px-8">
        {/* 所持金バッジ */}
        <div className="flex justify-end">
          <div className="bg-white p-1">
            <div className="flex items-center gap-1.5 border-2 border-[#10182c] bg-[#10182c] px-3 py-1 text-sm">
              <span>💰</span>
              <span className="text-[#ffd54a]">{player.gold}G</span>
            </div>
          </div>
        </div>

        {/* コマンドメニュー：かう / うる で画面を切り替える */}
        <div className="bg-white p-1">
          <div className="flex border-2 border-[#10182c] bg-[#10182c] text-sm">
            <button
              type="button"
              onClick={() => setMode("buy")}
              className={`flex-1 py-2 tracking-widest transition ${
                mode === "buy" ? "bg-[#4a5580] text-[#ffd54a]" : "text-[#f0f0f0] hover:bg-[#333a66]"
              }`}
            >
              {mode === "buy" ? "▶ かう" : "かう"}
            </button>
            <div className="w-[2px] bg-[#4a5580]" />
            <button
              type="button"
              onClick={() => setMode("sell")}
              className={`flex-1 py-2 tracking-widest transition ${
                mode === "sell" ? "bg-[#4a5580] text-[#ffd54a]" : "text-[#f0f0f0] hover:bg-[#333a66]"
              }`}
            >
              {mode === "sell" ? "▶ うる" : "うる"}
            </button>
          </div>
        </div>

        {loading ? (
          <PixelWindow>
            <p className="text-sm text-[#a3acd6]">よみこみちゅう…</p>
          </PixelWindow>
        ) : mode === "buy" ? (
          <PixelWindow title="しなぞろえ">
            {items.length === 0 ? (
              <p className="text-xs text-[#a3acd6]">
                {connected ? "商品がありません" : "お店に入れませんでした"}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {items.map((item) => (
                  <ShelfSlot
                    key={item.id}
                    icon={ITEM_ICONS[item.id] ?? FALLBACK_ICON}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    stock={item.stock}
                    disabled={busy || item.stock <= 0}
                    actionLabel="かう"
                    onAction={() => buy(item.id)}
                  />
                ))}
              </div>
            )}
          </PixelWindow>
        ) : (
          <PixelWindow title="どうぐぶくろ">
            {ownedEntries.length === 0 ? (
              <p className="text-xs text-[#a3acd6]">なにも持っていない</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ownedEntries.map(({ owned, item }) => (
                  <ShelfSlot
                    key={owned.itemId}
                    icon={ITEM_ICONS[item.id] ?? FALLBACK_ICON}
                    name={`${item.name} ×${owned.quantity}`}
                    description={item.description}
                    price={Math.floor(item.price / 2)}
                    disabled={busy}
                    actionLabel="うる"
                    onAction={() => sell(owned.itemId)}
                  />
                ))}
              </div>
            )}
          </PixelWindow>
        )}

        {/* 店主カウンター */}
        <div className="bg-white p-1">
          <div className="flex items-stretch gap-3 border-2 border-[#10182c] bg-[#10182c] p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#8a5a2e] bg-gradient-to-b from-[#4a3220] to-[#2b1c12] text-2xl shadow-[inset_0_-4px_0_#8a5a2e]">
              🧓
            </div>
            <p className="flex-1 text-sm leading-relaxed">
              {log[0]}
              <span className="animate-pulse">▼</span>
            </p>
          </div>
          <div className="h-2 bg-gradient-to-b from-[#8a5a2e] to-[#4a3220]" />
        </div>
      </div>
    </div>
  );
}
