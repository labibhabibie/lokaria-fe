"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function CrudDialog({ title, eyebrow, onClose, children, wide = false }: {
  title: string;
  eyebrow: string;
  onClose(): void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#11111199] p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="crud-dialog-title"
        className={`my-auto max-h-[calc(100vh-32px)] w-full overflow-y-auto border border-line bg-white p-6 text-ink shadow-float mobile:p-4 ${wide ? "max-w-[820px]" : "max-w-[560px]"}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-[9px] font-extrabold tracking-label text-olive uppercase">{eyebrow}</p>
            <h2 id="crud-dialog-title" className="mt-1 text-[20px] font-extrabold uppercase">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Tutup"
            aria-label="Tutup formulir"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-line hover:border-olive hover:text-olive"
          >
            <X size={17} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
