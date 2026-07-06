begin;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles as p
  where p.id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin'::public.app_role, false)
$$;

create or replace function public.is_technician_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('technician'::public.app_role, 'admin'::public.app_role), false)
$$;

create or replace function public.user_can_be_ticket_assignee(target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = target_profile_id
      and p.is_active = true
      and p.role in ('technician'::public.app_role, 'admin'::public.app_role)
  )
$$;

create or replace function public.validate_ticket_status_transition(
  old_status public.ticket_status,
  new_status public.ticket_status
)
returns boolean
language sql
immutable
as $$
  select case
    when old_status is null then true
    when old_status = new_status then true
    when old_status in ('closed'::public.ticket_status, 'cancelled'::public.ticket_status) then false
    else (old_status, new_status) in (
      ('open'::public.ticket_status, 'assigned'::public.ticket_status),
      ('open'::public.ticket_status, 'cancelled'::public.ticket_status),
      ('assigned'::public.ticket_status, 'in_progress'::public.ticket_status),
      ('assigned'::public.ticket_status, 'open'::public.ticket_status),
      ('in_progress'::public.ticket_status, 'waiting_user'::public.ticket_status),
      ('in_progress'::public.ticket_status, 'resolved'::public.ticket_status),
      ('in_progress'::public.ticket_status, 'assigned'::public.ticket_status),
      ('waiting_user'::public.ticket_status, 'in_progress'::public.ticket_status),
      ('waiting_user'::public.ticket_status, 'resolved'::public.ticket_status),
      ('resolved'::public.ticket_status, 'closed'::public.ticket_status),
      ('resolved'::public.ticket_status, 'in_progress'::public.ticket_status)
    )
  end
$$;

create or replace function public.storage_ticket_uuid_from_path(object_path text)
returns uuid
language sql
immutable
as $$
  select case
    when object_path is null then null
    when substring(
      object_path
      from '^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(/|$)'
    ) is null then null
    else split_part(object_path, '/', 1)::uuid
  end
$$;

