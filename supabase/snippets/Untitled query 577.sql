begin;

do $$
declare
  target_table text;
  required_tables text[] := array[
    'departments',
    'profiles',
    'devices',
    'tickets',
    'ticket_comments',
    'ticket_attachments',
    'ticket_status_history',
    'device_maintenance_records',
    'activity_logs'
  ];
begin
  foreach target_table in array required_tables
  loop
    if not exists (
      select 1
      from pg_class as c
      join pg_namespace as n
        on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = target_table
        and c.relrowsecurity = true
    ) then
      raise exception 'RLS is not enabled on public.%', target_table;
    end if;
  end loop;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'tickets'
      and policyname = 'employees_can_create_own_tickets'
  ) then
    raise exception 'Missing expected ticket insert policy';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'admins_can_manage_profiles'
  ) then
    raise exception 'Missing expected profiles admin policy';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'users_can_upload_ticket_attachment_objects'
  ) then
    raise exception 'Missing expected storage upload policy';
  end if;
end
$$;

rollback;
