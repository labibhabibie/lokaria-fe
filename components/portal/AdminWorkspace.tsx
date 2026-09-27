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
          label="Gross booking value"
          value="Rp 1,84 M"
          note="+18.2% month over month"
          icon={CircleDollarSign}
          tone="dark"
        />
        <MetricCard label="Bookings" value="6,482" note="91% paid successfully" icon={BookOpenCheck} />
        <MetricCard label="Active venues" value="248" note="12 awaiting review" icon={Building2} />
        <MetricCard label="Customers" value="18.6K" note="1,204 new this month" icon={UsersRound} tone="warm" />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5 tablet:grid-cols-1">
        <Panel title="Platform activity" eyebrow="Last 7 days">
          <div className="p-5">
            <MiniBars values={[48, 54, 67, 62, 75, 94, 86]} />
            <div className="mt-3 grid grid-cols-7 text-center text-[9px] text-[#11111173]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Needs attention" eyebrow="Operations queue">
          <div className="divide-y divide-line">
            {[
              ["Partner verification", "4 waiting"],
              ["Venue moderation", "8 waiting"],
              ["Refund requests", "3 open"],
              ["Payment mismatch", "2 flagged"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="text-[11px] font-bold">{label}</span>
                <StatusBadge>{value}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Latest payments" eyebrow="Transaction monitor">
        <ResponsiveTable
          columns={[
            { key: "id", label: "Payment" },
            { key: "booking", label: "Booking" },
            { key: "customer", label: "Customer" },
            { key: "channel", label: "Channel" },
            { key: "amount", label: "Amount", align: "right" },
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
      title: "Customers",
      eyebrow: "Platform accounts",
      action: "Export customers",
      columns: ["Customer", "Email", "Bookings", "Joined", "Status"],
      rows: adminCustomers.map((item) => [
        item.name,
        item.email,
        item.bookings,
        item.joined,
        item.status,
      ]),
    },
    partners: {
      title: "Partners",
      eyebrow: "Verification and access",
      action: "Invite partner",
      columns: ["Partner", "Owner", "Venues", "City", "Status"],
      rows: adminPartners.map((item) => [
        item.name,
        item.owner,
        item.venues,
        item.city,
        item.status,
      ]),
    },
    venues: {
      title: "Venue moderation",
      eyebrow: "Listings and quality",
      action: "Add venue",
      columns: ["Venue", "Category", "Partner", "City", "Status"],
      rows: [
        ["PIK Padel Club", "Padel", "PT Arena Bersama", "Jakarta", "Verified"],
        ["GOR Cempaka", "Badminton", "Cempaka Sports", "Jakarta", "Verified"],
        ["Braga Studio", "Music", "Braga Creative", "Bandung", "Review"],
        ["Kolam Sleman", "Fishing", "Sleman Leisure", "Yogyakarta", "Review"],
      ],
    },
    bookings: {
      title: "All bookings",
      eyebrow: "Platform monitoring",
      action: "Export bookings",
      columns: ["Booking", "Customer", "Venue space", "Schedule", "Status"],
      rows: partnerBookings.map((item) => [
        item.id,
        item.customer,
        item.space,
        `${item.date}, ${item.time}`,
        item.status,
      ]),
    },
    payments: {
      title: "Payments",
      eyebrow: "Gateway reconciliation",
      action: "Export payments",
      columns: ["Payment", "Booking", "Customer", "Amount", "Status"],
      rows: adminPayments.map((item) => [
        item.id,
        item.booking,
        item.customer,
        item.amount,
        item.status,
      ]),
    },
    refunds: {
      title: "Refund requests",
      eyebrow: "Review queue",
      action: "Export refunds",
      columns: ["Refund", "Booking", "Requester", "Amount", "Status"],
      rows: adminRefunds.map((item) => [
        item.id,
        item.booking,
        item.requester,
        item.amount,
        item.status,
      ]),
    },
    promotions: {
      title: "Promotions",
      eyebrow: "Campaign management",
      action: "Create promotion",
      columns: ["Code", "Benefit", "Usage", "Period", "Status"],
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
      eyebrow={`${shown.length} results - ${config.eyebrow}`}
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
        <SearchField value={query} onChange={setQuery} placeholder={`Search ${config.title}`} />
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
        empty="No records match this search."
      />
    </Panel>
  );
}

function Reports() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3 mobile:grid-cols-1">
        <MetricCard label="Platform revenue" value="Rp 128 jt" note="September net revenue" icon={Banknote} tone="dark" />
        <MetricCard label="Take rate" value="7.2%" note="Across all paid bookings" icon={HandCoins} />
        <MetricCard label="Refund rate" value="1.8%" note="Down 0.4% this month" icon={TrendingUp} tone="warm" />
      </div>
      <div className="grid grid-cols-[1fr_340px] gap-5 tablet:grid-cols-1">
        <Panel
          title="Gross booking value"
          eyebrow="Monthly comparison"
          action={<button className={secondaryButton}><Download size={15} />Export</button>}
        >
          <div className="p-5"><MiniBars values={[40, 55, 49, 64, 70, 82, 88, 78, 96]} /></div>
        </Panel>
        <Panel title="Category mix" eyebrow="By booking value">
          <div className="space-y-5 p-5">
            {[
              ["Padel", "34%"],
              ["Football", "28%"],
              ["Badminton", "16%"],
              ["Other", "22%"],
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
      <Panel title="Settings" eyebrow="Platform">
        <nav className="p-2">
          {["General", "Booking policy", "Payments", "Notifications", "Access"].map(
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
      <Panel title="General settings" eyebrow="Platform identity">
        <form
          className="grid grid-cols-2 gap-4 p-5 mobile:grid-cols-1"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <label className="text-[10px] font-extrabold uppercase">
            Platform name
            <input defaultValue="LOKARIA" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Support email
            <input defaultValue="support@lokaria.id" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Default commission
            <input type="number" defaultValue="7" className={`${fieldClass} mt-2 normal-case`} />
          </label>
          <label className="text-[10px] font-extrabold uppercase">
            Default timezone
            <select className={`${fieldClass} mt-2 normal-case`}><option>Asia/Jakarta</option></select>
          </label>
          <div className="col-span-2 flex items-center justify-between border-t border-line pt-5 mobile:col-span-1">
            <p className="text-[10px] font-bold text-[#266d3e]">{saved ? "Settings saved locally." : ""}</p>
            <button type="submit" className={primaryButton}><ShieldCheck size={15} />Save settings</button>
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
