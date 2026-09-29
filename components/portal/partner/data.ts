export type PricingRule = {
  id: string;
  name: string;
  appliesTo: "Hari kerja" | "Akhir pekan" | "Khusus";
  startTime: string;
  endTime: string;
  price: number;
};

export type PartnerVenue = {
  id: string;
  name: string;
  city: string;
  address: string;
  spaceCount: number;
  status: "Aktif" | "Ditinjau" | "Nonaktif";
};

export type PartnerBooking = {
  id: string;
  customer: string;
  space: string;
  date: string;
  startTime: string;
  endTime: string;
  total: number;
  status: "Terkonfirmasi" | "Menunggu" | "Selesai" | "Dibatalkan";
};

export type Court = {
  id: string;
  name: string;
  type: string;
  status: "Aktif" | "Pemeliharaan" | "Nonaktif";
  basePrice: number;
  pricingRules: PricingRule[];
};

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: string;
  shift: string;
  status: "Aktif" | "Tidak bertugas" | "Nonaktif";
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  minimum: number;
  price: number;
};

export type PosSale = {
  id: string;
  date: string;
  customer: string;
  itemCount: number;
  total: number;
  method: string;
  status: "Lunas" | "Dibatalkan";
};

export type FinanceEntry = {
  id: string;
  source: string;
  date: string;
  type: "Pendapatan" | "Pengeluaran";
  method: string;
  amount: number;
  status: "Tercatat" | "Menunggu" | "Dibatalkan";
};

export const initialCourts: Court[] = [
  {
    id: "LAP-01",
    name: "Lapangan 01",
    type: "Panoramik dalam ruangan",
    status: "Aktif",
    basePrice: 300000,
    pricingRules: [
      { id: "HRG-01", name: "Pagi hari kerja", appliesTo: "Hari kerja", startTime: "08:00", endTime: "16:00", price: 250000 },
      { id: "HRG-02", name: "Jam utama", appliesTo: "Hari kerja", startTime: "16:00", endTime: "22:00", price: 350000 },
      { id: "HRG-03", name: "Akhir pekan", appliesTo: "Akhir pekan", startTime: "08:00", endTime: "22:00", price: 400000 },
    ],
  },
  {
    id: "LAP-02",
    name: "Lapangan 02",
    type: "Luar ruangan",
    status: "Aktif",
    basePrice: 300000,
    pricingRules: [
      { id: "HRG-04", name: "Hari kerja", appliesTo: "Hari kerja", startTime: "08:00", endTime: "22:00", price: 300000 },
      { id: "HRG-05", name: "Akhir pekan", appliesTo: "Akhir pekan", startTime: "08:00", endTime: "22:00", price: 375000 },
    ],
  },
  {
    id: "LAP-03",
    name: "Lapangan 03",
    type: "Kompetisi",
    status: "Pemeliharaan",
    basePrice: 350000,
    pricingRules: [],
  },
];

export const initialVenues: PartnerVenue[] = [
  { id: "VNU-01", name: "PIK Padel Club", city: "Jakarta", address: "Pantai Indah Kapuk, Jakarta Utara", spaceCount: 4, status: "Aktif" },
  { id: "VNU-02", name: "Senopati Padel House", city: "Jakarta", address: "Senopati, Jakarta Selatan", spaceCount: 3, status: "Ditinjau" },
];

export const initialPartnerBookings: PartnerBooking[] = [
  { id: "LKR-25041", customer: "Alya Putri", space: "Lapangan 01", date: "2026-09-27", startTime: "09:00", endTime: "10:00", total: 300000, status: "Terkonfirmasi" },
  { id: "LKR-25042", customer: "Raka Mahendra", space: "Lapangan 02", date: "2026-09-27", startTime: "10:00", endTime: "11:00", total: 300000, status: "Menunggu" },
  { id: "LKR-25043", customer: "Nadia Permata", space: "Lapangan 01", date: "2026-09-27", startTime: "12:00", endTime: "13:00", total: 300000, status: "Terkonfirmasi" },
  { id: "LKR-25044", customer: "Dimas Ardi", space: "Lapangan 03", date: "2026-09-27", startTime: "15:00", endTime: "16:00", total: 350000, status: "Selesai" },
  { id: "LKR-25045", customer: "Niko Tan", space: "Lapangan 02", date: "2026-09-28", startTime: "08:00", endTime: "09:00", total: 300000, status: "Terkonfirmasi" },
];

