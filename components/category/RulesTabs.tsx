"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";

export function RulesTabs({ tabs }: { tabs: { label: string; items: string[] }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#11111114] bg-white shadow-[0_8px_30px_#1111110a]">
      <div role="tablist" className="flex border-b border-[#11111114] bg-ivory mobile:no-scrollbar mobile:overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cx(
              "flex-1 cursor-pointer border-b-[3px] px-6 py-[18px] text-[12px] font-extrabold tracking-[.06em] whitespace-nowrap uppercase transition-colors duration-300",
              active === i ? "border-olive bg-white text-olive" : "border-transparent bg-transparent text-[#1119] hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="px-10 py-9 text-[15px] leading-[1.8] text-[#111c] mobile:px-6 mobile:py-7">
        {tabs[active].items.map((item) => (
          <div key={item}>— {item}</div>
        ))}
      </div>
    </div>
  );
}
