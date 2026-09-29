"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Minus, Pencil, Plus, Trash2, WalletCards } from "lucide-react";
import { rupiah } from "@/content/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { Panel, ResponsiveTable, StatusBadge, fieldClass, primaryButton, secondaryButton } from "../Primitives";
import { CrudDialog } from "./CrudDialog";
import { initialFinance, initialInventory, initialSales, type PosSale } from "./data";
import { usePartnerStorage } from "./usePartnerStorage";

function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function displayDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function PosManager() {
  const [products, setProducts] = usePartnerStorage("lokaria-partner-inventory", initialInventory);
  const [sales, setSales] = usePartnerStorage("lokaria-partner-sales", initialSales);
  const [, setFinance] = usePartnerStorage("lokaria-partner-finance", initialFinance);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [checkout, setCheckout] = useState(false);
  const [customer, setCustomer] = useState("Pengunjung umum");
  const [method, setMethod] = useState("QRIS");
  const [editing, setEditing] = useState<PosSale | null>(null);

  const cartProducts = products.filter((item) => (cart[item.id] ?? 0) > 0);
  const itemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const total = useMemo(() => products.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0), [cart, products]);

  const setQuantity = (id: string, quantity: number) => {
    const product = products.find((item) => item.id === id);
    setCart((current) => ({ ...current, [id]: Math.max(0, Math.min(quantity, product?.stock ?? 0)) }));
  };

  const completeSale = () => {
    if (!itemCount || !customer.trim()) return;
    const sale: PosSale = { id: `POS-${Date.now()}`, date: localDate(), customer: customer.trim(), itemCount, total, method, status: "Lunas" };
    setSales((items) => [sale, ...items]);
    setFinance((items) => [{ id: `TRX-${Date.now()}`, source: `Penjualan ${sale.id}`, date: sale.date, type: "Pendapatan", method: sale.method, amount: sale.total, status: "Tercatat" }, ...items]);
    setProducts((items) => items.map((item) => ({ ...item, stock: Math.max(0, item.stock - (cart[item.id] ?? 0)) })));
    setCart({});
    setCustomer("Pengunjung umum");
    setCheckout(false);
  };

  const saveSale = () => {
    if (!editing?.customer.trim() || editing.total <= 0) return;
    setSales((items) => items.map((item) => item.id === editing.id ? editing : item));
    setFinance((items) => items.map((item) => item.source === `Penjualan ${editing.id}` ? { ...item, date: editing.date, method: editing.method, amount: editing.total, status: editing.status === "Dibatalkan" ? "Dibatalkan" : "Tercatat" } : item));
    setEditing(null);
  };

  const removeSale = (sale: PosSale) => {
    if (window.confirm(`Hapus transaksi ${sale.id}? Stok tidak akan berubah.`)) {
      setSales((items) => items.filter((item) => item.id !== sale.id));
      setFinance((items) => items.filter((item) => item.source !== `Penjualan ${sale.id}`));
    }
  };

  const sendBill = () => {
    const lines = cartProducts.map((item) => `${cart[item.id]} x ${item.name} - ${rupiah(item.price * cart[item.id])}`);
    openWhatsApp([
      "*Tagihan LOKARIA*",
      `Pelanggan: ${customer || "Pengunjung umum"}`,
      "",
      ...lines,
      "",
      `*Total: ${rupiah(total)}*`,
      `Metode pembayaran: ${method}`,
    ].join("\n"));
  };

  const sendReceipt = (sale: PosSale) => {
    openWhatsApp([
      "*Struk Penjualan LOKARIA*",
      `Nomor: ${sale.id}`,
      `Tanggal: ${displayDate(sale.date)}`,
      `Pelanggan: ${sale.customer}`,
      `Jumlah: ${sale.itemCount} item`,
      `Metode: ${sale.method}`,
      `Status: ${sale.status}`,
      "",
      `*Total: ${rupiah(sale.total)}*`,
      "Terima kasih telah bertransaksi di LOKARIA.",
    ].join("\n"));
  };

  const sendSalesReport = () => {
    const paidSales = sales.filter((sale) => sale.status === "Lunas");
    const salesTotal = paidSales.reduce((sum, sale) => sum + sale.total, 0);
    openWhatsApp([
      "*Ringkasan Penjualan Kasir LOKARIA*",
      `Jumlah transaksi lunas: ${paidSales.length}`,
      `Total item terjual: ${paidSales.reduce((sum, sale) => sum + sale.itemCount, 0)}`,
      `*Total penjualan: ${rupiah(salesTotal)}*`,
      "",
      ...paidSales.slice(0, 12).map((sale) => `- ${sale.id} | ${displayDate(sale.date)} | ${rupiah(sale.total)}`),
      paidSales.length > 12 ? `...dan ${paidSales.length - 12} transaksi lainnya.` : "",
    ].filter(Boolean).join("\n"));
  };

  const saleRows = sales.map((sale) => ({
    id: sale.id,
    sale: <div><strong>{sale.id}</strong><p className="mt-1 text-[9px] text-[#11111173]">{sale.customer}</p></div>,
    date: displayDate(sale.date),
    items: `${sale.itemCount} item`,
    method: sale.method,
    total: rupiah(sale.total),
    status: <StatusBadge>{sale.status}</StatusBadge>,
    actions: <div className="flex justify-end gap-1"><button type="button" onClick={() => sendReceipt(sale)} title={`Kirim struk ${sale.id} ke WhatsApp`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#266d3e] hover:border-[#266d3e]"><MessageCircle size={14} /></button><button type="button" onClick={() => setEditing({ ...sale })} title={`Edit ${sale.id}`} className="grid size-9 cursor-pointer place-items-center border border-line hover:border-olive hover:text-olive"><Pencil size={14} /></button><button type="button" onClick={() => removeSale(sale)} title={`Hapus ${sale.id}`} className="grid size-9 cursor-pointer place-items-center border border-line text-[#8d332e] hover:border-[#8d332e]"><Trash2 size={14} /></button></div>,
  }));

  return <div className="space-y-5">
    <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-5 tablet:grid-cols-1">
      <Panel title="Produk" eyebrow="Pilih produk kasir">
        <div className="grid grid-cols-2 gap-3 p-5 mobile:grid-cols-1">
          {products.map((item) => (
            <button key={item.id} type="button" disabled={item.stock === 0} onClick={() => setQuantity(item.id, (cart[item.id] ?? 0) + 1)} className="cursor-pointer border border-line bg-white p-4 text-left hover:border-olive disabled:cursor-not-allowed disabled:opacity-45">
              <div className="flex items-center justify-between gap-3"><span className="text-[9px] text-[#11111173] uppercase">{item.category}</span><span className="text-[9px] font-bold text-olive">Stok {item.stock}</span></div>
              <strong className="mt-6 block text-[13px] uppercase">{item.name}</strong><span className="mt-2 block text-[11px] text-olive">{rupiah(item.price)}</span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Penjualan saat ini" eyebrow={`${itemCount} item`}>
        <div className="p-5">
          <div className="min-h-[190px] space-y-3">
            {cartProducts.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-b border-line pb-3 text-[11px]">
              <div className="min-w-0 flex-1"><p className="truncate font-bold">{item.name}</p><p className="mt-1 text-[#11111173]">{rupiah(item.price)} per item</p></div>
              <div className="flex items-center border border-line"><button type="button" onClick={() => setQuantity(item.id, cart[item.id] - 1)} title="Kurangi" className="grid size-9 cursor-pointer place-items-center"><Minus size={13} /></button><span className="grid size-9 place-items-center border-x border-line font-bold">{cart[item.id]}</span><button type="button" onClick={() => setQuantity(item.id, cart[item.id] + 1)} title="Tambah" className="grid size-9 cursor-pointer place-items-center"><Plus size={13} /></button></div>
            </div>)}
            {total === 0 && <p className="pt-14 text-center text-[11px] text-[#11111173]">Ketuk produk untuk menambahkannya.</p>}
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-line pt-5"><span className="text-[11px]">Total</span><strong className="text-[23px]">{rupiah(total)}</strong></div>
          <button type="button" disabled={total === 0} onClick={() => setCheckout(true)} className={`${primaryButton} mt-5 w-full`}><WalletCards size={16} />Lanjutkan pembayaran</button>
        </div>
      </Panel>
    </div>

    <Panel title="Riwayat penjualan" eyebrow={`${sales.length} transaksi`} action={<button type="button" onClick={sendSalesReport} className={secondaryButton}><MessageCircle size={15} />Kirim laporan WA</button>}>
      <ResponsiveTable columns={[
        { key: "sale", label: "Transaksi" }, { key: "date", label: "Tanggal" }, { key: "items", label: "Jumlah" },
        { key: "method", label: "Metode" }, { key: "total", label: "Total" }, { key: "status", label: "Status" }, { key: "actions", label: "Aksi", align: "right" },
      ]} rows={saleRows} />
    </Panel>

    {checkout && <CrudDialog title="Selesaikan penjualan" eyebrow="Pembayaran kasir" onClose={() => setCheckout(false)}>
      <div className="space-y-4 pt-6">
        <label className="block text-[10px] font-extrabold uppercase">Nama pelanggan<input value={customer} onChange={(event) => setCustomer(event.target.value)} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="block text-[10px] font-extrabold uppercase">Metode pembayaran<select value={method} onChange={(event) => setMethod(event.target.value)} className={`${fieldClass} mt-2 normal-case`}><option>QRIS</option><option>Tunai</option><option>Kartu</option><option>Transfer bank</option></select></label>
        <div className="flex items-end justify-between border-y border-line py-5"><span className="text-[11px]">{itemCount} item</span><strong className="text-[24px]">{rupiah(total)}</strong></div>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" onClick={sendBill} className={secondaryButton}><MessageCircle size={15} />Kirim tagihan ke WA</button><button type="button" onClick={() => setCheckout(false)} className={secondaryButton}>Batal</button><button type="button" onClick={completeSale} className={primaryButton}>Simpan transaksi</button></div>
    </CrudDialog>}

    {editing && <CrudDialog title="Edit transaksi" eyebrow={editing.id} onClose={() => setEditing(null)}>
      <div className="grid grid-cols-2 gap-4 pt-6 mobile:grid-cols-1">
        <label className="text-[10px] font-extrabold uppercase">Pelanggan<input value={editing.customer} onChange={(event) => setEditing({ ...editing, customer: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Tanggal<input type="date" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} className={`${fieldClass} mt-2 normal-case`} /></label>
        <label className="text-[10px] font-extrabold uppercase">Metode<select value={editing.method} onChange={(event) => setEditing({ ...editing, method: event.target.value })} className={`${fieldClass} mt-2 normal-case`}><option>QRIS</option><option>Tunai</option><option>Kartu</option><option>Transfer bank</option></select></label>
        <label className="text-[10px] font-extrabold uppercase">Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as PosSale["status"] })} className={`${fieldClass} mt-2 normal-case`}><option>Lunas</option><option>Dibatalkan</option></select></label>
        <label className="text-[10px] font-extrabold uppercase">Total<input type="number" min="1" value={editing.total} onChange={(event) => setEditing({ ...editing, total: Number(event.target.value) })} className={`${fieldClass} mt-2 normal-case`} /></label>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Batal</button><button type="button" onClick={saveSale} className={primaryButton}>Simpan transaksi</button></div>
    </CrudDialog>}
  </div>;
}
