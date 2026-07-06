begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'ticket-attachments',
  'ticket-attachments',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy users_can_read_ticket_attachment_objects
on storage.objects
for select
to authenticated
using (
  bucket_id = 'ticket-attachments'
  and public.can_access_ticket(public.storage_ticket_uuid_from_path(name))
);

create policy users_can_upload_ticket_attachment_objects
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ticket-attachments'
  and public.storage_ticket_uuid_from_path(name) is not null
  and public.can_access_ticket(public.storage_ticket_uuid_from_path(name))
);

create policy technicians_can_update_ticket_attachment_objects
on storage.objects
for update
to authenticated
using (
  bucket_id = 'ticket-attachments'
  and public.is_technician_or_admin()
  and public.storage_ticket_uuid_from_path(name) is not null
  and public.can_access_ticket(public.storage_ticket_uuid_from_path(name))
)
with check (
  bucket_id = 'ticket-attachments'
  and public.is_technician_or_admin()
  and public.storage_ticket_uuid_from_path(name) is not null
  and public.can_access_ticket(public.storage_ticket_uuid_from_path(name))
);

create policy technicians_can_delete_ticket_attachment_objects
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'ticket-attachments'
  and public.is_technician_or_admin()
  and public.storage_ticket_uuid_from_path(name) is not null
  and public.can_access_ticket(public.storage_ticket_uuid_from_path(name))
);

commit;
