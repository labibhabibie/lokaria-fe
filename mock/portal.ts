export type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export const customerBookings = [
  { id: "LKR-240927", venue: "PIK Padel Club", space: "Court 02", date: "28 Sep 2026", time: "19:00 - 20:00", total: 300000, status: "Confirmed" as BookingStatus },
  { id: "LKR-240811", venue: "GOR Cempaka", space: "Court 05", date: "11 Aug 2026", time: "16:00 - 17:00", total: 80000, status: "Completed" as BookingStatus },
  { id: "LKR-240702", venue: "Senayan Tennis Courts", space: "Hard Court A", date: "02 Jul 2026", time: "08:00 - 09:00", total: 200000, status: "Cancelled" as BookingStatus },
];

export const partnerBookings = [
  { id: "LKR-25041", customer: "Alya Putri", space: "Padel 01", date: "27 Sep", time: "09:00", total: "Rp 300.000", status: "Confirmed" },
  { id: "LKR-25042", customer: "Raka Mahendra", space: "Padel 02", date: "27 Sep", time: "10:00", total: "Rp 300.000", status: "Pending" },
  { id: "LKR-25043", customer: "Nadia Permata", space: "Padel 01", date: "27 Sep", time: "12:00", total: "Rp 300.000", status: "Confirmed" },
  { id: "LKR-25044", customer: "Dimas Ardi", space: "Padel 03", date: "27 Sep", time: "15:00", total: "Rp 350.000", status: "Completed" },
  { id: "LKR-25045", customer: "Niko Tan", space: "Padel 02", date: "28 Sep", time: "08:00", total: "Rp 300.000", status: "Confirmed" },
];

export const scheduleSlots = [
  { time: "08:00", label: "Niko Tan", court: "Court 02", tone: "confirmed" },
  { time: "09:00", label: "Alya Putri", court: "Court 01", tone: "confirmed" },
  { time: "10:00", label: "Raka Mahendra", court: "Court 02", tone: "pending" },
  { time: "12:00", label: "Nadia Permata", court: "Court 01", tone: "confirmed" },
  { time: "15:00", label: "Dimas Ardi", court: "Court 03", tone: "completed" },
  { time: "18:00", label: "Maintenance", court: "Court 01", tone: "blocked" },
];

export const inventoryItems = [
  { id: "INV-001", name: "Padel Ball Tube", category: "Equipment", stock: 24, minimum: 10, price: 95000 },
  { id: "INV-002", name: "Mineral Water 600ml", category: "Beverage", stock: 8, minimum: 20, price: 8000 },
  { id: "INV-003", name: "Grip Tape", category: "Equipment", stock: 15, minimum: 8, price: 45000 },
  { id: "INV-004", name: "Isotonic Drink", category: "Beverage", stock: 31, minimum: 15, price: 15000 },
  { id: "INV-005", name: "Racket Rental", category: "Rental", stock: 12, minimum: 6, price: 50000 },
];

export const staffMembers = [
  { id: "STF-01", name: "Nanda Pratama", role: "Venue Manager", shift: "07:00 - 15:00", status: "Active" },
  { id: "STF-02", name: "Siti Amalia", role: "Front Desk", shift: "09:00 - 17:00", status: "Active" },
  { id: "STF-03", name: "Fajar Rizki", role: "Operations", shift: "15:00 - 23:00", status: "Off duty" },
  { id: "STF-04", name: "Maya Lestari", role: "Finance", shift: "08:00 - 16:00", status: "Active" },
];

export const financeTransactions = [
  { id: "TRX-9012", source: "Booking LKR-25041", date: "27 Sep 2026", method: "DOKU VA", amount: "+Rp 300.000", status: "Settled" },
  { id: "TRX-9011", source: "POS Sale #184", date: "27 Sep 2026", method: "QRIS", amount: "+Rp 126.000", status: "Settled" },
  { id: "TRX-9010", source: "Electricity", date: "26 Sep 2026", method: "Expense", amount: "-Rp 1.250.000", status: "Recorded" },
  { id: "TRX-9009", source: "Booking LKR-25038", date: "26 Sep 2026", method: "Card", amount: "+Rp 350.000", status: "Settled" },
];

export const adminCustomers = [
  { id: "CUS-1024", name: "Alya Putri", email: "alya@example.com", bookings: "12", joined: "18 Jan 2026", status: "Active" },
  { id: "CUS-1023", name: "Raka Mahendra", email: "raka@example.com", bookings: "8", joined: "02 Feb 2026", status: "Active" },
  { id: "CUS-1022", name: "Nadia Permata", email: "nadia@example.com", bookings: "21", joined: "14 Mar 2026", status: "Active" },
  { id: "CUS-1021", name: "Dimas Ardi", email: "dimas@example.com", bookings: "4", joined: "20 Apr 2026", status: "Suspended" },
];

export const adminPartners = [
  { id: "PTR-301", name: "PIK Padel Club", owner: "PT Arena Bersama", venues: "2", city: "Jakarta", status: "Verified" },
  { id: "PTR-300", name: "GOR Cempaka", owner: "Cempaka Sports", venues: "1", city: "Jakarta", status: "Verified" },
  { id: "PTR-299", name: "Braga Studio", owner: "Braga Creative", venues: "1", city: "Bandung", status: "Review" },
  { id: "PTR-298", name: "Kolam Sleman", owner: "Sleman Leisure", venues: "1", city: "Yogyakarta", status: "Review" },
];

export const adminPayments = [
  { id: "PAY-8821", booking: "LKR-25041", customer: "Alya Putri", channel: "DOKU VA", amount: "Rp 300.000", status: "Paid" },
  { id: "PAY-8820", booking: "LKR-25042", customer: "Raka Mahendra", channel: "QRIS", amount: "Rp 300.000", status: "Pending" },
  { id: "PAY-8819", booking: "LKR-25040", customer: "Nadia Permata", channel: "Card", amount: "Rp 350.000", status: "Paid" },
  { id: "PAY-8818", booking: "LKR-25039", customer: "Dimas Ardi", channel: "DOKU VA", amount: "Rp 180.000", status: "Refunded" },
];

export const adminRefunds = [
  { id: "RFD-144", booking: "LKR-25039", requester: "Dimas Ardi", reason: "Venue closed", amount: "Rp 180.000", status: "Review" },
  { id: "RFD-143", booking: "LKR-25027", requester: "Putri Ayu", reason: "Schedule conflict", amount: "Rp 300.000", status: "Approved" },
  { id: "RFD-142", booking: "LKR-25011", requester: "Farhan Malik", reason: "Duplicate payment", amount: "Rp 150.000", status: "Completed" },
];

export const adminPromotions = [
  { id: "PRM-01", code: "MAINBARENG", benefit: "15% up to Rp 50.000", usage: "342 / 500", period: "01-30 Sep", status: "Active" },
  { id: "PRM-02", code: "WELCOME25", benefit: "Rp 25.000", usage: "811 / 1.000", period: "Always on", status: "Active" },
  { id: "PRM-03", code: "PADELDAY", benefit: "10% padel", usage: "120 / 120", period: "01-14 Sep", status: "Ended" },
];
