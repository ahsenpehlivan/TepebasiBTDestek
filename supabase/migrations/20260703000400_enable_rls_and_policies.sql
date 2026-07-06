begin;

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_comments enable row level security;
alter table public.ticket_attachments enable row level security;
alter table public.ticket_status_history enable row level security;
alter table public.device_maintenance_records enable row level security;
alter table public.activity_logs enable row level security;

create policy employees_can_read_active_departments
on public.departments
for select
to authenticated
using (is_active = true);

create policy technicians_can_read_departments
on public.departments
for select
to authenticated
using (public.is_technician_or_admin());

create policy admins_can_manage_departments
on public.departments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy users_can_read_own_profile
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy technicians_can_read_profiles
on public.profiles
for select
to authenticated
using (public.is_technician_or_admin());

create policy users_can_update_own_profile
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy admins_can_manage_profiles
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy users_can_read_accessible_devices
on public.devices
for select
to authenticated
using (public.can_access_device(id));

create policy technicians_can_insert_devices
on public.devices
for insert
to authenticated
with check (public.is_technician_or_admin());

create policy technicians_can_update_devices
on public.devices
for update
to authenticated
using (public.is_technician_or_admin())
with check (public.is_technician_or_admin());

create policy users_can_read_accessible_tickets
on public.tickets
for select
to authenticated
using (public.can_access_ticket(id));

create policy employees_can_create_own_tickets
on public.tickets
for insert
to authenticated
with check (
  public.current_user_role() = 'employee'
  and auth.uid() is not null
  and created_by = auth.uid()
  and status = 'open'
  and assigned_to is null
  and assigned_at is null
  and resolved_at is null
  and closed_at is null
);

create policy technicians_and_admins_can_create_tickets
on public.tickets
for insert
to authenticated
with check (public.is_technician_or_admin());

create policy technicians_can_update_tickets
on public.tickets
for update
to authenticated
using (public.is_technician_or_admin())
with check (public.is_technician_or_admin());

create policy users_can_read_accessible_ticket_comments
on public.ticket_comments
for select
to authenticated
using (
  public.can_access_ticket(ticket_id)
  and (
    is_internal = false
    or public.is_technician_or_admin()
  )
);

create policy employees_can_create_public_comments
on public.ticket_comments
for insert
to authenticated
with check (
  public.current_user_role() = 'employee'
  and auth.uid() is not null
  and public.can_access_ticket(ticket_id)
  and author_id = auth.uid()
  and is_internal = false
);

create policy technicians_can_create_comments
on public.ticket_comments
for insert
to authenticated
with check (
  public.is_technician_or_admin()
  and public.can_access_ticket(ticket_id)
  and author_id = auth.uid()
);

create policy admins_can_delete_comments
on public.ticket_comments
for delete
to authenticated
using (public.is_admin());

create policy users_can_read_accessible_ticket_attachments
on public.ticket_attachments
for select
to authenticated
using (public.can_access_ticket(ticket_id));

create policy users_can_create_accessible_ticket_attachments
on public.ticket_attachments
for insert
to authenticated
with check (
  auth.uid() is not null
  and public.can_access_ticket(ticket_id)
  and uploaded_by = auth.uid()
  and bucket_name = 'ticket-attachments'
);

create policy technicians_can_update_ticket_attachments
on public.ticket_attachments
for update
to authenticated
using (
  public.is_technician_or_admin()
  and public.can_access_ticket(ticket_id)
)
with check (
  public.is_technician_or_admin()
  and public.can_access_ticket(ticket_id)
);

create policy technicians_can_delete_ticket_attachments
on public.ticket_attachments
for delete
to authenticated
using (
  public.is_technician_or_admin()
  and public.can_access_ticket(ticket_id)
);

create policy users_can_read_accessible_ticket_status_history
on public.ticket_status_history
for select
to authenticated
using (public.can_access_ticket(ticket_id));

create policy users_can_read_accessible_device_maintenance
on public.device_maintenance_records
for select
to authenticated
using (public.can_access_device(device_id));

create policy technicians_can_create_device_maintenance
on public.device_maintenance_records
for insert
to authenticated
with check (
  public.is_technician_or_admin()
  and public.can_access_device(device_id)
  and performed_by = auth.uid()
);

create policy technicians_can_update_device_maintenance
on public.device_maintenance_records
for update
to authenticated
using (
  public.is_technician_or_admin()
  and public.can_access_device(device_id)
)
with check (
  public.is_technician_or_admin()
  and public.can_access_device(device_id)
);

create policy admins_can_read_activity_logs
on public.activity_logs
for select
to authenticated
using (public.is_admin());

commit;
