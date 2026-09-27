"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";

export function CopyPill({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true))}
      className={cx(
        "min-h-[30px] cursor-pointer self-start rounded-full border px-3 text-[10px] font-extrabold tracking-[.1em] uppercase transition-colors duration-300",
        copied ? "border-olive bg-olive text-white" : "border-[#11111129] bg-transparent text-olive",
      )}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
