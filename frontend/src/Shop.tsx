import { useState, type ReactNode } from "react";
import type { Item, OwnedItem } from "./api";
import { FALLBACK_ICON, ITEM_ICONS } from "./itemIcons";
import { useShop } from "./useShop";

// 金貨アイコン。絵文字🪙は環境によって銀色に見えることがあるため、確実に金色になるようCSSで描く。
function GoldCoin() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 shrink-0 rounded-full bg-[#ffd54a] shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.35)]"
    />
  );
}

// 4隅の金鋲（リベット）飾り。木の看板・商品カードなど、金縁の枠に共通で使う。
function Rivets() {
  return (
    <>
      <span className="pointer-events-none absolute -left-1 -top-1 h-2 w-2 rounded-full bg-[#ffd54a] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ffd54a] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-[#ffd54a] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-[#ffd54a] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
    </>
  );
}

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
    <div
      className={`relative border-2 border-[#ffd54a]/80 bg-[#150d07] p-3 text-[#f0f0f0] shadow-[3px_3px_0_rgba(0,0,0,0.45)] ${className}`}
    >
      <Rivets />
      {title && (
        <div className="mb-2 border-b-2 border-[#6b4226] pb-1 text-sm tracking-widest text-[#ffd54a]">
          ▼{title}
        </div>
      )}
      {children}
    </div>
  );
}

// 商品棚の1枠。ランタンに照らされた木箱に品物が収まっているイメージ。
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
    <div className="relative flex h-full flex-col border-2 border-[#ffd54a]/80 bg-[#150d07] p-2.5 text-center shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
      <Rivets />
      <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center border-2 border-[#ffd54a]/70 bg-gradient-to-b from-[#241a12] to-[#0d0904] text-3xl shadow-[inset_0_0_12px_rgba(0,0,0,0.7)]">
        {icon}
      </div>
      <p className="text-xs tracking-wide text-[#ffe9b3]">{name}</p>
      <p className="mt-0.5 text-[9px] leading-tight text-[#c9b98f]">{description}</p>
      <div className="mt-auto pt-2">
        <p className="mx-auto inline-flex items-center gap-1 border border-[#ffd54a]/60 bg-[#0d0904] px-2 py-0.5 text-sm text-[#ffd54a]">
          <GoldCoin />
          {price}G
        </p>
        {stock !== undefined && <p className="mt-1 text-[9px] text-[#c9b98f]">ざいこ {stock}</p>}
        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="mt-1.5 w-full border-2 border-[#ffd54a]/70 bg-[#241a12] py-1 text-[10px] tracking-widest text-[#ffe9b3] transition hover:bg-[#3d2817] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {actionLabel}
        </button>
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
      className="min-h-screen pb-8 font-pixel text-[#f0f0f0]"
      style={{
        backgroundColor: "#1a1109",
        backgroundImage: [
          "radial-gradient(circle 420px at 10% 10%, rgba(255,180,90,0.20), transparent 65%)",
          "radial-gradient(circle 420px at 90% 10%, rgba(255,180,90,0.20), transparent 65%)",
          "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,196,74,0.12), transparent 70%)",
          "linear-gradient(180deg, #2b1c10 0%, #1a1109 100%)",
        ].join(", "),
      }}
    >
      {/* 看板 */}
      <div className="flex justify-center pt-6">
        <div className="relative border-[3px] border-[#ffd54a] bg-gradient-to-b from-[#6b4226] to-[#3d2817] px-8 py-3 shadow-[inset_0_0_0_2px_#3d2817,4px_4px_0_rgba(0,0,0,0.45)]">
          <Rivets />
          <p className="text-lg tracking-[0.3em] text-[#ffe9b3] drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
            よろずや
          </p>
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-4xl space-y-4 px-4 sm:px-8">
        {/* 所持金バッジ */}
        <div className="flex justify-end">
          <div className="relative flex items-center gap-1.5 border-2 border-[#ffd54a]/80 bg-[#150d07] px-3 py-1 text-sm shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
            <Rivets />
            <GoldCoin />
            <span className="text-[#ffd54a]">{player.gold}G</span>
          </div>
        </div>

        {/* コマンドメニュー：かう / うる で画面を切り替える */}
        <div className="relative flex border-2 border-[#ffd54a]/80 bg-[#150d07] text-sm shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
          <Rivets />
          <button
            type="button"
            onClick={() => setMode("buy")}
            className={`flex-1 py-2 tracking-widest transition ${
              mode === "buy" ? "bg-[#3d2817] text-[#ffd54a]" : "text-[#f0f0f0] hover:bg-[#241a12]"
            }`}
          >
            {mode === "buy" ? "▶ かう" : "かう"}
          </button>
          <div className="w-[2px] bg-[#6b4226]" />
          <button
            type="button"
            onClick={() => setMode("sell")}
            className={`flex-1 py-2 tracking-widest transition ${
              mode === "sell" ? "bg-[#3d2817] text-[#ffd54a]" : "text-[#f0f0f0] hover:bg-[#241a12]"
            }`}
          >
            {mode === "sell" ? "▶ うる" : "うる"}
          </button>
        </div>

        {loading ? (
          <PixelWindow>
            <p className="text-sm text-[#c9b98f]">よみこみちゅう…</p>
          </PixelWindow>
        ) : mode === "buy" ? (
          <PixelWindow title="しなぞろえ">
            {items.length === 0 ? (
              <p className="text-xs text-[#c9b98f]">
                {connected ? "商品がありません" : "お店に入れませんでした"}
              </p>
            ) : (
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
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
              <p className="text-xs text-[#c9b98f]">なにも持っていない</p>
            ) : (
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
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
        <div className="relative border-2 border-[#ffd54a]/80 bg-[#150d07] shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
          <Rivets />
          <div className="flex items-stretch gap-3 p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#ffd54a]/70 bg-gradient-to-b from-[#241a12] to-[#0d0904] text-2xl shadow-[inset_0_0_12px_rgba(0,0,0,0.7)]">
              🧙‍♂️
            </div>
            <p className="flex-1 text-sm leading-relaxed">
              {log[0]}
              <span className="animate-pulse text-[#ffd54a]">▼</span>
            </p>
          </div>
          <div className="h-2 bg-gradient-to-b from-[#8a5a2e] to-[#3d2817]" />
        </div>
      </div>
    </div>
  );
}
