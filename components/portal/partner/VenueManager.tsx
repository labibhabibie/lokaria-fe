"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Panel, ResponsiveTable, StatusBadge, fieldClass, primaryButton, secondaryButton } from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialVenues, type PartnerVenue } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

const emptyVenue = (): PartnerVenue => ({ id: "", name: "", city: "", address: "", spaceCount: 1, status: "Ditinjau" });

export function VenueManager() {
  const [venues, setVenues] = usePartnerStorage("lokaria-partner-venues", initialVenues);
  const [editing, setEditing] = useState<PartnerVenue | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const open = (venue?: PartnerVenue) => { setIsNew(!venue); setMessage(""); setEditing(venue ? { ...venue } : emptyVenue()); };
  const save = () => {
    if (!editing?.name.trim() || !editing.city.trim() || !editing.address.trim() || editing.spaceCount < 1) { setMessage("Nama, kota, alamat, dan jumlah ruang wajib diisi."); return; }
    if (isNew) setVenues((items) => [...items, { ...editing, id: `VNU-${Date.now()}` }]);
    else setVenues((items) => items.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
  };
  const remove = (venue: PartnerVenue) => { if (window.confirm(`Hapus venue ${venue.name}?`)) setVenues((items) => items.filter((item) => item.id !== venue.id)); };
  const rows = venues.map((venue) => ({
    id: venue.id,
    venue: <div><strong>{venue.name}</strong><p className="mt-1 text-[9px] text-[#11111173]">{venue.address}</p></div>,
    city: venue.city,
    spaces: `${venue.spaceCount} ruang`,
    status: <StatusBadge>{venue.status}</StatusBadge>,
    actions: <div className="flex justify-end gap-1"><button type="button" onClick={() => open(venue)} title={`Edit ${venue.name}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button><button type="button" onClick={() => remove(venue)} title={`Hapus ${venue.name}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button></div>,
  }));
  return <>
    <Panel title="Portofolio venue" eyebrow={`${venues.length} lokasi`} action={<button type="button" onClick={() => open()} className={primaryButton}><Plus size={15} />Tambah venue</button>}>
      <ResponsiveTable columns={[{ key: "venue", label: "Venue" }, { key: "city", label: "Kota" }, { key: "spaces", label: "Ruang" }, { key: "status", label: "Status" }, { key: "actions", label: "Aksi", align: "right" }]} rows={rows} />
    </Panel>
    {editing && <CrudDialog title={isNew ? "Tambah venue" : "Edit venue"} eyebrow="Portofolio venue" onClose={() => setEditing(null)}>
      <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
        <label className="col-span-2 text-[10px] font-extrabold uppercase mobile:col-span-1">Nama venue<input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Kota<input value={editing.city} onChange={(event) => setEditing({ ...editing, city: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Jumlah ruang<input type="number" min="1" value={editing.spaceCount} onChange={(event) => setEditing({ ...editing, spaceCount: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="col-span-2 text-[10px] font-extrabold uppercase mobile:col-span-1">Alamat<input value={editing.address} onChange={(event) => setEditing({ ...editing, address: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as PartnerVenue["status"] })} className={`${fieldClass} mt-2 normal-case`}><option>Aktif</option><option>Ditinjau</option><option>Nonaktif</option></select></label>
      </div>
      <p className="mt-4 min-h-5 text-[11px] font-bold text-[#a13b35]">{message}</p>
      <div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button><button type="button" onClick={save} className={primaryButton}>Simpan venue</button></div>
    </CrudDialog>}
  </>;
}
