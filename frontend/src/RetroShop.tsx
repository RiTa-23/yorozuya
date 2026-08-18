import { ITEM_ICONS } from "./mockData";
import { useMockShop } from "./useMockShop";

// 案A: レトロ8bit風（ドット絵RPGのウィンドウ+カクカクフォント）
function PixelWindow({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
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

export function RetroShop() {
  const { items, player, log, buy, sell } = useMockShop();

  return (
    <div
      className="min-h-full bg-[#2b2f5c] p-4 text-[#f0f0f0] sm:p-8"
      style={{ fontFamily: "'DotGothic16', monospace" }}
    >
      <div className="mx-auto max-w-xl space-y-4">
        <PixelWindow>
          <div className="flex items-center justify-between text-base">
            <span className="tracking-widest">よろずや</span>
            <span className="text-[#ffd54a]">しょじきん {player.gold}G</span>
          </div>
        </PixelWindow>

        <PixelWindow title="しょうひん">
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 border-b border-[#4a5580]/60 py-1.5 last:border-0"
              >
                <span className="flex-1">
                  <span className="mr-1 text-[#7dd3fc]">{ITEM_ICONS[item.id]}</span>
                  {item.name}
                  <span className="ml-2 block text-[10px] leading-tight text-[#a3acd6] sm:inline sm:text-xs">
                    {item.description}
                  </span>
                </span>
                <span className="w-14 text-right text-[#ffd54a]">{item.price}G</span>
                <span className="w-16 text-right text-[10px] text-[#a3acd6]">
                  ざいこ{item.stock}
                </span>
                <button
                  type="button"
                  onClick={() => buy(item.id)}
                  disabled={item.stock <= 0}
                  className="border-2 border-[#f0f0f0] bg-[#10182c] px-2 py-1 text-[10px] text-[#f0f0f0] transition hover:bg-[#4a5580] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  かう
                </button>
              </li>
            ))}
          </ul>
        </PixelWindow>

        <PixelWindow title="どうぐぶくろ">
          {player.items.length === 0 ? (
            <p className="text-xs text-[#a3acd6]">なにも持っていない</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {player.items.map((owned) => {
                const item = items.find((i) => i.id === owned.itemId);
                if (!item) return null;
                return (
                  <li key={owned.itemId} className="flex items-center justify-between gap-2 py-1">
                    <span>
                      <span className="mr-1 text-[#7dd3fc]">{ITEM_ICONS[item.id]}</span>
                      {item.name} × {owned.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => sell(owned.itemId)}
                      className="border-2 border-[#f0f0f0] bg-[#10182c] px-2 py-1 text-[10px] text-[#f0f0f0] transition hover:bg-[#4a5580]"
                    >
                      うる（{Math.floor(item.price / 2)}G）
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </PixelWindow>

        <PixelWindow>
          <p className="min-h-10 text-sm leading-relaxed">
            {log[0]}
            <span className="animate-pulse">▼</span>
          </p>
        </PixelWindow>
      </div>
    </div>
  );
}
