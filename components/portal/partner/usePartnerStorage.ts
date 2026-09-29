"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { createClient } from "@/lib/supabase/client";

type ResourceKey =
  | "lokaria-partner-venues"
  | "lokaria-partner-courts"
  | "lokaria-partner-staff"
  | "lokaria-partner-inventory"
  | "lokaria-partner-sales"
  | "lokaria-partner-finance"
  | "lokaria-partner-bookings";

type DataItem = Record<string, unknown> & { id: string };
type StorageMode = "pending" | "local" | "supabase";

let partnerPromise: Promise<string | null> | null = null;
let partnerUserId: string | null = null;

function resourceEvent(key: string) {
  return `lokaria-resource:${key}`;
}

function toSlug(value: string, id: string) {
  const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "venue";
  return `${base}-${id.toLowerCase().replace(/[^a-z0-9]/g, "").slice(-8)}`;
}

async function resolvePartnerId() {
  const supabase = createClient();
  if (!supabase) return null;
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) {
    partnerPromise = null;
    partnerUserId = null;
    return null;
  }
  if (partnerPromise && partnerUserId === user.id) return partnerPromise;
  partnerUserId = user.id;
  partnerPromise = (async () => {
    const { data: existing, error: readError } = await supabase
      .from("partners")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (readError) throw readError;
    if (existing?.id) return existing.id as string;

    const displayName = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Mitra LOKARIA");
    const { data: created, error: createError } = await supabase
      .from("partners")
      .insert({ owner_id: user.id, name: `${displayName} Venue` })
      .select("id")
      .single();
    if (createError) throw createError;
    return created.id as string;
  })().catch((error) => {
    partnerPromise = null;
    partnerUserId = null;
    throw error;
  });
  return partnerPromise;
}

function mapVenue(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name),
    city: String(row.city),
    address: String(row.address),
    spaceCount: Number(row.space_count),
    status: String(row.status) === "Aktif" ? "Aktif" : "Nonaktif",
  };
}

function mapCourtStatus(value: unknown) {
  return value === "Perawatan" ? "Pemeliharaan" : String(value);
}

function mapFinanceType(value: unknown) {
  return value === "Pemasukan" ? "Pendapatan" : "Pengeluaran";
}

function mapFinanceStatus(value: unknown) {
  if (value === "Selesai") return "Tercatat";
  if (value === "Tertunda") return "Menunggu";
  return "Dibatalkan";
}

async function loadResource(key: ResourceKey, partnerId: string): Promise<DataItem[]> {
  const supabase = createClient();
  if (!supabase) return [];

  if (key === "lokaria-partner-venues") {
    const { data, error } = await supabase.from("venues").select("id,name,city,address,space_count,status").eq("partner_id", partnerId).order("created_at");
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => mapVenue(row) as DataItem);
  }
  if (key === "lokaria-partner-inventory") {
    const { data, error } = await supabase.from("inventory_items").select("id,name,category,stock,minimum,price").eq("partner_id", partnerId).order("created_at");
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), name: row.name, category: row.category, stock: row.stock, minimum: row.minimum, price: Number(row.price) }));
  }
  if (key === "lokaria-partner-sales") {
    const { data, error } = await supabase.from("pos_sales").select("id,sale_date,customer,item_count,total,method,status").eq("partner_id", partnerId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), date: row.sale_date, customer: row.customer, itemCount: row.item_count, total: Number(row.total), method: row.method, status: row.status }));
  }
  if (key === "lokaria-partner-finance") {
    const { data, error } = await supabase.from("finance_entries").select("id,source,entry_date,type,method,amount,status").eq("partner_id", partnerId).order("entry_date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), source: row.source, date: row.entry_date, type: mapFinanceType(row.type), method: row.method, amount: Number(row.amount), status: mapFinanceStatus(row.status) }));
  }
  if (key === "lokaria-partner-staff") {
    const { data, error } = await supabase.from("partner_staff").select("id,name,email,role,shift,status").eq("partner_id", partnerId).order("created_at");
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), name: row.name, email: row.email, role: row.role, shift: row.shift, status: row.status }));
  }
  if (key === "lokaria-partner-courts") {
    const { data: courts, error } = await supabase.from("courts").select("id,name,type,status,base_price").eq("partner_id", partnerId).order("created_at");
    if (error) throw error;
    const courtRows = (courts ?? []) as Record<string, unknown>[];
    const courtIds = courtRows.map((court) => String(court.id));
    const { data: rules, error: ruleError } = courtIds.length
      ? await supabase.from("pricing_rules").select("id,court_id,name,applies_to,start_time,end_time,price").in("court_id", courtIds)
      : { data: [], error: null };
    if (ruleError) throw ruleError;
    const ruleRows = (rules ?? []) as Record<string, unknown>[];
    return courtRows.map((court) => ({
      id: String(court.id),
      name: court.name,
      type: court.type,
      status: mapCourtStatus(court.status),
      basePrice: Number(court.base_price),
      pricingRules: ruleRows.filter((rule) => rule.court_id === court.id).map((rule) => ({
        id: String(rule.id),
        name: rule.name,
        appliesTo: rule.applies_to === "Hari Kerja" ? "Hari kerja" : rule.applies_to === "Akhir Pekan" ? "Akhir pekan" : "Khusus",
        startTime: String(rule.start_time).slice(0, 5),
        endTime: String(rule.end_time).slice(0, 5),
        price: Number(rule.price),
      })),
    }));
  }
  if (key === "lokaria-partner-bookings") {
    const { data, error } = await supabase
      .from("bookings")
      .select("id,booking_code,customer_name,total,status,booking_slots(start_time,end_time,slot_date,courts(name))")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => {
      const slots = Array.isArray(row.booking_slots) ? row.booking_slots : [];
      const first = slots[0] as { start_time?: string; end_time?: string; slot_date?: string; courts?: { name?: string } | { name?: string }[] } | undefined;
      const court = Array.isArray(first?.courts) ? first?.courts[0] : first?.courts;
      const status = row.status === "Dikonfirmasi" ? "Terkonfirmasi" : row.status === "Menunggu Pembayaran" ? "Menunggu" : row.status;
      return { id: row.booking_code || row.id, customer: row.customer_name, space: court?.name || "Lapangan", date: first?.slot_date || "", startTime: String(first?.start_time || "").slice(0, 5), endTime: String(first?.end_time || "").slice(0, 5), total: Number(row.total), status };
    });
  }
  return [];
}

