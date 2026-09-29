"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  BookOpenCheck,
  Building2,
  CircleDollarSign,
  Download,
  HandCoins,
  Plus,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import {
  adminCustomers,
  adminPartners,
  adminPayments,
  adminPromotions,
  adminRefunds,
  partnerBookings,
} from "@/mock/portal";
import {
  MetricCard,
  MiniBars,
  Panel,
  ResponsiveTable,
  SearchField,
  StatusBadge,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "./Primitives";

function Dashboard() {
  const paymentRows = adminPayments.slice(0, 4).map((payment) => ({
    ...payment,
    status: <StatusBadge>{payment.status}</StatusBadge>,
  }));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3 tablet:grid-cols-2 mobile:grid-cols-1">
        <MetricCard
          label="Nilai pemesanan kotor"
          value="Rp 1,84 M"
          note="+18,2% dibanding bulan lalu"
          icon={CircleDollarSign}
          tone="dark"
        />
        <MetricCard label="Pemesanan" value="6.482" note="91% berhasil dibayar" icon={BookOpenCheck} />
        <MetricCard label="Venue aktif" value="248" note="12 menunggu ditinjau" icon={Building2} />
        <MetricCard label="Pelanggan" value="18,6 rb" note="1.204 baru bulan ini" icon={UsersRound} tone="warm" />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5 tablet:grid-cols-1">
        <Panel title="Aktivitas platform" eyebrow="7 hari terakhir">
          <div className="p-5">
            <MiniBars values={[48, 54, 67, 62, 75, 94, 86]} />
            <div className="mt-3 grid grid-cols-7 text-center text-[9px] text-[#11111173]">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Perlu perhatian" eyebrow="Antrean operasional">
          <div className="divide-y divide-line">
            {[
              ["Verifikasi mitra", "4 menunggu"],
              ["Moderasi venue", "8 menunggu"],
              ["Permintaan pengembalian dana", "3 terbuka"],
              ["Pembayaran tidak cocok", "2 ditandai"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="text-[11px] font-bold">{label}</span>
                <StatusBadge>{value}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Pembayaran terbaru" eyebrow="Pemantauan transaksi">
        <ResponsiveTable
          columns={[
            { key: "id", label: "Pembayaran" },
            { key: "booking", label: "Pemesanan" },
            { key: "customer", label: "Pelanggan" },
            { key: "channel", label: "Kanal" },
            { key: "amount", label: "Jumlah", align: "right" },
            { key: "status", label: "Status", align: "right" },
          ]}
          rows={paymentRows}
        />
      </Panel>
    </div>
  );
}

type EntityKind = "customers" | "partners" | "venues" | "bookings" | "payments" | "refunds" | "promotions";

function EntityList({ kind }: { kind: EntityKind }) {
  const [query, setQuery] = useState("");
  const configs = {
    customers: {
      title: "Pelanggan",
      eyebrow: "Akun platform",
      action: "Ekspor pelanggan",
      columns: ["Pelanggan", "Email", "Pemesanan", "Bergabung", "Status"],
      rows: adminCustomers.map((item) => [
        item.name,
        item.email,
        item.bookings,
        item.joined,
        item.status,
      ]),
    },
    partners: {
      title: "Mitra",
      eyebrow: "Verifikasi dan akses",
      action: "Undang mitra",
      columns: ["Mitra", "Pemilik", "Venue", "Kota", "Status"],
      rows: adminPartners.map((item) => [
        item.name,
        item.owner,
        item.venues,
        item.city,
        item.status,
      ]),
    },
    venues: {
      title: "Moderasi venue",
      eyebrow: "Daftar dan kualitas",
      action: "Tambah venue",
      columns: ["Venue", "Kategori", "Mitra", "Kota", "Status"],
      rows: [
        ["PIK Padel Club", "Padel", "PT Arena Bersama", "Jakarta", "Terverifikasi"],
        ["GOR Cempaka", "Bulu Tangkis", "Cempaka Sports", "Jakarta", "Terverifikasi"],
        ["Braga Studio", "Musik", "Braga Creative", "Bandung", "Ditinjau"],
        ["Kolam Sleman", "Memancing", "Sleman Leisure", "Yogyakarta", "Ditinjau"],
      ],
    },
    bookings: {
      title: "Semua pemesanan",
      eyebrow: "Pemantauan platform",
      action: "Ekspor pemesanan",
      columns: ["Pemesanan", "Pelanggan", "Ruang venue", "Jadwal", "Status"],
      rows: partnerBookings.map((item) => [
        item.id,
        item.customer,
        item.space,
        `${item.date}, ${item.time}`,
        item.status,
      ]),
    },
    payments: {
      title: "Pembayaran",
      eyebrow: "Rekonsiliasi penyedia pembayaran",
      action: "Ekspor pembayaran",
      columns: ["Pembayaran", "Pemesanan", "Pelanggan", "Jumlah", "Status"],
      rows: adminPayments.map((item) => [
        item.id,
        item.booking,
        item.customer,
        item.amount,
        item.status,
      ]),
    },
    refunds: {
      title: "Permintaan pengembalian dana",
      eyebrow: "Antrean tinjauan",
      action: "Ekspor pengembalian dana",
      columns: ["Pengembalian Dana", "Pemesanan", "Pemohon", "Jumlah", "Status"],
      rows: adminRefunds.map((item) => [
        item.id,
        item.booking,
        item.requester,
        item.amount,
        item.status,
      ]),
    },
    promotions: {
      title: "Promosi",
      eyebrow: "Pengelolaan kampanye",
      action: "Buat promosi",
      columns: ["Kode", "Manfaat", "Penggunaan", "Periode", "Status"],
      rows: adminPromotions.map((item) => [
        item.code,
        item.benefit,
        item.usage,
        item.period,
        item.status,
      ]),
    },
  } as const;
  const config = configs[kind];
  const shown = useMemo(
    () =>
      config.rows.filter((row) =>
        row.join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [config.rows, query],
  );
  const rows = shown.map((row, index) => ({
    id: `${kind}-${index}`,
    first: row[0],
    second: row[1],
    third: row[2],
    fourth: row[3],
    fifth: <StatusBadge>{row[4]}</StatusBadge>,
  }));
  return (
    <Panel
      title={config.title}
      eyebrow={`${shown.length} hasil - ${config.eyebrow}`}
      action={
        <button className={primaryButton}>
          {kind === "promotions" || kind === "partners" || kind === "venues" ? (
            <Plus size={15} />
          ) : (
            <Download size={15} />
          )}
          {config.action}
        </button>
      }
    >
      <div className="border-b border-line p-4">
        <SearchField value={query} onChange={setQuery} placeholder={`Cari ${config.title.toLowerCase()}`} />
      </div>
      <ResponsiveTable
        columns={[
          { key: "first", label: config.columns[0] },
          { key: "second", label: config.columns[1] },
          { key: "third", label: config.columns[2] },
          { key: "fourth", label: config.columns[3] },
          { key: "fifth", label: config.columns[4], align: "right" },
        ]}
        rows={rows}
        empty="Tidak ada data yang sesuai dengan pencarian ini."
      />
    </Panel>
  );
}

function Reports() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <MetricCard label="Pendapatan platform" value="Rp 128 jt" note="Pendapatan bersih September" icon={Banknote} tone="dark" />
        <MetricCard label="Tingkat komisi" value="7,2%" note="Dari semua pemesanan berbayar" icon={HandCoins} />
        <MetricCard label="Tingkat pengembalian dana" value="1,8%" note="Turun 0,4% bulan ini" icon={TrendingUp} tone="warm" />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5 tablet:grid-cols-1">
        <Panel
          title="Nilai pemesanan kotor"
          eyebrow="Perbandingan bulanan"
          action={<button className={secondaryButton}><Download size={15} />Ekspor</button>}
        >
          <div className="p-5"><MiniBars values={[40, 55, 49, 64, 70, 82, 88, 78, 96]} /></div>
        </Panel>
        <Panel title="Komposisi kategori" eyebrow="Berdasarkan nilai pemesanan">
          <div className="space-y-5 p-5">
            {[
              ["Padel", "34%"],
              ["Sepak Bola", "28%"],
              ["Bulu Tangkis", "16%"],
              ["Lainnya", "22%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-[10px] font-bold"><span>{label}</span><span>{value}</span></div>
                <div className="h-2 bg-stone"><div className="h-full bg-olive" style={{ width: value }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-5 tablet:grid-cols-1">
      <Panel title="Pengaturan" eyebrow="Platform">
        <nav className="p-2">
          {["Umum", "Kebijakan pemesanan", "Pembayaran", "Notifikasi", "Akses"].map(
            (item, index) => (
              <button
                key={item}
                type="button"
                className={`w-full cursor-pointer rounded-field px-3 py-3 text-left text-[11px] font-bold ${index === 0 ? "bg-olive text-white" : "hover:bg-ivory"}`}
              >
                {item}
              </button>
            ),
          )}
        </nav>
      </Panel>
      <Panel title="Pengaturan umum" eyebrow="Identitas platform">
        <form
          className="grid grid-cols-2 gap-4 p-5 mobile:grid-cols-1"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <label className="text-[10px] font-extrabold uppercase">
            Nama platform
            <input defaultValue="LOKARIA" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Email bantuan
            <input defaultValue="support@lokaria.id" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Komisi bawaan
            <input type="number" defaultValue="7" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Zona waktu bawaan
            <select className={`${fieldClass} mt-2 normal-case`}><option>Asia/Jakarta</option></select>
          </label>
          <div className="col-span-2 flex items-center justify-between border-t border-line pt-5 mobile:col-span-1">
            <p className="text-[10px] font-bold text-[#266d3e]">{saved ? "Pengaturan disimpan secara lokal." : ""}</p>
            <button type="submit" className={primaryButton}><ShieldCheck size={15} />Simpan pengaturan</button>
          </div>
        </form>
      </Panel>
    </div>
  );
}

export function AdminWorkspace({ path }: { path: string }) {
  if (path === "/admin") return <Dashboard />;
  if (path === "/admin/customers") return <EntityList kind="customers" />;
  if (path === "/admin/partners") return <EntityList kind="partners" />;
  if (path === "/admin/venues") return <EntityList kind="venues" />;
  if (path === "/admin/bookings") return <EntityList kind="bookings" />;
  if (path === "/admin/payments") return <EntityList kind="payments" />;
  if (path === "/admin/refunds") return <EntityList kind="refunds" />;
  if (path === "/admin/promotions") return <EntityList kind="promotions" />;
  if (path === "/admin/reports") return <Reports />;
  if (path === "/admin/settings") return <Settings />;
  return <Dashboard />;
}
