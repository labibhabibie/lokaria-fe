"use client";

import { useMemo, useState } from "react";
import { Banknote, Boxes, ClipboardCheck, Pencil, Plus, Trash2 } from "lucide-react";
import { rupiah } from "@/content/site";
import { MetricCard, Panel, ResponsiveTable, SearchField, StatusBadge, fieldClass, primaryButton, secondaryButton } from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialInventory, type InventoryItem } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

const emptyItem = (): InventoryItem => ({ id: "", name: "", category: "", stock: 0, minimum: 0, price: 0 });

export function InventoryManager() {
  const [items, setItems] = usePartnerStorage("lokaria-partner-inventory", initialInventory);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const shown = useMemo(() => items.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const lowStock = items.filter((item) => item.stock <= item.minimum).length;
  const stockValue = items.reduce((total, item) => total + item.stock * item.price, 0);

  const open = (item?: InventoryItem) => {
    setIsNew(!item);
    setMessage("");
    setEditing(item ? { ...item } : emptyItem());
  };
  const save = () => {
    if (!editing?.name.trim() || !editing.category.trim() || editing.stock < 0 || editing.minimum < 0 || editing.price <= 0) {
      setMessage("Nama, kategori, jumlah stok, minimum, dan harga yang valid wajib diisi.");
      return;
    }
    if (isNew) setItems((value) => [...value, { ...editing, id: `INV-${Date.now()}` }]);
    else setItems((value) => value.map((item) => item.id === editing.id ? editing : item));
    setEditing(null);
  };
  const remove = (item: InventoryItem) => {
    if (window.confirm(`Hapus ${item.name} dari inventaris dan kasir?`)) setItems((value) => value.filter((product) => product.id !== item.id));
  };

  const rows = shown.map((item) => ({
    id: item.id,
    item: <div><strong>{item.name}</strong><p className="mt-1 text-[9px] text-[#11111173]">{item.id}</p></div>,
    category: item.category,
    price: rupiah(item.price),
    stock: `${item.stock} unit`,
    minimum: `${item.minimum} unit`,
    status: <StatusBadge>{item.stock <= item.minimum ? "Stok rendah" : "Aman"}</StatusBadge>,
    actions: <div className="flex justify-end gap-1"><button type="button" onClick={() => open(item)} title={`Edit ${item.name}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button><button type="button" onClick={() => remove(item)} title={`Hapus ${item.name}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button></div>,
  }));

  return <>
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <MetricCard label="Produk" value={String(items.length)} note={`${new Set(items.map((item) => item.category)).size} kategori`} icon={Boxes} />
        <MetricCard label="Stok rendah" value={String(lowStock)} note="Perlu ditambah" icon={ClipboardCheck} tone="warm" />
        <MetricCard label="Nilai stok" value={rupiah(stockValue)} note="Berdasarkan harga jual" icon={Banknote} tone="dark" />
      </div>
      <Panel title="Item inventaris" eyebrow={`${shown.length} ditampilkan`} action={<button type="button" onClick={() => open()} className={primaryButton}><Plus size={15} />Tambah item</button>}>
        <div className="border-b border-line p-4"><SearchField value={query} onChange={setQuery} placeholder="Cari inventaris" /></div>
        <ResponsiveTable columns={[
          { key: "item", label: "Item" }, { key: "category", label: "Kategori" }, { key: "price", label: "Harga jual" },
          { key: "stock", label: "Stok" }, { key: "minimum", label: "Minimum" }, { key: "status", label: "Status" },
          { key: "actions", label: "Aksi", align: "right" },
        ]} rows={rows} empty="Item inventaris tidak ditemukan." />
      </Panel>
    </div>

    {editing && <CrudDialog title={isNew ? "Tambah item" : "Edit item"} eyebrow="Inventaris dan produk kasir" onClose={() => setEditing(null)}>
      <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
        <label className="text-[10px] font-extrabold uppercase">Nama item<input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Kategori<input value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Stok<input type="number" min="0" value={editing.stock} onChange={(event) => setEditing({ ...editing, stock: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Batas minimum<input type="number" min="0" value={editing.minimum} onChange={(event) => setEditing({ ...editing, minimum: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Harga jual<input type="number" min="0" value={editing.price || ""} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
      </div>
      <p className="mt-4 min-h-5 text-[11px] font-bold text-[#a13b35]">{message}</p>
      <div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button><button type="button" onClick={save} className={primaryButton}>Simpan item</button></div>
    </CrudDialog>}
  </>;
}
