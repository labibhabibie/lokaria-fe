"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { rupiah } from "@/content/site";
import {
  Panel,
  ResponsiveTable,
  SearchField,
  StatusBadge,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialCourts, type Court, type PricingRule } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

const emptyCourt = (): Court => ({
  id: "",
  name: "",
  type: "",
  status: "Aktif",
  basePrice: 0,
  pricingRules: [],
});

const emptyRule = (): PricingRule => ({
  id: `HRG-${Date.now()}`,
  name: "",
  appliesTo: "Hari kerja",
  startTime: "08:00",
  endTime: "22:00",
  price: 0,
});

export function CourtManager() {
  const [courts, setCourts] = usePartnerStorage("lokaria-partner-courts", initialCourts);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Court | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");

  const shown = useMemo(
    () => courts.filter((court) => `${court.name} ${court.type} ${court.status}`.toLowerCase().includes(query.toLowerCase())),
    [courts, query],
  );

  const openNew = () => {
    setIsNew(true);
    setMessage("");
    setEditing(emptyCourt());
  };

  const openEdit = (court: Court) => {
    setIsNew(false);
    setMessage("");
    setEditing(structuredClone(court));
  };

  const updateRule = (id: string, patch: Partial<PricingRule>) => {
    setEditing((court) => court ? {
      ...court,
      pricingRules: court.pricingRules.map((rule) => rule.id === id ? { ...rule, ...patch } : rule),
    } : court);
  };

  const save = () => {
    if (!editing?.name.trim() || !editing.type.trim() || editing.basePrice <= 0) {
      setMessage("Nama, tipe, dan harga dasar wajib diisi.");
      return;
    }
    const invalidRule = editing.pricingRules.some((rule) => !rule.name.trim() || rule.price <= 0);
    if (invalidRule) {
      setMessage("Setiap aturan harga harus memiliki nama dan harga.");
      return;
    }
    if (isNew) {
      setCourts((items) => [...items, { ...editing, id: `LAP-${Date.now()}` }]);
    } else {
      setCourts((items) => items.map((item) => item.id === editing.id ? editing : item));
    }
    setEditing(null);
  };

  const remove = (court: Court) => {
    if (window.confirm(`Hapus ${court.name}? Data harga lapangan juga akan dihapus.`)) {
      setCourts((items) => items.filter((item) => item.id !== court.id));
    }
  };

  const rows = shown.map((court) => ({
    id: court.id,
    name: <div><strong>{court.name}</strong><p className="mt-1 text-[9px] text-[#11111173]">{court.id}</p></div>,
    type: court.type,
    price: rupiah(court.basePrice),
    rules: `${court.pricingRules.length} aturan`,
    status: <StatusBadge>{court.status}</StatusBadge>,
    actions: (
      <div className="flex justify-end gap-1">
        <button type="button" onClick={() => openEdit(court)} title={`Edit ${court.name}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button>
        <button type="button" onClick={() => remove(court)} title={`Hapus ${court.name}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button>
      </div>
    ),
  }));

  return (
    <>
      <Panel
        title="Lapangan dan harga"
        eyebrow={`${courts.length} ruang dikelola`}
        action={<button type="button" onClick={openNew} className={primaryButton}><Plus size={15} />Tambah lapangan</button>}
      >
        <div className="border-b border-line p-4">
          <SearchField value={query} onChange={setQuery} placeholder="Cari lapangan" />
        </div>
        <ResponsiveTable
          columns={[
            { key: "name", label: "Lapangan" },
            { key: "type", label: "Tipe" },
            { key: "price", label: "Harga dasar" },
            { key: "rules", label: "Harga khusus" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Aksi", align: "right" },
          ]}
          rows={rows}
          empty="Lapangan tidak ditemukan."
        />
      </Panel>

      {editing && (
        <CrudDialog
          title={isNew ? "Tambah lapangan" : "Edit lapangan"}
          eyebrow="Lapangan dan aturan harga"
          onClose={() => setEditing(null)}
          wide
        >
          <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
            <label className="text-[10px] font-extrabold uppercase">Nama lapangan
              <input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className={`${fieldClass} mt-2 normal-case`} placeholder="Contoh: Lapangan 04" />
            </label>
            <label className="text-[10px] font-extrabold uppercase">Tipe
              <input value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value })} className={`${fieldClass} mt-2 normal-case`} placeholder="Dalam ruangan" />
            </label>
            <label className="text-[10px] font-extrabold uppercase">Harga dasar
              <input type="number" min="0" value={editing.basePrice || ""} onChange={(event) => setEditing({ ...editing, basePrice: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} />
            </label>
            <label className="text-[10px] font-extrabold uppercase">Status
              <select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as Court["status"] })} className={`${fieldClass} mt-2 normal-case`}>
                <option>Aktif</option><option>Pemeliharaan</option><option>Nonaktif</option>
              </select>
            </label>
          </div>

          <div className="mt-7 border-t border-line pt-6">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-[9px] font-extrabold tracking-label text-olive uppercase">Harga dinamis</p><h3 className="mt-1 text-[14px] font-extrabold uppercase">Aturan harga</h3></div>
              <button type="button" onClick={() => setEditing({ ...editing, pricingRules: [...editing.pricingRules, emptyRule()] })} className={secondaryButton}><Plus size={14} />Tambah aturan</button>
            </div>
            <div className="mt-4 space-y-3">
              {editing.pricingRules.map((rule) => (
                <div key={rule.id} className="grid grid-cols-[1.35fr_1fr_100px_100px_140px_40px] gap-2 border border-line bg-ivory-soft p-3 tablet:grid-cols-2 mobile:grid-cols-1">
                  <input aria-label="Nama aturan" value={rule.name} onChange={(event) => updateRule(rule.id, { name: event.target.value })} className={fieldClass} placeholder="Nama aturan" />
                  <select aria-label="Jenis hari" value={rule.appliesTo} onChange={(event) => updateRule(rule.id, { appliesTo: event.target.value as PricingRule["appliesTo"] })} className={fieldClass}><option>Hari kerja</option><option>Akhir pekan</option><option>Khusus</option></select>
                  <input aria-label="Jam mulai" type="time" value={rule.startTime} onChange={(event) => updateRule(rule.id, { startTime: event.target.value })} className={fieldClass} />
                  <input aria-label="Jam selesai" type="time" value={rule.endTime} onChange={(event) => updateRule(rule.id, { endTime: event.target.value })} className={fieldClass} />
                  <input aria-label="Harga aturan" type="number" min="0" value={rule.price || ""} onChange={(event) => updateRule(rule.id, { price: Number(event.target.value) })} className={fieldClass} placeholder="Harga" />
                  <button type="button" onClick={() => setEditing({ ...editing, pricingRules: editing.pricingRules.filter((item) => item.id !== rule.id) })} title="Hapus aturan" className="grid min-h-11 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button>
                </div>
              ))}
              {editing.pricingRules.length === 0 && <p className="border border-dashed border-line p-5 text-center text-[11px] text-[#11111173]">Belum ada harga khusus. Harga dasar akan digunakan untuk semua jadwal.</p>}
            </div>
          </div>

          <p className="mt-4 min-h-5 text-[11px] font-bold text-[#a13b35]">{message}</p>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button>
            <button type="button" onClick={save} className={primaryButton}>Simpan lapangan</button>
          </div>
        </CrudDialog>
      )}
    </>
  );
}
