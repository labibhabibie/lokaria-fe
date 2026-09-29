create extension if not exists pgcrypto;

create table if not exists public.partners (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_members (
  partner_id text not null references public.partners(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'Pemilik',
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif')),
  created_at timestamptz not null default now(),
  primary key (partner_id, user_id)
);

create or replace function public.is_partner_member(target_partner_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.partners
    where id = target_partner_id and owner_id = auth.uid()
  ) or exists (
    select 1 from public.partner_members
    where partner_id = target_partner_id
      and user_id = auth.uid()
      and status = 'Aktif'
  );
$$;

revoke all on function public.is_partner_member(text) from public;
grant execute on function public.is_partner_member(text) to authenticated;

create table if not exists public.venues (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  name text not null,
  slug text not null unique,
  category text not null default 'Olahraga',
  city text not null,
  address text not null,
  description text not null default '',
  image_url text,
  space_count integer not null default 1 check (space_count > 0),
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif')),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courts (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  venue_id text not null references public.venues(id) on delete cascade,
  name text not null,
  type text not null,
  status text not null default 'Aktif' check (status in ('Aktif', 'Perawatan', 'Nonaktif')),
  base_price bigint not null default 0 check (base_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_rules (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  court_id text not null references public.courts(id) on delete cascade,
  name text not null,
  applies_to text not null default 'Setiap Hari' check (applies_to in ('Hari Kerja', 'Akhir Pekan', 'Setiap Hari', 'Tanggal Khusus')),
  start_time time not null,
  end_time time not null,
  price bigint not null check (price >= 0),
  specific_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.partner_staff (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null,
  shift text not null,
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  venue_id text references public.venues(id) on delete set null,
  name text not null,
  category text not null,
  stock integer not null default 0 check (stock >= 0),
  minimum integer not null default 0 check (minimum >= 0),
  price bigint not null default 0 check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  inventory_id text not null references public.inventory_items(id) on delete cascade,
  movement_type text not null check (movement_type in ('Masuk', 'Keluar', 'Penyesuaian')),
  quantity integer not null check (quantity > 0),
  notes text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.pos_sales (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  venue_id text references public.venues(id) on delete set null,
  sale_date date not null default current_date,
  customer text not null,
  item_count integer not null default 1 check (item_count > 0),
  total bigint not null check (total >= 0),
  method text not null,
  status text not null default 'Lunas' check (status in ('Lunas', 'Menunggu', 'Dibatalkan')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_entries (
  id text primary key default gen_random_uuid()::text,
  partner_id text not null references public.partners(id) on delete cascade,
  venue_id text references public.venues(id) on delete set null,
  source text not null,
  entry_date date not null default current_date,
  type text not null check (type in ('Pemasukan', 'Pengeluaran')),
  method text not null,
  amount bigint not null check (amount >= 0),
  status text not null default 'Selesai' check (status in ('Selesai', 'Tertunda', 'Dibatalkan')),
  reference_type text,
  reference_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists finance_reference_unique
  on public.finance_entries (partner_id, reference_type, reference_id)
  where reference_type is not null and reference_id is not null;

create table if not exists public.bookings (
  id text primary key default gen_random_uuid()::text,
  booking_code text not null unique,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  partner_id text not null references public.partners(id) on delete restrict,
  venue_id text not null references public.venues(id) on delete restrict,
  customer_name text not null,
  customer_phone text not null,
  subtotal bigint not null check (subtotal >= 0),
  service_fee bigint not null default 0 check (service_fee >= 0),
  discount bigint not null default 0 check (discount >= 0),
  total bigint not null check (total >= 0),
  status text not null default 'Menunggu Pembayaran' check (status in ('Menunggu Pembayaran', 'Dikonfirmasi', 'Selesai', 'Dibatalkan', 'Kedaluwarsa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_slots (
  id text primary key default gen_random_uuid()::text,
  booking_id text not null references public.bookings(id) on delete cascade,
  court_id text not null references public.courts(id) on delete restrict,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  unit_price bigint not null check (unit_price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists booking_slots_no_double_booking
  on public.booking_slots (court_id, slot_date, start_time)
  where active;

create table if not exists public.payments (
  id text primary key default gen_random_uuid()::text,
  booking_id text not null unique references public.bookings(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  provider text not null default 'LOKARIA Demo',
  method text not null,
  amount bigint not null check (amount >= 0),
  status text not null default 'Menunggu' check (status in ('Menunggu', 'Lunas', 'Gagal', 'Kedaluwarsa', 'Dikembalikan')),
  external_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['partners', 'venues', 'courts', 'partner_staff', 'inventory_items', 'pos_sales', 'finance_entries', 'bookings', 'payments']
  loop
    execute format('drop trigger if exists touch_updated_at on public.%I', table_name);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', table_name);
  end loop;
end;
$$;

alter table public.partners enable row level security;
alter table public.partner_members enable row level security;
alter table public.venues enable row level security;
alter table public.courts enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.partner_staff enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.pos_sales enable row level security;
alter table public.finance_entries enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_slots enable row level security;
alter table public.payments enable row level security;

create policy "partners_read_own" on public.partners for select to authenticated
  using (public.is_partner_member(id));
create policy "partners_create" on public.partners for insert to authenticated
  with check (owner_id = auth.uid());
create policy "partners_update_own" on public.partners for update to authenticated
  using (public.is_partner_member(id)) with check (public.is_partner_member(id));

create policy "members_read_own_partner" on public.partner_members for select to authenticated
  using (user_id = auth.uid() or public.is_partner_member(partner_id));
create policy "members_manage_own_partner" on public.partner_members for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));

create policy "venues_public_read" on public.venues for select to anon, authenticated
  using (published and status = 'Aktif');
create policy "venues_partner_read" on public.venues for select to authenticated
  using (public.is_partner_member(partner_id));
create policy "venues_partner_insert" on public.venues for insert to authenticated
  with check (public.is_partner_member(partner_id));
create policy "venues_partner_update" on public.venues for update to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));
create policy "venues_partner_delete" on public.venues for delete to authenticated
  using (public.is_partner_member(partner_id));

create policy "courts_public_read" on public.courts for select to anon, authenticated
  using (status = 'Aktif' and exists (
    select 1 from public.venues v
    where v.id = venue_id and v.published and v.status = 'Aktif'
  ));
create policy "courts_partner_read" on public.courts for select to authenticated
  using (public.is_partner_member(partner_id));
create policy "courts_partner_manage" on public.courts for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));

create policy "pricing_public_read" on public.pricing_rules for select to anon, authenticated
  using (true);
create policy "pricing_partner_manage" on public.pricing_rules for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));

create policy "staff_partner_manage" on public.partner_staff for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));
create policy "inventory_partner_manage" on public.inventory_items for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));
create policy "movement_partner_manage" on public.inventory_movements for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));
create policy "sales_partner_manage" on public.pos_sales for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));
create policy "finance_partner_manage" on public.finance_entries for all to authenticated
  using (public.is_partner_member(partner_id)) with check (public.is_partner_member(partner_id));

