"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { rupiah } from "@/content/site";
import { Panel, ResponsiveTable, SearchField, StatusBadge, fieldClass, primaryButton, secondaryButton } from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialCourts, initialPartnerBookings, type PartnerBooking } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

const emptyBooking = (): PartnerBooking => ({ id: "", customer: "", space: "Lapangan 01", date: "", startTime: "08:00", endTime: "09:00", total: 0, status: "Menunggu" });

function displayDate(value: string) {
  return value ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "-";
}

export function BookingManager() {
  const [bookings, setBookings] = usePartnerStorage("lokaria-partner-bookings", initialPartnerBookings);
  const [courts] = usePartnerStorage("lokaria-partner-courts", initialCourts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua status");
  const [editing, setEditing] = useState<PartnerBooking | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const shown = useMemo(() => bookings.filter((booking) => (status === "Semua status" || booking.status === status) && `${booking.id} ${booking.customer} ${booking.space}`.toLowerCase().includes(query.toLowerCase())), [bookings, query, status]);
  const open = (booking?: PartnerBooking) => { setIsNew(!booking); setMessage(""); setEditing(booking ? { ...booking } : { ...emptyBooking(), space: courts[0]?.name ?? "" }); };
  const save = () => {
    if (!editing?.customer.trim() || !editing.space || !editing.date || editing.total <= 0 || editing.startTime >= editing.endTime) { setMessage("Lengkapi pelanggan, lapangan, tanggal, waktu, dan total dengan benar."); return; }
    if (isNew) setBookings((items) => [{ ...editing, id: `LKR-${Date.now()}` }, ...items]);
    else setBookings((items) => items.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
  };
  const remove = (booking: PartnerBooking) => { if (window.confirm(`Hapus pemesanan ${booking.id}?`)) setBookings((items) => items.filter((item) => item.id !== booking.id)); };
  const rows = shown.map((booking) => ({
    id: booking.id,
    booking: <strong>{booking.id}</strong>,
    customer: booking.customer,
    space: booking.space,
    schedule: `${displayDate(booking.date)}, ${booking.startTime}-${booking.endTime}`,
    total: rupiah(booking.total),
    status: <StatusBadge>{booking.status}</StatusBadge>,
    actions: <div className="flex justify-end gap-1"><button type="button" onClick={() => open(booking)} title={`Edit ${booking.id}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button><button type="button" onClick={() => remove(booking)} title={`Hapus ${booking.id}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button></div>,
  }));
  return <>
    <Panel title="Pengelolaan pemesanan" eyebrow={`${shown.length} hasil`} action={<button type="button" onClick={() => open()} className={primaryButton}><Plus size={15} />Pemesanan manual</button>}>
      <div className="flex gap-2 border-b border-line p-4 mobile:flex-col"><SearchField value={query} onChange={setQuery} placeholder="Cari pemesanan" /><select value={status} onChange={(event) => setStatus(event.target.value)} className={`${fieldClass} max-w-[190px] mobile:max-w-none`}><option>Semua status</option><option>Terkonfirmasi</option><option>Menunggu</option><option>Selesai</option><option>Dibatalkan</option></select></div>
      <ResponsiveTable columns={[{ key: "booking", label: "Pemesanan" }, { key: "customer", label: "Pelanggan" }, { key: "space", label: "Lapangan" }, { key: "schedule", label: "Jadwal" }, { key: "total", label: "Total" }, { key: "status", label: "Status" }, { key: "actions", label: "Aksi", align: "right" }]} rows={rows} empty="Tidak ada pemesanan yang sesuai dengan filter." />
    </Panel>
    {editing && <CrudDialog title={isNew ? "Pemesanan manual" : "Edit pemesanan"} eyebrow="Operasional venue" onClose={() => setEditing(null)}>
      <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
        <label className="col-span-2 text-[10px] font-extrabold uppercase mobile:col-span-1">Nama pelanggan<input value={editing.customer} onChange={(event) => setEditing({ ...editing, customer: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Lapangan<select value={editing.space} onChange={(event) => setEditing({ ...editing, space: event.target.value })} className={`${fieldClass} mt-2 normal-case`}>{courts.map((court) => <option key={court.id}>{court.name}</option>)}</select></label>
        <label className="text-[10px] font-extrabold uppercase">Tanggal<input type="date" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Mulai<input type="time" value={editing.startTime} onChange={(event) => setEditing({ ...editing, startTime: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Selesai<input type="time" value={editing.endTime} onChange={(event) => setEditing({ ...editing, endTime: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Total<input type="number" min="1" value={editing.total || ""} onChange={(event) => setEditing({ ...editing, total: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as PartnerBooking["status"] })} className={`${fieldClass} mt-2 normal-case`}><option>Terkonfirmasi</option><option>Menunggu</option><option>Selesai</option><option>Dibatalkan</option></select></label>
      </div>
      <p className="mt-4 min-h-5 text-[11px] font-bold text-[#a13b35]">{message}</p><div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button><button type="button" onClick={save} className={primaryButton}>Simpan pemesanan</button></div>
    </CrudDialog>}
  </>;
}
