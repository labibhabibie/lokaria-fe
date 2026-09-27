"use client";

import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({ title, eyebrow, action, children, className = "" }: { title?: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-line bg-white ${className}`}>
      {(title || eyebrow || action) && (
        <header className="flex min-h-[70px] items-center justify-between gap-4 border-b border-line px-5 py-4 mobile:items-start mobile:px-4">
          <div>
            {eyebrow && <p className="text-[9px] font-extrabold tracking-label text-olive uppercase">{eyebrow}</p>}
            {title && <h2 className="mt-1 text-[16px] font-extrabold uppercase">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function MetricCard({ label, value, note, icon: Icon, tone = "default" }: { label: string; value: string; note: string; icon: LucideIcon; tone?: "default" | "dark" | "warm" }) {
  const style = tone === "dark" ? "bg-olive text-white border-olive" : tone === "warm" ? "bg-[#e8d8c8] text-ink border-[#80614840]" : "bg-white text-ink border-line";
  return (
    <article className={`min-h-[150px] border p-5 ${style}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-[10px] font-extrabold tracking-label uppercase ${tone === "dark" ? "text-beige" : "text-[#11111180]"}`}>{label}</p>
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="mt-7 text-[clamp(25px,3vw,38px)] leading-none font-extrabold">{value}</p>
      <p className={`mt-3 text-[11px] ${tone === "dark" ? "text-[#ffffffb3]" : "text-[#11111180]"}`}>{note}</p>
    </article>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  const key = String(children).toLowerCase();
  const style = key.includes("paid") || key.includes("active") || key.includes("confirm") || key.includes("verified") || key.includes("settled") || key.includes("approve") || key.includes("complete")
    ? "border-[#2d8b4e42] bg-[#2d8b4e12] text-[#266d3e]"
    : key.includes("cancel") || key.includes("suspend") || key.includes("refund")
      ? "border-[#a13b3540] bg-[#a13b3510] text-[#8d332e]"
      : "border-[#d9770640] bg-[#d9770612] text-[#9a5904]";
  return <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[9px] font-extrabold tracking-label whitespace-nowrap uppercase ${style}`}>{children}</span>;
}

export type DataColumn = { key: string; label: string; align?: "left" | "right" };
export type DataRow = Record<string, ReactNode> & { id: ReactNode };

export function ResponsiveTable({ columns, rows, empty = "No data found." }: { columns: DataColumn[]; rows: DataRow[]; empty?: string }) {
  if (rows.length === 0) return <div className="grid min-h-[220px] place-items-center p-6 text-[13px] text-[#11111180]">{empty}</div>;
  return (
    <>
      <div className="overflow-x-auto mobile:hidden">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead className="bg-ivory-soft text-[9px] font-extrabold tracking-label text-[#11111180] uppercase">
            <tr>{columns.map((column) => <th key={column.key} className={`px-5 py-3 ${column.align === "right" ? "text-right" : ""}`}>{column.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line text-[12px]">
            {rows.map((row) => (
              <tr key={String(row.id)} className="transition-colors hover:bg-ivory-soft">
                {columns.map((column) => <td key={column.key} className={`px-5 py-4 ${column.align === "right" ? "text-right" : ""}`}>{row[column.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hidden divide-y divide-line mobile:block">
        {rows.map((row) => (
          <article key={String(row.id)} className="space-y-3 p-4">
            {columns.map((column, index) => (
              <div key={column.key} className={`flex items-start justify-between gap-4 ${index === 0 ? "border-b border-line pb-3" : ""}`}>
                <span className="text-[9px] font-extrabold tracking-label text-[#11111173] uppercase">{column.label}</span>
                <span className="max-w-[65%] text-right text-[12px] font-semibold">{row[column.key]}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </>
  );
}

export function SearchField({ value, onChange, placeholder = "Search" }: { value: string; onChange(value: string): void; placeholder?: string }) {
  return (
    <label className="relative block w-full max-w-[320px]">
      <Search aria-hidden="true" size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#11111173]" />
      <span className="sr-only">{placeholder}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-11 w-full rounded-field border border-line bg-white pr-3 pl-10 text-[12px] outline-none focus:border-olive focus:shadow-[0_0_0_3px_#535b4017]" />
    </label>
  );
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="grid min-h-[280px] place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#535b4012] text-olive"><Icon size={21} aria-hidden="true" /></span>
        <h3 className="mt-4 text-[16px] font-extrabold uppercase">{title}</h3>
        <p className="mx-auto mt-2 max-w-[360px] text-[12px] leading-[1.6] text-[#11111180]">{text}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

export function MiniBars({ values }: { values: number[] }) {
  return (
    <div className="flex h-36 items-end gap-2" aria-label="Weekly performance chart">
      {values.map((value, index) => (
        <div key={index} className="flex h-full min-w-0 flex-1 items-end">
          <div className="w-full bg-olive transition-[height] hover:bg-brown" style={{ height: `${value}%` }} title={`${value}%`} />
        </div>
      ))}
    </div>
  );
}

export const primaryButton = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-field border border-olive bg-olive px-4 text-[10px] font-extrabold tracking-label text-white no-underline uppercase transition-colors hover:bg-olive-deep disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButton = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-field border border-line bg-white px-4 text-[10px] font-extrabold tracking-label text-ink no-underline uppercase transition-colors hover:border-olive hover:text-olive";
export const fieldClass = "min-h-11 w-full rounded-field border border-line bg-white px-3 text-[12px] outline-none focus:border-olive focus:shadow-[0_0_0_3px_#535b4017]";
