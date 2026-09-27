"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, cities, hero, routes } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { FieldTrigger } from "@/components/ui/FieldTrigger";
import { cx } from "@/lib/cx";

type Field = "what" | "where" | "when";
type Option = { value: string; label: string };

const whatOptions: Option[] = categories.map((c) => ({ value: c.slug, label: c.title }));
const whereOptions: Option[] = cities.map((c) => ({ value: c.slug, label: c.title }));

function formatWhen(v: string) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function Dropdown({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("absolute top-[calc(100%+8px)] left-0 z-10 min-w-full overflow-hidden rounded-field border border-[#1111111a] bg-white p-1.5 text-ink shadow-panel", className)}>
      {children}
    </div>
  );
}

function OptionList({ options, selected, onPick }: { options: Option[]; selected?: string; onPick: (v: string) => void }) {
  return (
    <ul role="listbox" className="m-0 list-none p-0">
      {options.map((o) => (
        <li key={o.value} role="option" aria-selected={o.value === selected}>
          <button
            type="button"
            onClick={() => onPick(o.value)}
            className={cx(
              "w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold whitespace-nowrap transition-colors duration-200",
              o.value === selected ? "bg-olive text-white" : "hover:bg-ivory",
            )}
          >
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** What / Where / When search panel under the hero copy. Submits to /booking with query params. */
export function HeroSearch() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Field | null>(null);
  const [what, setWhat] = useState<string>();
  const [where, setWhere] = useState<string>();
  const [when, setWhen] = useState("");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (f: Field) => setOpen((o) => (o === f ? null : f));

  const search = () => {
    const q = new URLSearchParams();
    if (what) q.set("category", what);
    if (where) q.set("city", where);
    if (when) q.set("when", when);
    const qs = q.toString();
    router.push(qs ? `${routes.booking}?${qs}` : routes.booking);
  };

  const s = hero.search;
  return (
    <div
      ref={ref}
      className="mt-7 grid max-w-[880px] grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-2 rounded-[18px] bg-[#f5f2ecf2] p-2 shadow-panel backdrop-blur-[10px] mobile:grid-cols-1"
    >
      <div className="relative">
        <FieldTrigger label={s.what.label} placeholder={s.what.placeholder} value={whatOptions.find((o) => o.value === what)?.label} open={open === "what"} onClick={() => toggle("what")} />
        {open === "what" && (
          <Dropdown>
            <OptionList options={whatOptions} selected={what} onPick={(v) => { setWhat(v); setOpen(null); }} />
          </Dropdown>
        )}
      </div>
      <div className="relative">
        <FieldTrigger label={s.where.label} placeholder={s.where.placeholder} value={whereOptions.find((o) => o.value === where)?.label} open={open === "where"} onClick={() => toggle("where")} />
        {open === "where" && (
          <Dropdown>
            <OptionList options={whereOptions} selected={where} onPick={(v) => { setWhere(v); setOpen(null); }} />
          </Dropdown>
        )}
      </div>
      <div className="relative">
        <FieldTrigger label={s.when.label} placeholder={s.when.placeholder} value={when ? formatWhen(when) : undefined} open={open === "when"} onClick={() => toggle("when")} />
        {open === "when" && (
          <Dropdown className="p-3">
            <input
              type="datetime-local"
              autoFocus
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              aria-label={s.when.placeholder}
              className="w-full rounded-lg border border-[#1111112e] px-3 py-2.5 font-sans text-[13px] outline-none focus:border-olive"
            />
          </Dropdown>
        )}
      </div>
      <Button variant="olive" onClick={search} className="min-h-[54px]! px-7!">
        {s.button}
      </Button>
    </div>
  );
}