export const initialStaff: Staff[] = [
  { id: "STF-01", name: "Nanda Pratama", email: "nanda@lokaria.id", role: "Manajer Venue", shift: "07:00 - 15:00", status: "Aktif" },
  { id: "STF-02", name: "Siti Amalia", email: "siti@lokaria.id", role: "Meja Layanan", shift: "09:00 - 17:00", status: "Aktif" },
  { id: "STF-03", name: "Fajar Rizki", email: "fajar@lokaria.id", role: "Operasional", shift: "15:00 - 23:00", status: "Tidak bertugas" },
  { id: "STF-04", name: "Maya Lestari", email: "maya@lokaria.id", role: "Keuangan", shift: "08:00 - 16:00", status: "Aktif" },
];

export const initialInventory: InventoryItem[] = [
  { id: "INV-001", name: "Tabung Bola Padel", category: "Peralatan", stock: 24, minimum: 10, price: 95000 },
  { id: "INV-002", name: "Air Mineral 600 ml", category: "Minuman", stock: 8, minimum: 20, price: 8000 },
  { id: "INV-003", name: "Grip Tape", category: "Peralatan", stock: 15, minimum: 8, price: 45000 },
  { id: "INV-004", name: "Minuman Isotonik", category: "Minuman", stock: 31, minimum: 15, price: 15000 },
  { id: "INV-005", name: "Sewa Raket", category: "Penyewaan", stock: 12, minimum: 6, price: 50000 },
];

export const initialSales: PosSale[] = [
  { id: "POS-184", date: "2026-09-29", customer: "Pengunjung umum", itemCount: 3, total: 126000, method: "QRIS", status: "Lunas" },
  { id: "POS-183", date: "2026-09-28", customer: "Alya Putri", itemCount: 2, total: 110000, method: "Tunai", status: "Lunas" },
];

export const initialFinance: FinanceEntry[] = [
  { id: "TRX-9014", source: "Pemesanan LKR-25045", date: "2026-09-29", type: "Pendapatan", method: "DOKU VA", amount: 300000, status: "Tercatat" },
  { id: "TRX-9013", source: "Penjualan POS #184", date: "2026-09-29", type: "Pendapatan", method: "QRIS", amount: 126000, status: "Tercatat" },
  { id: "TRX-9012", source: "Pemesanan LKR-25041", date: "2026-09-27", type: "Pendapatan", method: "DOKU VA", amount: 300000, status: "Tercatat" },
  { id: "TRX-9011", source: "Listrik", date: "2026-09-26", type: "Pengeluaran", method: "Transfer bank", amount: 1250000, status: "Tercatat" },
  { id: "TRX-9010", source: "Pembersihan lapangan", date: "2026-09-25", type: "Pengeluaran", method: "Tunai", amount: 450000, status: "Tercatat" },
  { id: "TRX-9009", source: "Penambahan stok bola", date: "2026-09-23", type: "Pengeluaran", method: "Transfer bank", amount: 1140000, status: "Menunggu" },
  { id: "TRX-8975", source: "Pemesanan Agustus", date: "2026-08-18", type: "Pendapatan", method: "QRIS", amount: 4250000, status: "Tercatat" },
  { id: "TRX-8831", source: "Pemesanan Juli", date: "2026-07-12", type: "Pendapatan", method: "DOKU VA", amount: 3800000, status: "Tercatat" },
  { id: "TRX-7601", source: "Perawatan tahunan", date: "2026-01-15", type: "Pengeluaran", method: "Transfer bank", amount: 2750000, status: "Tercatat" },
];
