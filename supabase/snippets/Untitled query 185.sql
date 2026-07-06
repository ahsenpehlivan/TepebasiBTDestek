begin;

do $$
declare
  invalid_transition_allowed boolean;
begin
  if not exists (
    select 1 from pg_type where typname = 'app_role'
  ) then
    raise exception 'Missing enum: app_role';
  end if;

  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'tickets'
  ) then
    raise exception 'Missing table: public.tickets';
  end if;

  select public.validate_ticket_status_transition('open', 'resolved')
  into invalid_transition_allowed;

  if invalid_transition_allowed then
    raise exception 'Invalid transition open -> resolved should not be allowed';
  end if;

  if not exists (
    select 1
    from storage.buckets
    where id = 'ticket-attachments'
      and public = false
  ) then
    raise exception 'Private storage bucket ticket-attachments was not created';
  end if;

  begin
    insert into public.devices (
      asset_tag,
      qr_token,
      device_type,
      brand,
      model,
      serial_number,
      department_id,
      status,
      purchase_date,
      warranty_end_date,
      is_active
    )
    select
      'TEMP-WARRANTY-FAIL',
      '11111111-1111-4111-8111-111111111111'::uuid,
      'desktop'::public.device_type,
      'TestBrand',
      'BrokenWarranty',
      'TEMP-WARRANTY-FAIL-SN',
      d.id,
      'active'::public.device_status,
      date '2026-01-02',
      date '2025-01-01',
      true
    from public.departments as d
    order by d.created_at
    limit 1;

    raise exception 'Warranty check did not block invalid dates';
  exception
    when check_violation then
      null;
  end;

  begin
    insert into public.ticket_attachments (
      ticket_id,
      uploaded_by,
      bucket_name,
      object_path,
      original_file_name,
      content_type,
      size_bytes
    )
    values (
      gen_random_uuid(),
      gen_random_uuid(),
      'ticket-attachments',
      'invalid/object/path',
      'demo.pdf',
      'application/pdf',
      -1
    );

    raise exception 'Attachment size constraint did not block negative file sizes';
  exception
    when check_violation or foreign_key_violation then
      null;
  end;
end
$$;

rollback;
