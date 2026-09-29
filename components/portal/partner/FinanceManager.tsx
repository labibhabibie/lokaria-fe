"use client";

import { useMemo, useState } from "react";
import { Banknote, CircleDollarSign, FileDown, MessageCircle, Pencil, Plus, Trash2, TrendingUp } from "lucide-react";
import { rupiah } from "@/content/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { MetricCard, Panel, ResponsiveTable, StatusBadge, fieldClass, primaryButton, secondaryButton } from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialFinance, type FinanceEntry } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

type Period = "day" | "month" | "quarter" | "year" | "custom";

function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function displayDate(value: string) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getPeriodRange(period: Period, customStart: string, customEnd: string) {
  const end = new Date();
  const start = new Date(end);
  if (period === "month") start.setMonth(start.getMonth() - 1);
  if (period === "quarter") start.setMonth(start.getMonth() - 3);
  if (period === "year") start.setFullYear(start.getFullYear() - 1);
  if (period === "custom") return { start: customStart, end: customEnd };
  return { start: isoDate(start), end: isoDate(end) };
}

function periodLabel(period: Period) {
  if (period === "day") return "1 hari";
  if (period === "month") return "1 bulan";
  if (period === "quarter") return "3 bulan";
  if (period === "year") return "1 tahun";
  return "Tanggal khusus";
}

const emptyEntry = (type: FinanceEntry["type"]): FinanceEntry => ({
  id: "",
  source: "",
  date: isoDate(new Date()),
  type,
  method: "Transfer bank",
  amount: 0,
  status: "Tercatat",
});

