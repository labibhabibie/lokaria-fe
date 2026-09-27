"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Plus,
  ShoppingCart,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { rupiah } from "@/content/site";
import {
  financeTransactions,
  inventoryItems,
  partnerBookings,
  scheduleSlots,
  staffMembers,
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
          label="Revenue today"
          value="Rp 4,8 jt"
          note="+12.4% from last Sunday"
          icon={CircleDollarSign}
          tone="dark"
        />
        <MetricCard label="Bookings" value="18" note="12 confirmed, 3 pending" icon={CalendarDays} />
        <MetricCard label="Occupancy" value="74%" note="Peak time at 19:00" icon={TrendingUp} />
        <MetricCard label="POS sales" value="Rp 826 rb" note="31 items sold today" icon={ShoppingCart} tone="warm" />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5 tablet:grid-cols-1">
        <Panel title="Revenue this week" eyebrow="Venue performance">
          <div className="p-5">
            <MiniBars values={[43, 58, 50, 74, 63, 89, 76]} />
            <div className="mt-3 grid grid-cols-7 text-center text-[9px] text-[#11111173]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Today's schedule" eyebrow="6 activities">
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
      <Panel title="Latest bookings" eyebrow="Live operations">
        <ResponsiveTable
          columns={[
            { key: "id", label: "Booking" },
            { key: "customer", label: "Customer" },
            { key: "schedule", label: "Schedule" },
            { key: "space", label: "Space" },
            { key: "total", label: "Total", align: "right" },
            { key: "status", label: "Status", align: "right" },
          ]}
          rows={bookingRows}
        />
      </Panel>
    </div>
  );
}

