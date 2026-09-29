"use client";

import { useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Plus,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { partnerBookings, scheduleSlots } from "@/mock/portal";
import { BookingManager } from "./partner/BookingManager";
import { CourtManager } from "./partner/CourtManager";
import { FinanceManager } from "./partner/FinanceManager";
import { InventoryManager } from "./partner/InventoryManager";
import { PosManager } from "./partner/PosManager";
import { StaffManager } from "./partner/StaffManager";
import { VenueManager } from "./partner/VenueManager";
import { initialInventory } from "./partner/data";
import { usePartnerStorage } from "./partner/usePartnerStorage";
import {
  MetricCard,
  MiniBars,
  Panel,
  ResponsiveTable,
  StatusBadge,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "./Primitives";

function Dashboard() {
  const bookingRows = partnerBookings.slice(0, 4).map((booking) => ({
    id: booking.id,
    customer: booking.customer,
    schedule: `${booking.date}, ${booking.time}`,
    space: booking.space,
    total: booking.total,
    status: <StatusBadge>{booking.status}</StatusBadge>,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3 tablet:grid-cols-2 mobile:grid-cols-1">
        <MetricCard
          label="Pendapatan hari ini"
          value="Rp 4,8 jt"
          note="+12,4% dari Minggu lalu"
          icon={CircleDollarSign}
          tone="dark"
        />
        <MetricCard label="Pemesanan" value="18" note="12 terkonfirmasi, 3 menunggu" icon={CalendarDays} />
        <MetricCard label="Keterisian" value="74%" note="Jam tersibuk pukul 19.00" icon={TrendingUp} />
        <MetricCard label="Penjualan POS" value="Rp 826 rb" note="31 item terjual hari ini" icon={ShoppingCart} tone="warm" />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5 tablet:grid-cols-1">
        <Panel title="Pendapatan minggu ini" eyebrow="Performa venue">
          <div className="p-5">
            <MiniBars values={[43, 58, 50, 74, 63, 89, 76]} />
            <div className="mt-3 grid grid-cols-7 text-center text-[9px] text-[#11111173]">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Jadwal hari ini" eyebrow="6 aktivitas">
          <div className="divide-y divide-line">
            {scheduleSlots.slice(0, 5).map((slot) => (
              <div key={`${slot.time}-${slot.court}`} className="flex items-center gap-4 px-5 py-3">
                <strong className="w-11 text-[11px]">{slot.time}</strong>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold">{slot.label}</p>
                  <p className="mt-0.5 text-[9px] text-[#11111173]">{slot.court}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Pemesanan terbaru" eyebrow="Operasional langsung">
        <ResponsiveTable
          columns={[
            { key: "id", label: "Pemesanan" },
            { key: "customer", label: "Pelanggan" },
            { key: "schedule", label: "Jadwal" },
            { key: "space", label: "Ruang" },
            { key: "total", label: "Total", align: "right" },
            { key: "status", label: "Status", align: "right" },
          ]}
          rows={bookingRows}
        />
      </Panel>
    </div>
  );
}

function Calendar() {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const monthDays = Array.from({ length: 35 }, (_, index) => index - 1);
  return (
    <Panel
      title="Jadwal mingguan"
      eyebrow="27 Sep - 3 Oct 2026"
      action={<button className={secondaryButton}><Plus size={15} />Blokir waktu</button>}
    >
      <div className="overflow-x-auto p-5 mobile:hidden">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[70px_repeat(7,1fr)] border-t border-l border-line">
            <div className="border-r border-b border-line bg-ivory-soft" />
            {["Min 27", "Sen 28", "Sel 29", "Rab 30", "Kam 01", "Jum 02", "Sab 03"].map(
              (day) => (
                <div key={day} className="border-r border-b border-line bg-ivory-soft p-3 text-center text-[10px] font-extrabold uppercase">
                  {day}
                </div>
              ),
            )}
            {hours.flatMap((hour, row) => [
              <div key={`hour-${hour}`} className="border-r border-b border-line p-3 text-[9px] font-bold text-[#11111173]">{hour}</div>,
              ...Array.from({ length: 7 }, (_, day) => {
                const busy = (row + day) % 3 === 0;
                return (
                  <div key={`${hour}-${day}`} className="min-h-16 border-r border-b border-line p-1.5">
                    {busy && (
                      <div className="h-full bg-[#535b4014] p-2 text-[9px] font-bold text-olive">
                        Dipesan<br />Lapangan {(day % 3) + 1}
                      </div>
                    )}
                  </div>
                );
              }),
            ])}
          </div>
        </div>
      </div>
      <div className="hidden p-3 mobile:block">
        <div className="grid grid-cols-7 border-t border-l border-line">
          {["M", "S", "S", "R", "K", "J", "S"].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="grid aspect-square place-items-center border-r border-b border-line bg-ivory-soft text-[9px] font-extrabold"
            >
              {day}
            </div>
          ))}
          {monthDays.map((day, index) => {
            const visible = day > 0 && day <= 30;
            const selected = day === 28;
            const hasBooking = visible && [3, 8, 12, 18, 22, 27, 28, 30].includes(day);
            return (
              <button
                key={`${day}-${index}`}
                type="button"
                disabled={!visible}
                className={`relative grid aspect-square place-items-center border-r border-b border-line text-[10px] font-bold ${
                  selected ? "bg-olive text-white" : "bg-white"
                }`}
              >
                {visible ? day : ""}
                {hasBooking && (
                  <span
                    className={`absolute bottom-1 size-1 rounded-full ${selected ? "bg-beige" : "bg-olive"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-4 border border-line bg-ivory-soft p-3">
          <p className="text-[9px] font-extrabold tracking-label text-olive uppercase">
            Senin, 28 September
          </p>
          <div className="mt-3 space-y-2">
            {scheduleSlots.slice(0, 3).map((slot) => (
              <div
                key={`${slot.time}-${slot.court}`}
                className="flex items-center justify-between gap-3 bg-white p-3 text-[10px]"
              >
                <strong>{slot.time}</strong>
                <span className="min-w-0 flex-1 truncate">{slot.label}</span>
                <span className="text-[#11111173]">{slot.court}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function StockMovement({ mode }: { mode: "in" | "out" | "opname" }) {
  const [items, setItems] = usePartnerStorage("lokaria-partner-inventory", initialInventory);
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const title = mode === "in" ? "Catat stok masuk" : mode === "out" ? "Catat stok keluar" : "Stok opname";
  const selected = items.find((item) => item.id === itemId) ?? items[0];
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-5 tablet:grid-cols-1">
      <Panel title={title} eyebrow="Pergerakan inventaris">
        <form
          className="grid grid-cols-2 gap-4 p-5 mobile:grid-cols-1"
          onSubmit={(event) => {
            event.preventDefault();
            if (!selected || quantity < 0 || (mode !== "opname" && quantity < 1)) return;
            if (mode === "out" && quantity > selected.stock) {
              setMessage("Jumlah stok keluar melebihi stok yang tersedia.");
              return;
            }
            const nextStock = mode === "in" ? selected.stock + quantity : mode === "out" ? selected.stock - quantity : quantity;
            setItems((current) => current.map((item) => item.id === selected.id ? { ...item, stock: nextStock } : item));
            setMessage(`Stok ${selected.name} berhasil diperbarui menjadi ${nextStock} unit.`);
          }}
        >
          <label className="text-[10px] font-extrabold uppercase">
            Produk
            <select value={selected?.id ?? ""} onChange={(event) => { setItemId(event.target.value); setMessage(""); }} className={`${fieldClass} mt-2 normal-case`}>
              {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            {mode === "opname" ? "Jumlah fisik" : "Jumlah"}
            <input type="number" min={mode === "opname" ? "0" : "1"} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Tanggal
            <input type="date" defaultValue={today} className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Referensi
            <input className={`${fieldClass} mt-2 normal-case`} placeholder="Faktur atau catatan" />
          </label>
          <label className="col-span-2 text-[10px] font-extrabold uppercase mobile:col-span-1">
            Catatan
            <textarea className={`${fieldClass} mt-2 min-h-24 resize-y py-3 normal-case`} />
          </label>
          <div className="col-span-2 flex items-center justify-between gap-4 mobile:col-span-1">
            <p className={`text-[10px] font-bold ${message.includes("melebihi") ? "text-[#8d332e]" : "text-[#266d3e]"}`}>{message}</p>
            <button className={primaryButton} type="submit">Simpan pergerakan</button>
          </div>
        </form>
      </Panel>
      <Panel title="Stok saat ini" eyebrow="Produk terpilih">
        <div className="p-6">
          <p className="text-[11px] text-[#11111173]">{selected?.name ?? "Tidak ada produk"}</p>
          <p className="mt-2 text-[42px] font-extrabold">{selected?.stock ?? 0}</p>
          <p className="mt-1 text-[10px] text-[#11111173]">unit tersedia</p>
          <div className="mt-6 border-t border-line pt-5 text-[11px] leading-6">
            <p>Batas minimum: {selected?.minimum ?? 0}</p><p>Harga jual: {selected ? `Rp ${selected.price.toLocaleString("id-ID")}` : "-"}</p><p>Diperbarui: hari ini</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function PartnerWorkspace({ path }: { path: string }) {
  if (path === "/partner") return <Dashboard />;
  if (path === "/partner/bookings") return <BookingManager />;
  if (path === "/partner/calendar") return <Calendar />;
  if (path === "/partner/venues") return <VenueManager />;
  if (path === "/partner/courts") return <CourtManager />;
  if (path === "/partner/staff") return <StaffManager />;
  if (path === "/partner/inventory") return <InventoryManager />;
  if (path === "/partner/inventory/stock-in") return <StockMovement mode="in" />;
  if (path === "/partner/inventory/stock-out") return <StockMovement mode="out" />;
  if (path === "/partner/inventory/stock-opname") return <StockMovement mode="opname" />;
  if (path === "/partner/pos") return <PosManager />;
  if (path === "/partner/finance") return <FinanceManager />;
  if (path === "/partner/expenses") return <FinanceManager expenses />;
  return <Dashboard />;
}