export function FinanceManager({ expenses = false }: { expenses?: boolean }) {
  const [entries, setEntries] = usePartnerStorage("lokaria-partner-finance", initialFinance);
  const [period, setPeriod] = useState<Period>("month");
  const [customStart, setCustomStart] = useState(isoDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [customEnd, setCustomEnd] = useState(isoDate(new Date()));
  const [editing, setEditing] = useState<FinanceEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const range = getPeriodRange(period, customStart, customEnd);
  const invalidRange = period === "custom" && (!customStart || !customEnd || customStart > customEnd);

  const filtered = useMemo(() => entries.filter((entry) => {
    const matchesType = expenses ? entry.type === "Pengeluaran" : true;
    return !invalidRange && matchesType && (!range.start || entry.date >= range.start) && (!range.end || entry.date <= range.end);
  }), [entries, expenses, invalidRange, range.end, range.start]);

  const income = filtered.filter((entry) => entry.type === "Pendapatan" && entry.status !== "Dibatalkan").reduce((sum, entry) => sum + entry.amount, 0);
  const spending = filtered.filter((entry) => entry.type === "Pengeluaran" && entry.status !== "Dibatalkan").reduce((sum, entry) => sum + entry.amount, 0);
  const balance = income - spending;

  const open = (entry?: FinanceEntry) => {
    setIsNew(!entry);
    setMessage("");
    setEditing(entry ? { ...entry } : emptyEntry(expenses ? "Pengeluaran" : "Pendapatan"));
  };
  const save = () => {
    if (!editing?.source.trim() || !editing.date || !editing.method.trim() || editing.amount <= 0) {
      setMessage("Sumber, tanggal, metode, dan jumlah yang valid wajib diisi.");
      return;
    }
    if (isNew) setEntries((items) => [{ ...editing, id: `TRX-${Date.now()}` }, ...items]);
    else setEntries((items) => items.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
  };
  const remove = (entry: FinanceEntry) => {
    if (window.confirm(`Hapus transaksi ${entry.id}?`)) setEntries((items) => items.filter((item) => item.id !== entry.id));
  };

  const exportPdf = async () => {
    if (invalidRange) return;
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const title = expenses ? "Laporan Pengeluaran LOKARIA" : "Laporan Keuangan LOKARIA";
    pdf.setFillColor(83, 91, 64);
    pdf.rect(0, 0, 210, 34, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(title, 14, 16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(`${periodLabel(period)} | ${displayDate(range.start)} - ${displayDate(range.end)}`, 14, 24);

    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(`Pendapatan: ${rupiah(income)}`, 14, 44);
    pdf.text(`Pengeluaran: ${rupiah(spending)}`, 76, 44);
    pdf.text(`Saldo: ${rupiah(balance)}`, 144, 44);

    let y = 57;
    const drawHeader = () => {
      pdf.setFillColor(245, 242, 236);
      pdf.rect(14, y - 5, 182, 8, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("Tanggal", 16, y);
      pdf.text("Sumber", 43, y);
      pdf.text("Jenis", 112, y);
      pdf.text("Metode", 139, y);
      pdf.text("Jumlah", 194, y, { align: "right" });
      y += 8;
    };
    drawHeader();
    pdf.setFont("helvetica", "normal");
    for (const entry of filtered) {
      if (y > 282) {
        pdf.addPage();
        y = 18;
        drawHeader();
      }
      pdf.setFontSize(8);
      pdf.text(displayDate(entry.date), 16, y);
      pdf.text(entry.source.slice(0, 38), 43, y);
      pdf.text(entry.type, 112, y);
      pdf.text(entry.method.slice(0, 22), 139, y);
      pdf.text(`${entry.type === "Pengeluaran" ? "-" : "+"}${rupiah(entry.amount)}`, 194, y, { align: "right" });
      pdf.setDrawColor(225, 222, 216);
      pdf.line(14, y + 3, 196, y + 3);
      y += 9;
    }
    if (filtered.length === 0) pdf.text("Tidak ada transaksi pada periode ini.", 16, y);
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Dibuat ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date())}`, 14, 291);
    pdf.save(`laporan-keuangan-${range.start}-${range.end}.pdf`);
  };

  const sendWhatsApp = () => {
    if (invalidRange) return;
    const transactionLines = filtered.slice(0, 12).map((entry) =>
      `- ${displayDate(entry.date)} | ${entry.source} | ${entry.type === "Pengeluaran" ? "-" : "+"}${rupiah(entry.amount)}`,
    );
    const remaining = filtered.length > transactionLines.length
      ? `\n...dan ${filtered.length - transactionLines.length} transaksi lainnya.`
      : "";
    openWhatsApp([
      `*${expenses ? "Laporan Pengeluaran" : "Laporan Keuangan"} LOKARIA*`,
      `Periode: ${displayDate(range.start)} - ${displayDate(range.end)}`,
      "",
      `Pendapatan: ${rupiah(income)}`,
      `Pengeluaran: ${rupiah(spending)}`,
      `Saldo bersih: ${rupiah(balance)}`,
      `Jumlah transaksi: ${filtered.length}`,
      "",
      "*Rincian transaksi*",
      transactionLines.length ? transactionLines.join("\n") : "Tidak ada transaksi pada periode ini.",
      remaining,
      "",
      "Laporan dibuat melalui LOKARIA.",
    ].filter(Boolean).join("\n"));
  };

  const rows = filtered.map((entry) => ({
    id: entry.id,
    source: <div><strong>{entry.source}</strong><p className="mt-1 text-[9px] text-[#11111173]">{entry.id}</p></div>,
    date: displayDate(entry.date),
    type: entry.type,
    method: entry.method,
    amount: <strong className={entry.type === "Pengeluaran" ? "text-[#8d332e]" : "text-[#266d3e]"}>{entry.type === "Pengeluaran" ? "-" : "+"}{rupiah(entry.amount)}</strong>,
    status: <StatusBadge>{entry.status}</StatusBadge>,
    actions: <div className="flex justify-end gap-1"><button type="button" onClick={() => open(entry)} title={`Edit ${entry.id}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button><button type="button" onClick={() => remove(entry)} title={`Hapus ${entry.id}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button></div>,
  }));

  return <>
    <div className="space-y-5">
      <Panel title="Periode laporan" eyebrow="Filter, PDF, dan WhatsApp" action={<div className="flex flex-wrap justify-end gap-2 mobile:w-full mobile:justify-start"><button type="button" onClick={sendWhatsApp} disabled={invalidRange} className={secondaryButton}><MessageCircle size={15} />Kirim ke WA</button><button type="button" onClick={exportPdf} disabled={invalidRange} className={secondaryButton}><FileDown size={15} />Ekspor PDF</button></div>}>
        <div className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Pilih periode laporan">
            {(["day", "month", "quarter", "year", "custom"] as Period[]).map((value) => <button key={value} type="button" onClick={() => setPeriod(value)} className={`min-h-10 cursor-pointer border px-3 text-[9px] font-extrabold uppercase ${period === value ? "border-olive bg-olive text-white" : "border-line bg-white hover:border-olive"}`}>{periodLabel(value)}</button>)}
          </div>
          {period === "custom" && <div className="flex gap-2 mobile:w-full mobile:flex-col"><label className="text-[9px] font-extrabold uppercase">Dari<input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className={`${fieldClass} mt-1`} /></label><label className="text-[9px] font-extrabold uppercase">Sampai<input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className={`${fieldClass} mt-1`} /></label></div>}
          {invalidRange && <p className="w-full text-[10px] font-bold text-[#8d332e]">Tanggal awal harus lebih dahulu daripada tanggal akhir.</p>}
        </div>
      </Panel>

      <div className="grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <MetricCard label="Pendapatan" value={rupiah(income)} note={periodLabel(period)} icon={CircleDollarSign} tone="dark" />
        <MetricCard label="Pengeluaran" value={rupiah(spending)} note={periodLabel(period)} icon={Banknote} tone="warm" />
        <MetricCard label="Saldo bersih" value={rupiah(balance)} note={`${filtered.length} transaksi`} icon={TrendingUp} />
      </div>
      <Panel title={expenses ? "Pengeluaran operasional" : "Buku besar keuangan"} eyebrow={`${filtered.length} transaksi`} action={<button type="button" onClick={() => open()} className={primaryButton}><Plus size={15} />{expenses ? "Tambah pengeluaran" : "Tambah transaksi"}</button>}>
        <ResponsiveTable columns={[
          { key: "source", label: "Sumber" }, { key: "date", label: "Tanggal" }, { key: "type", label: "Jenis" },
          { key: "method", label: "Metode" }, { key: "amount", label: "Jumlah" }, { key: "status", label: "Status" }, { key: "actions", label: "Aksi", align: "right" },
        ]} rows={rows} empty="Tidak ada transaksi pada periode ini." />
      </Panel>
    </div>

    {editing && <CrudDialog title={isNew ? (expenses ? "Tambah pengeluaran" : "Tambah transaksi") : "Edit transaksi"} eyebrow="Buku besar keuangan" onClose={() => setEditing(null)}>
      <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
        <label className="col-span-2 text-[10px] font-extrabold uppercase mobile:col-span-1">Sumber atau keterangan<input value={editing.source} onChange={(event) => setEditing({ ...editing, source: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Tanggal<input type="date" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Jenis<select disabled={expenses} value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value as FinanceEntry["type"] })} className={`${fieldClass} mt-2 normal-case disabled:opacity-60`}><option>Pendapatan</option><option>Pengeluaran</option></select></label>
        <label className="text-[10px] font-extrabold uppercase">Metode<input value={editing.method} onChange={(event) => setEditing({ ...editing, method: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Jumlah<input type="number" min="1" value={editing.amount || ""} onChange={(event) => setEditing({ ...editing, amount: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as FinanceEntry["status"] })} className={`${fieldClass} mt-2 normal-case`}><option>Tercatat</option><option>Menunggu</option><option>Dibatalkan</option></select></label>
      </div>
      <p className="mt-4 min-h-5 text-[11px] font-bold text-[#a13b35]">{message}</p>
      <div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button><button type="button" onClick={save} className={primaryButton}>Simpan transaksi</button></div>
    </CrudDialog>}
  </>;
}
