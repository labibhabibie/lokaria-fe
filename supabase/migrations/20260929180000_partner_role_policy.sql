drop policy if exists "partners_create" on public.partners;
create policy "partners_create"
on public.partners for insert
to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('PARTNER_OWNER', 'ADMIN', 'SUPER_ADMIN')
  )
);