create policy "bookings_read_participants" on public.bookings for select to authenticated
  using (customer_id = auth.uid() or public.is_partner_member(partner_id));
create policy "bookings_customer_update" on public.bookings for update to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy "slots_read_participants" on public.booking_slots for select to authenticated
  using (exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (b.customer_id = auth.uid() or public.is_partner_member(b.partner_id))
  ));
create policy "payments_read_participants" on public.payments for select to authenticated
  using (exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and (b.customer_id = auth.uid() or public.is_partner_member(b.partner_id))
  ));

create or replace function public.create_marketplace_booking(
  p_venue_id text,
  p_customer_name text,
  p_customer_phone text,
  p_payment_method text,
  p_slots jsonb
)
returns table (booking_id text, payment_id text, booking_code text, total bigint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_partner_id text;
  new_booking_id text := gen_random_uuid()::text;
  new_payment_id text := gen_random_uuid()::text;
  new_booking_code text := 'LKR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  slot jsonb;
  target_court public.courts%rowtype;
  calculated_price bigint;
  calculated_subtotal bigint := 0;
  calculated_total bigint;
  requested_date date;
  requested_start time;
  requested_end time;
begin
  if current_user_id is null then
    raise exception 'Anda harus masuk untuk membuat pesanan';
  end if;

  if jsonb_typeof(p_slots) <> 'array' or jsonb_array_length(p_slots) = 0 then
    raise exception 'Pilih minimal satu jadwal';
  end if;

  select partner_id into target_partner_id
  from public.venues
  where id = p_venue_id and published and status = 'Aktif';

  if target_partner_id is null then
    raise exception 'Venue tidak tersedia';
  end if;

  insert into public.bookings (
    id, booking_code, customer_id, partner_id, venue_id, customer_name,
    customer_phone, subtotal, service_fee, discount, total
  ) values (
    new_booking_id, new_booking_code, current_user_id, target_partner_id, p_venue_id,
    p_customer_name, p_customer_phone, 0, 5000, 0, 0
  );

  for slot in select value from jsonb_array_elements(p_slots)
  loop
    requested_date := (slot->>'date')::date;
    requested_start := (slot->>'start_time')::time;
    requested_end := (slot->>'end_time')::time;

    select * into target_court
    from public.courts
    where id = slot->>'court_id'
      and venue_id = p_venue_id
      and status = 'Aktif';

    if target_court.id is null then
      raise exception 'Lapangan tidak tersedia';
    end if;

    select coalesce((
      select pr.price
      from public.pricing_rules pr
      where pr.court_id = target_court.id
        and requested_start >= pr.start_time
        and requested_start < pr.end_time
        and (
          pr.applies_to = 'Setiap Hari'
          or (pr.applies_to = 'Hari Kerja' and extract(isodow from requested_date) between 1 and 5)
          or (pr.applies_to = 'Akhir Pekan' and extract(isodow from requested_date) in (6, 7))
          or (pr.applies_to = 'Tanggal Khusus' and pr.specific_date = requested_date)
        )
      order by case pr.applies_to when 'Tanggal Khusus' then 1 when 'Akhir Pekan' then 2 when 'Hari Kerja' then 2 else 3 end
      limit 1
    ), target_court.base_price) into calculated_price;

    insert into public.booking_slots (
      id, booking_id, court_id, slot_date, start_time, end_time, unit_price
    ) values (
      gen_random_uuid()::text, new_booking_id, target_court.id, requested_date,
      requested_start, requested_end, calculated_price
    );

    calculated_subtotal := calculated_subtotal + calculated_price;
  end loop;

  calculated_total := calculated_subtotal + 5000;
  update public.bookings
  set subtotal = calculated_subtotal, total = calculated_total
  where id = new_booking_id;

  insert into public.payments (
    id, booking_id, customer_id, method, amount
  ) values (
    new_payment_id, new_booking_id, current_user_id, p_payment_method, calculated_total
  );

  return query select new_booking_id, new_payment_id, new_booking_code, calculated_total;
exception
  when unique_violation then
    raise exception 'Salah satu jadwal baru saja dipesan. Silakan pilih jadwal lain';
end;
$$;

revoke all on function public.create_marketplace_booking(text, text, text, text, jsonb) from public;
grant execute on function public.create_marketplace_booking(text, text, text, text, jsonb) to authenticated;

create or replace function public.confirm_demo_payment(p_booking_id text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_booking public.bookings%rowtype;
begin
  select * into target_booking
  from public.bookings
  where id = p_booking_id and customer_id = auth.uid();

  if target_booking.id is null then
    raise exception 'Pesanan tidak ditemukan';
  end if;

  update public.payments
  set status = 'Lunas', paid_at = now()
  where booking_id = target_booking.id and status = 'Menunggu';

  update public.bookings
  set status = 'Dikonfirmasi'
  where id = target_booking.id;

  insert into public.finance_entries (
    id, partner_id, venue_id, source, entry_date, type, method, amount,
    status, reference_type, reference_id
  )
  select gen_random_uuid()::text, b.partner_id, b.venue_id,
    'Booking ' || b.booking_code, current_date, 'Pemasukan', p.method,
    b.total, 'Selesai', 'booking', b.id
  from public.bookings b
  join public.payments p on p.booking_id = b.id
  where b.id = target_booking.id
  on conflict (partner_id, reference_type, reference_id)
    where reference_type is not null and reference_id is not null
  do nothing;

  return target_booking.booking_code;
end;
$$;

revoke all on function public.confirm_demo_payment(text) from public;
grant execute on function public.confirm_demo_payment(text) to authenticated;

insert into public.partners (id, name, status)
values ('PTR-LOKARIA-DEMO', 'LOKARIA Demo Partner', 'Aktif')
on conflict (id) do nothing;

insert into public.venues (id, partner_id, name, slug, category, city, address, description, space_count, status, published)
values
  ('VNU-PIK-PADEL', 'PTR-LOKARIA-DEMO', 'PIK Padel Club', 'pik-padel-club', 'Padel', 'Jakarta Utara', 'Pantai Indah Kapuk, Jakarta Utara', 'Lapangan padel modern dengan fasilitas lengkap.', 3, 'Aktif', true),
  ('VNU-SENAYAN-TENNIS', 'PTR-LOKARIA-DEMO', 'Senayan Tennis Center', 'senayan-tennis-center', 'Tenis', 'Jakarta Pusat', 'Senayan, Jakarta Pusat', 'Pusat tenis di lokasi strategis Jakarta.', 2, 'Aktif', true),
  ('VNU-CIBUBUR-FUTSAL', 'PTR-LOKARIA-DEMO', 'Cibubur Futsal Arena', 'cibubur-futsal-arena', 'Futsal', 'Jakarta Timur', 'Cibubur, Jakarta Timur', 'Arena futsal nyaman untuk komunitas dan pertandingan.', 2, 'Aktif', true)
on conflict (id) do nothing;

insert into public.courts (id, partner_id, venue_id, name, type, status, base_price)
values
  ('CRT-PIK-01', 'PTR-LOKARIA-DEMO', 'VNU-PIK-PADEL', 'Lapangan Padel 1', 'Padel', 'Aktif', 300000),
  ('CRT-PIK-02', 'PTR-LOKARIA-DEMO', 'VNU-PIK-PADEL', 'Lapangan Padel 2', 'Padel', 'Aktif', 300000),
  ('CRT-SENAYAN-01', 'PTR-LOKARIA-DEMO', 'VNU-SENAYAN-TENNIS', 'Lapangan Tenis 1', 'Tenis', 'Aktif', 180000),
  ('CRT-CIBUBUR-01', 'PTR-LOKARIA-DEMO', 'VNU-CIBUBUR-FUTSAL', 'Lapangan Futsal 1', 'Futsal', 'Aktif', 150000)
on conflict (id) do nothing;

insert into public.pricing_rules (id, partner_id, court_id, name, applies_to, start_time, end_time, price)
values
  ('PRC-PIK-WEEKDAY', 'PTR-LOKARIA-DEMO', 'CRT-PIK-01', 'Hari Kerja', 'Hari Kerja', '06:00', '23:00', 300000),
  ('PRC-PIK-WEEKEND', 'PTR-LOKARIA-DEMO', 'CRT-PIK-01', 'Akhir Pekan', 'Akhir Pekan', '06:00', '23:00', 375000),
  ('PRC-SENAYAN-WEEKDAY', 'PTR-LOKARIA-DEMO', 'CRT-SENAYAN-01', 'Hari Kerja', 'Hari Kerja', '06:00', '23:00', 180000),
  ('PRC-CIBUBUR-WEEKDAY', 'PTR-LOKARIA-DEMO', 'CRT-CIBUBUR-01', 'Hari Kerja', 'Setiap Hari', '06:00', '23:00', 150000)
on conflict (id) do nothing;
