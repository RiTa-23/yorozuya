import { useState } from "react";
import { RetroShop } from "./RetroShop";
import { ModernShop } from "./ModernShop";

// UIモック比較用ページ。方向性が決まったら削除し、実装に置き換える。
export function Mock() {
  const [tab, setTab] = useState<"retro" | "modern">("retro");

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 flex justify-center gap-2 bg-slate-900 p-3">
        <button
          type="button"
          onClick={() => setTab("retro")}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
            tab === "retro" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
          }`}
        >
          案A: レトロ8bit風
        </button>
        <button
          type="button"
          onClick={() => setTab("modern")}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
            tab === "modern" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
          }`}
        >
          案B: 現代スマホガチャ風
        </button>
      </div>
      {tab === "retro" ? <RetroShop /> : <ModernShop />}
    </div>
  );
}
