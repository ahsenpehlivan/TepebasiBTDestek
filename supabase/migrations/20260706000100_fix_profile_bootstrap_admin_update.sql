begin;

create or replace function public.protect_profile_mutation()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('postgres', 'supabase_admin') then
    return new;
  end if;

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

commit;