function Bookings() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All status");
  const shown = partnerBookings.filter(
    (booking) =>
      (status === "All status" || booking.status === status) &&
      `${booking.id} ${booking.customer} ${booking.space}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const rows = shown.map((booking) => ({
    id: booking.id,
    customer: booking.customer,
    space: booking.space,
    schedule: `${booking.date}, ${booking.time}`,
    total: booking.total,
    status: <StatusBadge>{booking.status}</StatusBadge>,
  }));

  return (
    <Panel
      title="Booking management"
      eyebrow={`${shown.length} results`}
      action={<button className={primaryButton}><Plus size={15} />Manual booking</button>}
    >
      <div className="flex gap-2 border-b border-line p-4 mobile:flex-col">
        <SearchField value={query} onChange={setQuery} placeholder="Search booking" />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={`${fieldClass} max-w-[190px] mobile:max-w-none`}
        >
          <option>All status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>
      <ResponsiveTable
        columns={[
          { key: "id", label: "Booking" },
          { key: "customer", label: "Customer" },
          { key: "space", label: "Space" },
          { key: "schedule", label: "Schedule" },
          { key: "total", label: "Total", align: "right" },
          { key: "status", label: "Status", align: "right" },
        ]}
        rows={rows}
        empty="No bookings match the selected filters."
      />
    </Panel>
  );
}

function Calendar() {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const monthDays = Array.from({ length: 35 }, (_, index) => index - 1);
  return (
    <Panel
      title="Weekly schedule"
      eyebrow="27 Sep - 3 Oct 2026"
      action={<button className={secondaryButton}><Plus size={15} />Block time</button>}
    >
      <div className="overflow-x-auto p-5 mobile:hidden">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[70px_repeat(7,1fr)] border-t border-l border-line">
            <div className="border-r border-b border-line bg-ivory-soft" />
            {["Sun 27", "Mon 28", "Tue 29", "Wed 30", "Thu 01", "Fri 02", "Sat 03"].map(
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
                        Booked<br />Court {(day % 3) + 1}
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
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
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
            Monday, 28 September
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

type ManagerKind = "venues" | "courts" | "pricing" | "staff";

function Manager({ kind }: { kind: ManagerKind }) {
  const configs = {
    venues: {
      title: "Venue portfolio",
      eyebrow: "2 locations",
      button: "Add venue",
      columns: ["Venue", "City", "Spaces", "Status"],
      rows: [
        ["PIK Padel Club", "Jakarta", "4 courts", "Active"],
        ["Senopati Padel House", "Jakarta", "3 courts", "Review"],
      ],
    },
    courts: {
      title: "Courts and spaces",
      eyebrow: "PIK Padel Club",
      button: "Add space",
      columns: ["Space", "Type", "Base price", "Status"],
      rows: [
        ["Court 01", "Panoramic indoor", "Rp 300.000", "Active"],
        ["Court 02", "Outdoor", "Rp 300.000", "Active"],
        ["Court 03", "Competition", "Rp 350.000", "Maintenance"],
      ],
    },
    pricing: {
      title: "Pricing rules",
      eyebrow: "Weekly pricing",
      button: "Add rule",
      columns: ["Rule", "Applies to", "Time", "Price"],
      rows: [
        ["Weekday morning", "All courts", "08:00 - 16:00", "Rp 250.000"],
        ["Weekday prime", "All courts", "16:00 - 22:00", "Rp 350.000"],
        ["Weekend", "All courts", "08:00 - 22:00", "Rp 400.000"],
      ],
    },
    staff: {
      title: "Team members",
      eyebrow: `${staffMembers.length} accounts`,
      button: "Invite staff",
      columns: ["Name", "Role", "Shift", "Status"],
      rows: staffMembers.map((member) => [
        member.name,
        member.role,
        member.shift,
        member.status,
      ]),
    },
  } as const;
  const config = configs[kind];
  const rows = config.rows.map((row, index) => ({
    id: `${kind}-${index}`,
    first: row[0],
    second: row[1],
    third: row[2],
    fourth: <StatusBadge>{row[3]}</StatusBadge>,
  }));

  return (
    <Panel
      title={config.title}
      eyebrow={config.eyebrow}
      action={<button className={primaryButton}><Plus size={15} />{config.button}</button>}
    >
      <ResponsiveTable
        columns={[
          { key: "first", label: config.columns[0] },
          { key: "second", label: config.columns[1] },
          { key: "third", label: config.columns[2] },
          { key: "fourth", label: config.columns[3], align: "right" },
        ]}
        rows={rows}
      />
    </Panel>
  );
}

function Inventory() {
  const [query, setQuery] = useState("");
  const shown = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  const rows = shown.map((item) => ({
    id: item.id,
    item: item.name,
    category: item.category,
    stock: `${item.stock} units`,
    minimum: `${item.minimum} units`,
    status: (
      <StatusBadge>{item.stock <= item.minimum ? "Low stock" : "Healthy"}</StatusBadge>
    ),
  }));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <MetricCard label="Products" value="48" note="Across 3 categories" icon={Boxes} />
        <MetricCard label="Low stock" value="6" note="Needs replenishment" icon={ClipboardCheck} tone="warm" />
        <MetricCard label="Stock value" value="Rp 12,4 jt" note="Estimated retail value" icon={Banknote} tone="dark" />
      </div>
      <Panel title="Inventory items" eyebrow={`${shown.length} shown`}>
        <div className="border-b border-line p-4">
          <SearchField value={query} onChange={setQuery} placeholder="Search inventory" />
        </div>
        <ResponsiveTable
          columns={[
            { key: "item", label: "Item" },
            { key: "category", label: "Category" },
            { key: "stock", label: "Stock" },
            { key: "minimum", label: "Minimum" },
            { key: "status", label: "Status", align: "right" },
          ]}
          rows={rows}
        />
      </Panel>
    </div>
  );
}

function StockMovement({ mode }: { mode: "in" | "out" | "opname" }) {
  const [saved, setSaved] = useState(false);
  const title = mode === "in" ? "Record stock in" : mode === "out" ? "Record stock out" : "Stock opname";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_330px] gap-5 tablet:grid-cols-1">
      <Panel title={title} eyebrow="Inventory movement">
        <form
          className="grid grid-cols-2 gap-4 p-5 mobile:grid-cols-1"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <label className="text-[10px] font-extrabold uppercase">
            Product
            <select className={`${fieldClass} mt-2 normal-case`}>
              {inventoryItems.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            {mode === "opname" ? "Physical count" : "Quantity"}
            <input type="number" min="1" defaultValue="1" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Date
            <input type="date" defaultValue="2026-09-27" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Reference
            <input className={`${fieldClass} mt-2 normal-case`} placeholder="Invoice or note" />
          </label>
          <label className="col-span-2 text-[10px] font-extrabold uppercase mobile:col-span-1">
            Notes
            <textarea className={`${fieldClass} mt-2 min-h-24 resize-y py-3 normal-case`} />
          </label>
          <div className="col-span-2 flex items-center justify-between gap-4 mobile:col-span-1">
            <p className="text-[10px] font-bold text-[#266d3e]">{saved ? "Movement saved locally." : ""}</p>
            <button className={primaryButton} type="submit">Save movement</button>
          </div>
        </form>
      </Panel>
      <Panel title="Current stock" eyebrow="Selected product">
        <div className="p-6">
          <p className="text-[11px] text-[#11111173]">Padel Ball Tube</p>
          <p className="mt-2 text-[42px] font-extrabold">24</p>
          <p className="mt-1 text-[10px] text-[#11111173]">units available</p>
          <div className="mt-6 border-t border-line pt-5 text-[11px] leading-6">
            <p>Minimum level: 10</p><p>Last movement: +12</p><p>Updated: 26 Sep 2026</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function Pos() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const products = inventoryItems.slice(0, 4);
  const total = useMemo(
    () => products.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0),
    [cart, products],
  );
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-5 tablet:grid-cols-1">
      <Panel title="Products" eyebrow="Point of sale">
        <div className="grid grid-cols-2 gap-3 p-5 mobile:grid-cols-1">
          {products.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCart((value) => ({ ...value, [item.id]: (value[item.id] ?? 0) + 1 }))}
              className="cursor-pointer border border-line bg-white p-4 text-left hover:border-olive"
            >
              <span className="text-[9px] text-[#11111173] uppercase">{item.category}</span>
              <strong className="mt-6 block text-[13px] uppercase">{item.name}</strong>
              <span className="mt-2 block text-[11px] text-olive">{rupiah(item.price)}</span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Current sale" eyebrow={`${Object.values(cart).reduce((a, b) => a + b, 0)} items`}>
        <div className="p-5">
          <div className="min-h-[180px] space-y-3">
            {products.filter((item) => cart[item.id]).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-line pb-3 text-[11px]">
                <div><p className="font-bold">{item.name}</p><p className="mt-1 text-[#11111173]">{cart[item.id]} x {rupiah(item.price)}</p></div>
                <button
                  type="button"
                  onClick={() => setCart((value) => ({ ...value, [item.id]: Math.max(0, value[item.id] - 1) }))}
                  className="cursor-pointer text-[10px] font-bold text-[#8d332e]"
                >
                  Remove
                </button>
              </div>
            ))}
            {total === 0 && <p className="pt-12 text-center text-[11px] text-[#11111173]">Tap a product to add it.</p>}
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-line pt-5">
            <span className="text-[11px]">Total</span><strong className="text-[23px]">{rupiah(total)}</strong>
          </div>
          <button
            type="button"
            disabled={total === 0}
            onClick={() => setCart({})}
            className={`${primaryButton} mt-5 w-full`}
          >
            <WalletCards size={16} /> Charge customer
          </button>
        </div>
      </Panel>
    </div>
  );
}

function Finance({ expenses = false }: { expenses?: boolean }) {
  if (expenses) {
    return (
      <Panel
        title="Operating expenses"
        eyebrow="September 2026"
        action={<button className={primaryButton}><Plus size={15} />Add expense</button>}
      >
        <ResponsiveTable
          columns={[
            { key: "item", label: "Expense" },
            { key: "category", label: "Category" },
            { key: "date", label: "Date" },
            { key: "amount", label: "Amount", align: "right" },
            { key: "status", label: "Status", align: "right" },
          ]}
          rows={[
            { id: "EXP-31", item: "Electricity", category: "Utilities", date: "26 Sep", amount: "Rp 1.250.000", status: <StatusBadge>Recorded</StatusBadge> },
            { id: "EXP-30", item: "Court cleaning", category: "Operations", date: "25 Sep", amount: "Rp 450.000", status: <StatusBadge>Recorded</StatusBadge> },
            { id: "EXP-29", item: "Ball restock", category: "Inventory", date: "23 Sep", amount: "Rp 1.140.000", status: <StatusBadge>Pending</StatusBadge> },
          ]}
        />
      </Panel>
    );
  }
  const rows = financeTransactions.map((item) => ({
    ...item,
    status: <StatusBadge>{item.status}</StatusBadge>,
  }));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <MetricCard label="Gross revenue" value="Rp 84,2 jt" note="September to date" icon={CircleDollarSign} tone="dark" />
        <MetricCard label="Net revenue" value="Rp 76,8 jt" note="After fees and refunds" icon={TrendingUp} />
        <MetricCard label="Next payout" value="Rp 18,4 jt" note="Scheduled 30 Sep" icon={Banknote} tone="warm" />
      </div>
      <Panel title="Recent transactions" eyebrow="Financial ledger preview">
        <ResponsiveTable
          columns={[
            { key: "id", label: "Transaction" },
            { key: "source", label: "Source" },
            { key: "date", label: "Date" },
            { key: "method", label: "Method" },
            { key: "amount", label: "Amount", align: "right" },
            { key: "status", label: "Status", align: "right" },
          ]}
          rows={rows}
        />
      </Panel>
    </div>
  );
}

export function PartnerWorkspace({ path }: { path: string }) {
  if (path === "/partner") return <Dashboard />;
  if (path === "/partner/bookings") return <Bookings />;
  if (path === "/partner/calendar") return <Calendar />;
  if (path === "/partner/venues") return <Manager kind="venues" />;
  if (path === "/partner/courts") return <Manager kind="courts" />;
  if (path === "/partner/pricing") return <Manager kind="pricing" />;
  if (path === "/partner/staff") return <Manager kind="staff" />;
  if (path === "/partner/inventory") return <Inventory />;
  if (path === "/partner/inventory/stock-in") return <StockMovement mode="in" />;
  if (path === "/partner/inventory/stock-out") return <StockMovement mode="out" />;
  if (path === "/partner/inventory/stock-opname") return <StockMovement mode="opname" />;
  if (path === "/partner/pos") return <Pos />;
  if (path === "/partner/finance") return <Finance />;
  if (path === "/partner/expenses") return <Finance expenses />;
  return <Dashboard />;
}