create or replace function public.can_access_ticket(target_ticket_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  if public.is_technician_or_admin() then
    return exists (
      select 1
      from public.tickets as t
      where t.id = target_ticket_id
    );
  end if;

  return exists (
    select 1
    from public.tickets as t
    where t.id = target_ticket_id
      and t.created_by = auth.uid()
  );
end;
$$;

create or replace function public.can_access_device(target_device_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  if public.is_technician_or_admin() then
    return exists (
      select 1
      from public.devices as d
      where d.id = target_device_id
    );
  end if;

  return exists (
    select 1
    from public.devices as d
    where d.id = target_device_id
      and d.is_active = true
      and d.assigned_user_id = auth.uid()
  );
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  resolved_full_name text;
begin
  resolved_full_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    'Demo User'
  );

  insert into public.profiles (id, full_name)
  values (new.id, resolved_full_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.protect_profile_mutation()
returns trigger
language plpgsql
as $$
begin
  new.full_name := btrim(new.full_name);

  if char_length(new.full_name) < 2 then
    raise exception 'Profile full_name must contain at least 2 characters';
  end if;

  if not public.is_admin() then
    if auth.uid() is null or auth.uid() <> old.id then
      raise exception 'Only administrators may update another profile';
    end if;

    if new.role is distinct from old.role then
      raise exception 'Only administrators may change profile roles';
    end if;

    if new.department_id is distinct from old.department_id then
      raise exception 'Only administrators may change department assignments';
    end if;

    if new.is_active is distinct from old.is_active then
      raise exception 'Only administrators may activate or deactivate profiles';
    end if;
  end if;

  new.phone_extension := nullif(btrim(new.phone_extension), '');
  new.job_title := nullif(btrim(new.job_title), '');
  return new;
end;
$$;

create or replace function public.handle_ticket_write()
returns trigger
language plpgsql
as $$
declare
  current_role public.app_role := public.current_user_role();
  status_requires_assignee boolean;
begin
  new.title := btrim(new.title);
  new.description := btrim(new.description);

  if tg_op = 'INSERT' then
    if current_role = 'employee' then
      new.created_by := auth.uid();
      new.status := 'open';
      new.assigned_to := null;
      new.assigned_at := null;
      new.resolved_at := null;
      new.closed_at := null;
    elsif new.created_by is null and auth.uid() is not null then
      new.created_by := auth.uid();
    end if;
  elsif current_role = 'employee' then
    raise exception 'Employees cannot update tickets directly';
  end if;

  if new.assigned_to is not null and not public.user_can_be_ticket_assignee(new.assigned_to) then
    raise exception 'Assigned ticket user must be an active technician or admin';
  end if;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    if not public.validate_ticket_status_transition(old.status, new.status) then
      raise exception 'Invalid ticket status transition from % to %', old.status, new.status;
    end if;
  end if;

  status_requires_assignee := new.status in (
    'assigned'::public.ticket_status,
    'in_progress'::public.ticket_status,
    'waiting_user'::public.ticket_status,
    'resolved'::public.ticket_status,
    'closed'::public.ticket_status
  );

  if status_requires_assignee and new.assigned_to is null then
    raise exception 'Ticket status % requires an assigned technician or admin', new.status;
  end if;

  if new.status = 'open' then
    new.assigned_to := null;
    new.assigned_at := null;
    new.resolved_at := null;
    new.closed_at := null;
  elsif new.status = 'assigned' then
    if tg_op = 'INSERT' or old.assigned_to is distinct from new.assigned_to or old.status is distinct from 'assigned'::public.ticket_status then
      new.assigned_at := now();
    elsif new.assigned_at is null then
      new.assigned_at := now();
    end if;

    new.resolved_at := null;
    new.closed_at := null;
  elsif new.status in ('in_progress'::public.ticket_status, 'waiting_user'::public.ticket_status) then
    if new.assigned_at is null then
      new.assigned_at := now();
    end if;

    new.resolved_at := null;
    new.closed_at := null;
  elsif new.status = 'resolved' then
    if new.assigned_at is null then
      new.assigned_at := now();
    end if;

    if tg_op = 'INSERT' or old.status is distinct from 'resolved'::public.ticket_status then
      new.resolved_at := now();
    end if;

    new.closed_at := null;
  elsif new.status = 'closed' then
    if new.assigned_at is null then
      new.assigned_at := now();
    end if;

    if new.resolved_at is null then
      new.resolved_at := now();
    end if;

    if tg_op = 'INSERT' or old.status is distinct from 'closed'::public.ticket_status then
      new.closed_at := now();
    end if;
  elsif new.status = 'cancelled' then
    new.closed_at := null;
  end if;

  return new;
end;
$$;

create or replace function public.normalize_ticket_comment_write()
returns trigger
language plpgsql
as $$
begin
  new.content := btrim(new.content);

  if char_length(new.content) < 1 then
    raise exception 'Comment content cannot be empty';
  end if;

  if tg_op = 'INSERT' and auth.uid() is not null then
    new.author_id := auth.uid();
  end if;

  if public.current_user_role() = 'employee' and new.is_internal then
    raise exception 'Employees cannot create internal comments';
  end if;

  return new;
end;
$$;

create or replace function public.normalize_ticket_attachment_write()
returns trigger
language plpgsql
as $$
begin
  new.bucket_name := 'ticket-attachments';
  new.object_path := btrim(new.object_path);
  new.original_file_name := btrim(new.original_file_name);
  new.content_type := btrim(new.content_type);

  if tg_op = 'INSERT' and auth.uid() is not null then
    new.uploaded_by := auth.uid();
  elsif tg_op = 'UPDATE' then
    new.uploaded_by := old.uploaded_by;
  end if;

  return new;
end;
$$;

create or replace function public.normalize_device_maintenance_write()
returns trigger
language plpgsql
as $$
begin
  new.description := btrim(new.description);
  new.parts_used := nullif(btrim(new.parts_used), '');

  if tg_op = 'INSERT' and auth.uid() is not null then
    new.performed_by := auth.uid();
  elsif tg_op = 'UPDATE' then
    new.performed_by := old.performed_by;
  end if;

  return new;
end;
$$;

create or replace function public.write_ticket_status_history()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.ticket_status_history (
      ticket_id,
      old_status,
      new_status,
      changed_by,
      note
    )
    values (
      new.id,
      null,
      new.status,
      coalesce(auth.uid(), new.created_by),
      'Initial ticket creation'
    );
  elsif new.status is distinct from old.status then
    insert into public.ticket_status_history (
      ticket_id,
      old_status,
      new_status,
      changed_by,
      note
    )
    values (
      new.id,
      old.status,
      new.status,
      coalesce(auth.uid(), new.assigned_to, old.assigned_to, new.created_by),
      null
    );
  end if;

  return null;
end;
$$;

create or replace function public.write_ticket_activity_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is null then
    return null;
  end if;

  if tg_op = 'INSERT' then
    insert into public.activity_logs (actor_id, entity_type, entity_id, action, metadata)
    values (
      actor,
      'ticket',
      new.id,
      'created',
      jsonb_build_object(
        'ticket_number', new.ticket_number,
        'status', new.status,
        'priority', new.priority
      )
    );
  elsif tg_op = 'UPDATE' then
    insert into public.activity_logs (actor_id, entity_type, entity_id, action, metadata)
    values (
      actor,
      'ticket',
      new.id,
      case
        when new.status is distinct from old.status then 'status_changed'
        when new.assigned_to is distinct from old.assigned_to then 'assignment_changed'
        else 'updated'
      end,
      jsonb_strip_nulls(
        jsonb_build_object(
          'ticket_number', new.ticket_number,
          'old_status', old.status,
          'new_status', new.status,
          'old_assigned_to', old.assigned_to,
          'new_assigned_to', new.assigned_to
        )
      )
    );
  end if;

  return null;
end;
$$;

create or replace function public.write_device_activity_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is null then
    return null;
  end if;

  if tg_op = 'INSERT' then
    insert into public.activity_logs (actor_id, entity_type, entity_id, action, metadata)
    values (
      actor,
      'device',
      new.id,
      'created',
      jsonb_build_object(
        'asset_tag', new.asset_tag,
        'status', new.status,
        'device_type', new.device_type
      )
    );
  elsif tg_op = 'UPDATE' then
    insert into public.activity_logs (actor_id, entity_type, entity_id, action, metadata)
    values (
      actor,
      'device',
      new.id,
      case
        when new.status is distinct from old.status then 'status_changed'
        else 'updated'
      end,
      jsonb_strip_nulls(
        jsonb_build_object(
          'asset_tag', new.asset_tag,
          'old_status', old.status,
          'new_status', new.status,
          'assigned_user_id', new.assigned_user_id
        )
      )
    );
  end if;

  return null;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create trigger protect_profile_mutation_before_update
before update on public.profiles
for each row
execute function public.protect_profile_mutation();

create trigger set_departments_updated_at
before update on public.departments
for each row
execute function public.set_updated_at();

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_devices_updated_at
before update on public.devices
for each row
execute function public.set_updated_at();

create trigger set_tickets_updated_at
before update on public.tickets
for each row
execute function public.set_updated_at();

create trigger set_ticket_comments_updated_at
before update on public.ticket_comments
for each row
execute function public.set_updated_at();

create trigger set_device_maintenance_updated_at
before update on public.device_maintenance_records
for each row
execute function public.set_updated_at();

create trigger normalize_ticket_before_write
before insert or update on public.tickets
for each row
execute function public.handle_ticket_write();

create trigger write_ticket_history_after_write
after insert or update on public.tickets
for each row
execute function public.write_ticket_status_history();

create trigger write_ticket_activity_after_write
after insert or update on public.tickets
for each row
execute function public.write_ticket_activity_log();

create trigger write_device_activity_after_write
after insert or update on public.devices
for each row
execute function public.write_device_activity_log();

create trigger normalize_ticket_comment_before_write
before insert or update on public.ticket_comments
for each row
execute function public.normalize_ticket_comment_write();

create trigger normalize_ticket_attachment_before_write
before insert or update on public.ticket_attachments
for each row
execute function public.normalize_ticket_attachment_write();

create trigger normalize_device_maintenance_before_write
before insert or update on public.device_maintenance_records
for each row
execute function public.normalize_device_maintenance_write();

commit;
