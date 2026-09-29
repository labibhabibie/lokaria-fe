create unique index if not exists partners_one_owner
  on public.partners (owner_id)
  where owner_id is not null;

create or replace function public.get_unavailable_slots(
  p_court_id text,
  p_slot_date date
)
returns table (start_time time, end_time time)
language sql
stable
security definer
set search_path = ''
as $$
  select bs.start_time, bs.end_time
  from public.booking_slots bs
  join public.courts c on c.id = bs.court_id
  join public.venues v on v.id = c.venue_id
  where bs.court_id = p_court_id
    and bs.slot_date = p_slot_date
    and bs.active
    and c.status = 'Aktif'
    and v.published
    and v.status = 'Aktif';
$$;

revoke all on function public.get_unavailable_slots(text, date) from public;
grant execute on function public.get_unavailable_slots(text, date) to anon, authenticated;