async function persistSimpleResource(key: ResourceKey, partnerId: string, previous: DataItem[], next: DataItem[]) {
  const supabase = createClient();
  if (!supabase) return;
  const deletedIds = previous.filter((item) => !next.some((candidate) => candidate.id === item.id)).map((item) => item.id);

  let table = "";
  let rows: Record<string, unknown>[] = [];
  if (key === "lokaria-partner-venues") {
    table = "venues";
    rows = next.map((item) => ({ id: item.id, partner_id: partnerId, name: item.name, slug: toSlug(String(item.name), item.id), city: item.city, address: item.address, category: "Olahraga", space_count: item.spaceCount, status: item.status === "Aktif" ? "Aktif" : "Nonaktif", published: item.status === "Aktif" }));
  } else if (key === "lokaria-partner-inventory") {
    table = "inventory_items";
    rows = next.map((item) => ({ id: item.id, partner_id: partnerId, name: item.name, category: item.category, stock: item.stock, minimum: item.minimum, price: item.price }));
  } else if (key === "lokaria-partner-sales") {
    table = "pos_sales";
    rows = next.map((item) => ({ id: item.id, partner_id: partnerId, sale_date: item.date, customer: item.customer, item_count: item.itemCount, total: item.total, method: item.method, status: item.status }));
  } else if (key === "lokaria-partner-finance") {
    table = "finance_entries";
    rows = next.map((item) => ({ id: item.id, partner_id: partnerId, source: item.source, entry_date: item.date, type: item.type === "Pendapatan" ? "Pemasukan" : "Pengeluaran", method: item.method, amount: item.amount, status: item.status === "Tercatat" ? "Selesai" : item.status === "Menunggu" ? "Tertunda" : "Dibatalkan" }));
  } else if (key === "lokaria-partner-staff") {
    table = "partner_staff";
    rows = next.map((item) => ({ id: item.id, partner_id: partnerId, name: item.name, email: item.email, role: item.role, shift: item.shift, status: item.status === "Aktif" ? "Aktif" : "Nonaktif" }));
  }
  if (!table) return;
  if (rows.length) {
    const { error } = await supabase.from(table).upsert(rows);
    if (error) throw error;
  }
  if (deletedIds.length) {
    const { error } = await supabase.from(table).delete().in("id", deletedIds).eq("partner_id", partnerId);
    if (error) throw error;
  }
}

