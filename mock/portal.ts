export type BookingStatus = "Terkonfirmasi" | "Menunggu" | "Selesai" | "Dibatalkan";

export const customerBookings = [
  { id: "LKR-240927", venue: "PIK Padel Club", space: "Lapangan 02", date: "28 Sep 2026", time: "19:00 - 20:00", total: 300000, status: "Terkonfirmasi" as BookingStatus },
  { id: "LKR-240811", venue: "GOR Cempaka", space: "Lapangan 05", date: "11 Agu 2026", time: "16:00 - 17:00", total: 80000, status: "Selesai" as BookingStatus },
  { id: "LKR-240702", venue: "Senayan Tennis Courts", space: "Lapangan Keras A", date: "02 Jul 2026", time: "08:00 - 09:00", total: 200000, status: "Dibatalkan" as BookingStatus },
];

export const partnerBookings = [
  { id: "LKR-25041", customer: "Alya Putri", space: "Padel 01", date: "27 Sep", time: "09:00", total: "Rp 300.000", status: "Terkonfirmasi" },
  { id: "LKR-25042", customer: "Raka Mahendra", space: "Padel 02", date: "27 Sep", time: "10:00", total: "Rp 300.000", status: "Menunggu" },
  { id: "LKR-25043", customer: "Nadia Permata", space: "Padel 01", date: "27 Sep", time: "12:00", total: "Rp 300.000", status: "Terkonfirmasi" },
  { id: "LKR-25044", customer: "Dimas Ardi", space: "Padel 03", date: "27 Sep", time: "15:00", total: "Rp 350.000", status: "Selesai" },
  { id: "LKR-25045", customer: "Niko Tan", space: "Padel 02", date: "28 Sep", time: "08:00", total: "Rp 300.000", status: "Terkonfirmasi" },
];

export const scheduleSlots = [
  { time: "08:00", label: "Niko Tan", court: "Lapangan 02", tone: "confirmed" },
  { time: "09:00", label: "Alya Putri", court: "Lapangan 01", tone: "confirmed" },
  { time: "10:00", label: "Raka Mahendra", court: "Lapangan 02", tone: "pending" },
  { time: "12:00", label: "Nadia Permata", court: "Lapangan 01", tone: "confirmed" },
  { time: "15:00", label: "Dimas Ardi", court: "Lapangan 03", tone: "completed" },
  { time: "18:00", label: "Pemeliharaan", court: "Lapangan 01", tone: "blocked" },
];

export const inventoryItems = [
  { id: "INV-001", name: "Tabung Bola Padel", category: "Peralatan", stock: 24, minimum: 10, price: 95000 },
  { id: "INV-002", name: "Air Mineral 600 ml", category: "Minuman", stock: 8, minimum: 20, price: 8000 },
  { id: "INV-003", name: "Grip Tape", category: "Peralatan", stock: 15, minimum: 8, price: 45000 },
  { id: "INV-004", name: "Minuman Isotonik", category: "Minuman", stock: 31, minimum: 15, price: 15000 },
  { id: "INV-005", name: "Sewa Raket", category: "Penyewaan", stock: 12, minimum: 6, price: 50000 },
];

export const staffMembers = [
  { id: "STF-01", name: "Nanda Pratama", role: "Manajer Venue", shift: "07:00 - 15:00", status: "Aktif" },
  { id: "STF-02", name: "Siti Amalia", role: "Meja Layanan", shift: "09:00 - 17:00", status: "Aktif" },
  { id: "STF-03", name: "Fajar Rizki", role: "Operasional", shift: "15:00 - 23:00", status: "Tidak bertugas" },
  { id: "STF-04", name: "Maya Lestari", role: "Keuangan", shift: "08:00 - 16:00", status: "Aktif" },
];

export const financeTransactions = [
  { id: "TRX-9012", source: "Pemesanan LKR-25041", date: "27 Sep 2026", method: "DOKU VA", amount: "+Rp 300.000", status: "Diselesaikan" },
  { id: "TRX-9011", source: "Penjualan POS #184", date: "27 Sep 2026", method: "QRIS", amount: "+Rp 126.000", status: "Diselesaikan" },
  { id: "TRX-9010", source: "Listrik", date: "26 Sep 2026", method: "Pengeluaran", amount: "-Rp 1.250.000", status: "Tercatat" },
  { id: "TRX-9009", source: "Pemesanan LKR-25038", date: "26 Sep 2026", method: "Kartu", amount: "+Rp 350.000", status: "Diselesaikan" },
];

export const adminCustomers = [
  { id: "CUS-1024", name: "Alya Putri", email: "alya@example.com", bookings: "12", joined: "18 Jan 2026", status: "Aktif" },
  { id: "CUS-1023", name: "Raka Mahendra", email: "raka@example.com", bookings: "8", joined: "02 Feb 2026", status: "Aktif" },
  { id: "CUS-1022", name: "Nadia Permata", email: "nadia@example.com", bookings: "21", joined: "14 Mar 2026", status: "Aktif" },
  { id: "CUS-1021", name: "Dimas Ardi", email: "dimas@example.com", bookings: "4", joined: "20 Apr 2026", status: "Ditangguhkan" },
];

export const adminPartners = [
  { id: "PTR-301", name: "PIK Padel Club", owner: "PT Arena Bersama", venues: "2", city: "Jakarta", status: "Terverifikasi" },
  { id: "PTR-300", name: "GOR Cempaka", owner: "Cempaka Sports", venues: "1", city: "Jakarta", status: "Terverifikasi" },
  { id: "PTR-299", name: "Braga Studio", owner: "Braga Creative", venues: "1", city: "Bandung", status: "Ditinjau" },
  { id: "PTR-298", name: "Kolam Sleman", owner: "Sleman Leisure", venues: "1", city: "Yogyakarta", status: "Ditinjau" },
];

export const adminPayments = [
  { id: "PAY-8821", booking: "LKR-25041", customer: "Alya Putri", channel: "DOKU VA", amount: "Rp 300.000", status: "Dibayar" },
  { id: "PAY-8820", booking: "LKR-25042", customer: "Raka Mahendra", channel: "QRIS", amount: "Rp 300.000", status: "Menunggu" },
  { id: "PAY-8819", booking: "LKR-25040", customer: "Nadia Permata", channel: "Kartu", amount: "Rp 350.000", status: "Dibayar" },
  { id: "PAY-8818", booking: "LKR-25039", customer: "Dimas Ardi", channel: "DOKU VA", amount: "Rp 180.000", status: "Dikembalikan" },
];

export const adminRefunds = [
  { id: "RFD-144", booking: "LKR-25039", requester: "Dimas Ardi", reason: "Venue tutup", amount: "Rp 180.000", status: "Ditinjau" },
  { id: "RFD-143", booking: "LKR-25027", requester: "Putri Ayu", reason: "Jadwal bentrok", amount: "Rp 300.000", status: "Disetujui" },
  { id: "RFD-142", booking: "LKR-25011", requester: "Farhan Malik", reason: "Pembayaran ganda", amount: "Rp 150.000", status: "Selesai" },
];

export const adminPromotions = [
  { id: "PRM-01", code: "MAINBARENG", benefit: "15% hingga Rp 50.000", usage: "342 / 500", period: "01-30 Sep", status: "Aktif" },
  { id: "PRM-02", code: "WELCOME25", benefit: "Rp 25.000", usage: "811 / 1.000", period: "Selalu aktif", status: "Aktif" },
  { id: "PRM-03", code: "PADELDAY", benefit: "10% padel", usage: "120 / 120", period: "01-14 Sep", status: "Berakhir" },
];
