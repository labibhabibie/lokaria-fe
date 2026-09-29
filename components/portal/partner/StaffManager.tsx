"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Panel, ResponsiveTable, SearchField, StatusBadge, fieldClass, primaryButton, secondaryButton } from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialStaff, type Staff } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

const emptyStaff = (): Staff => ({ id: "", name: "", email: "", role: "", shift: "", status: "Aktif" });

export function StaffManager() {
  const [staff, setStaff] = usePartnerStorage("lokaria-partner-staff", initialStaff);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Staff | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const shown = useMemo(
    () => staff.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(query.toLowerCase())),
    [query, staff],
  );

  const open = (item?: Staff) => {
    setIsNew(!item);
    setMessage("");
    setEditing(item ? { ...item } : emptyStaff());
  };
  const save = () => {
    if (!editing?.name.trim() || !editing.email.includes("@") || !editing.role.trim() || !editing.shift.trim()) {
      setMessage("Nama, email yang valid, peran, dan sif wajib diisi.");
      return;
    }
    if (isNew) setStaff((items) => [...items, { ...editing, id: `STF-${Date.now()}` }]);
    else setStaff((items) => items.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
  };
  const remove = (item: Staff) => {
    if (window.confirm(`Hapus akses staf ${item.name}?`)) setStaff((items) => items.filter((member) => member.id !== item.id));
  };

  const rows = shown.map((item) => ({
    id: item.id,
    name: <div><strong>{item.name}</strong><p className="mt-1 text-[9px] text-[#11111173]">{item.email}</p></div>,
    role: item.role,
    shift: item.shift,
    status: <StatusBadge>{item.status}</StatusBadge>,
    actions: <div className="flex justify-end gap-1">
      <button type="button" onClick={() => open(item)} title={`Edit ${item.name}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button>
      <button type="button" onClick={() => remove(item)} title={`Hapus ${item.name}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button>
    </div>,
  }));

  return <>
    <Panel title="Anggota tim" eyebrow={`${staff.length} akun`} action={<button type="button" onClick={() => open()} className={primaryButton}><Plus size={15} />Tambah staf</button>}>
      <div className="border-b border-line p-4"><SearchField value={query} onChange={setQuery} placeholder="Cari staf" /></div>
      <ResponsiveTable columns={[
        { key: "name", label: "Staf" }, { key: "role", label: "Peran" }, { key: "shift", label: "Sif" },
        { key: "status", label: "Status" }, { key: "actions", label: "Aksi", align: "right" },
      ]} rows={rows} empty="Staf tidak ditemukan." />
    </Panel>

    {editing && <CrudDialog title={isNew ? "Tambah staf" : "Edit staf"} eyebrow="Akses tim" onClose={() => setEditing(null)}>
      <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
        <label className="text-[10px] font-extrabold uppercase">Nama lengkap<input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Email<input type="email" value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Peran<input value={editing.role} onChange={(event) => setEditing({ ...editing, role: event.target.value })} className={`${fieldClass} mt-2 normal-case`} placeholder="Operasional" /></label>
        <label className="text-[10px] font-extrabold uppercase">Sif<input value={editing.shift} onChange={(event) => setEditing({ ...editing, shift: event.target.value })} className={`${fieldClass} mt-2 normal-case`} placeholder="08:00 - 16:00" /></label>
        <label className="text-[10px] font-extrabold uppercase">Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as Staff["status"] })} className={`${fieldClass} mt-2 normal-case`}><option>Aktif</option><option>Tidak bertugas</option><option>Nonaktif</option></select></label>
      </div>
      <p className="mt-4 min-h-5 text-[11px] font-bold text-[#a13b35]">{message}</p>
      <div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button><button type="button" onClick={save} className={primaryButton}>Simpan staf</button></div>
    </CrudDialog>}
  </>;
}