async function persistCourts(partnerId: string, previous: DataItem[], next: DataItem[]) {
  const supabase = createClient();
  if (!supabase) return;
  const { data: venue } = await supabase.from("venues").select("id").eq("partner_id", partnerId).limit(1).maybeSingle();
  if (!venue?.id && next.length) throw new Error("Tambahkan venue sebelum membuat lapangan.");
  const deletedCourtIds = previous.filter((item) => !next.some((candidate) => candidate.id === item.id)).map((item) => item.id);
  const courts = next.map((item) => ({ id: item.id, partner_id: partnerId, venue_id: venue?.id, name: item.name, type: item.type, status: item.status === "Pemeliharaan" ? "Perawatan" : item.status, base_price: item.basePrice }));
  if (courts.length) {
    const { error } = await supabase.from("courts").upsert(courts);
    if (error) throw error;
  }
  const previousRules = previous.flatMap((court) => Array.isArray(court.pricingRules) ? court.pricingRules as DataItem[] : []);
  const nextRules: Array<DataItem & { courtId: string }> = next.flatMap((court) => (Array.isArray(court.pricingRules) ? court.pricingRules as DataItem[] : []).map((rule) => ({ ...rule, courtId: court.id })));
  const deletedRuleIds = previousRules.filter((item) => !nextRules.some((candidate) => candidate.id === item.id)).map((item) => item.id);
  if (nextRules.length) {
    const { error } = await supabase.from("pricing_rules").upsert(nextRules.map((rule) => ({ id: rule.id, partner_id: partnerId, court_id: rule.courtId, name: rule.name, applies_to: rule.appliesTo === "Hari kerja" ? "Hari Kerja" : rule.appliesTo === "Akhir pekan" ? "Akhir Pekan" : "Setiap Hari", start_time: rule.startTime, end_time: rule.endTime, price: rule.price })));
    if (error) throw error;
  }
  if (deletedRuleIds.length) await supabase.from("pricing_rules").delete().in("id", deletedRuleIds).eq("partner_id", partnerId);
  if (deletedCourtIds.length) await supabase.from("courts").delete().in("id", deletedCourtIds).eq("partner_id", partnerId);
}

async function persistBookings(partnerId: string, previous: DataItem[], next: DataItem[]) {
  const supabase = createClient();
  if (!supabase) return;
  for (const booking of next) {
    const old = previous.find((item) => item.id === booking.id);
    if (!old || old.status === booking.status) continue;
    const status = booking.status === "Terkonfirmasi" ? "Dikonfirmasi" : booking.status === "Menunggu" ? "Menunggu Pembayaran" : booking.status;
    const { error } = await supabase.from("bookings").update({ status }).eq("booking_code", booking.id).eq("partner_id", partnerId);
    if (error) throw error;
  }
}

async function persistResource(key: ResourceKey, previous: DataItem[], next: DataItem[]) {
  const partnerId = await resolvePartnerId();
  if (!partnerId) return false;
  if (key === "lokaria-partner-courts") await persistCourts(partnerId, previous, next);
  else if (key === "lokaria-partner-bookings") await persistBookings(partnerId, previous, next);
  else await persistSimpleResource(key, partnerId, previous, next);
  window.dispatchEvent(new Event(resourceEvent(key)));
  return true;
}

export function usePartnerStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const mode = useRef<StorageMode>("pending");
  const [value, setState] = useState<T>(initialValue);

  const load = useCallback(async () => {
    if (!key.startsWith("lokaria-partner-")) return;
    try {
      const partnerId = await resolvePartnerId();
      if (!partnerId) {
        mode.current = "local";
        const serialized = window.localStorage.getItem(key);
        if (serialized) setState(JSON.parse(serialized) as T);
        return;
      }
      mode.current = "supabase";
      const rows = await loadResource(key as ResourceKey, partnerId);
      setState(rows as T);
    } catch (error) {
      mode.current = "local";
      console.error("Gagal memuat data mitra dari Supabase", error);
    }
  }, [key]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const onResource = () => void load();
    const onStorage = (event: StorageEvent) => {
      if (event.key === key && mode.current === "local") void load();
    };
    window.addEventListener(resourceEvent(key), onResource);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(resourceEvent(key), onResource);
      window.removeEventListener("storage", onStorage);
    };
  }, [key, load]);

  const setValue: Dispatch<SetStateAction<T>> = useCallback((action) => {
    const previous = value;
    const next = typeof action === "function" ? (action as (current: T) => T)(previous) : action;
    setState(next);

    if (mode.current === "local") {
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event(resourceEvent(key)));
      return;
    }
    if (!Array.isArray(previous) || !Array.isArray(next)) return;
    void persistResource(key as ResourceKey, previous as DataItem[], next as DataItem[]).then((saved) => {
      if (!saved) {
        mode.current = "local";
        window.localStorage.setItem(key, JSON.stringify(next));
      }
    }).catch((error: unknown) => {
      console.error("Gagal menyimpan data mitra ke Supabase", error);
      window.alert(error instanceof Error ? error.message : "Data gagal disimpan ke Supabase.");
      setState(previous);
    });
  }, [key, value]);

  return [value, setValue];
}
