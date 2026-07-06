begin;

create extension if not exists pgcrypto;

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) >= 2),
  code text not null unique check (code = upper(code) and code ~ '^[A-Z0-9_]+$'),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.departments is 'Department reference data used by profiles, devices and tickets.';
comment on column public.departments.code is 'Stable uppercase department code used in seed data and future integrations.';
comment on column public.departments.is_active is 'Soft status flag. Departments should be deactivated instead of deleted.';

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  role public.app_role not null default 'employee',
  department_id uuid references public.departments (id) on delete set null,
  phone_extension text check (phone_extension is null or phone_extension ~ '^[0-9]{1,10}$'),
  job_title text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Application profile rows linked one-to-one with Supabase Auth users.';
comment on column public.profiles.id is 'Matches auth.users.id and is created automatically by trigger.';
comment on column public.profiles.role is 'Role value resolved by helper functions and RLS policies.';
comment on column public.profiles.department_id is 'Optional department assignment for the user profile.';

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  asset_tag text not null unique check (char_length(btrim(asset_tag)) between 3 and 50),
  qr_token uuid not null unique default gen_random_uuid(),
  device_type public.device_type not null,
  brand text not null check (char_length(btrim(brand)) >= 2),
  model text not null check (char_length(btrim(model)) >= 1),
  serial_number text unique,
  department_id uuid references public.departments (id) on delete restrict,
  assigned_user_id uuid references public.profiles (id) on delete set null,
  status public.device_status not null default 'active',
  purchase_date date,
  warranty_end_date date,
  ip_address inet,
  mac_address text check (
    mac_address is null
    or mac_address ~* '^([0-9a-f]{2}:){5}[0-9a-f]{2}$'
  ),
  operating_system text,
  notes text,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint devices_serial_not_blank check (
    serial_number is null or char_length(btrim(serial_number)) >= 3
  ),
  constraint devices_warranty_after_purchase check (
    purchase_date is null
    or warranty_end_date is null
    or warranty_end_date >= purchase_date
  )
);

comment on table public.devices is 'Inventory records for municipal devices managed by the prototype.';
comment on column public.devices.asset_tag is 'Human-visible inventory tag that must remain unique.';
comment on column public.devices.qr_token is 'Opaque UUID used for QR workflows so raw serial numbers are not exposed.';
comment on column public.devices.assigned_user_id is 'Profile currently responsible for the device.';
comment on column public.devices.created_by is 'Profile that created the device row. Nullable for seed-only reference rows.';

create sequence public.ticket_number_seq
  start with 1000
  increment by 1
  minvalue 1000
  cache 1;

comment on sequence public.ticket_number_seq is 'User-facing ticket numbering sequence.';

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number bigint not null unique default nextval('public.ticket_number_seq'),
  title text not null check (char_length(btrim(title)) between 5 and 180),
  description text not null check (char_length(btrim(description)) >= 10),
  category public.ticket_category not null,
  priority public.ticket_priority not null default 'normal',
  status public.ticket_status not null default 'open',
  department_id uuid not null references public.departments (id) on delete restrict,
  device_id uuid references public.devices (id) on delete set null,
  created_by uuid not null references public.profiles (id) on delete restrict,
  assigned_to uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  assigned_at timestamptz,
  due_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  constraint tickets_due_after_created check (
    due_at is null or due_at >= created_at
  )
);

comment on table public.tickets is 'Core support requests created by employees and managed by technicians or admins.';
comment on column public.tickets.ticket_number is 'Incrementing number displayed to end users alongside UUID primary key.';
comment on column public.tickets.created_by is 'Profile that originally created the support request.';
comment on column public.tickets.assigned_to is 'Technician or admin profile currently assigned to the ticket.';

create table public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete restrict,
  content text not null check (char_length(btrim(content)) >= 1),
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ticket_comments is 'Discussion records attached to tickets. Internal notes are hidden from employees.';
comment on column public.ticket_comments.is_internal is 'Marks comments as technician/admin only.';

create table public.ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  uploaded_by uuid not null references public.profiles (id) on delete restrict,
  bucket_name text not null default 'ticket-attachments',
  object_path text not null unique check (char_length(btrim(object_path)) >= 1),
  original_file_name text not null check (char_length(btrim(original_file_name)) >= 1),
  content_type text not null check (char_length(btrim(content_type)) >= 3),
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

comment on table public.ticket_attachments is 'Metadata table for files stored in Supabase Storage.';
comment on column public.ticket_attachments.object_path is 'Private storage object path. File bytes are not stored in PostgreSQL.';

create table public.ticket_status_history (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  old_status public.ticket_status,
  new_status public.ticket_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

comment on table public.ticket_status_history is 'Append-only status change history for tickets.';
comment on column public.ticket_status_history.changed_by is 'Profile that caused the change when available.';

create table public.device_maintenance_records (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices (id) on delete cascade,
  ticket_id uuid references public.tickets (id) on delete set null,
  maintenance_type public.maintenance_type not null,
  description text not null check (char_length(btrim(description)) >= 3),
  performed_by uuid not null references public.profiles (id) on delete restrict,
  performed_at timestamptz not null default now(),
  cost numeric(12,2) not null default 0 check (cost >= 0),
  parts_used text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.device_maintenance_records is 'Maintenance, repair and upgrade history for devices.';
comment on column public.device_maintenance_records.ticket_id is 'Optional originating ticket for the maintenance work.';

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  entity_type text not null check (char_length(btrim(entity_type)) >= 2),
  entity_id uuid not null,
  action text not null check (char_length(btrim(action)) >= 2),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

comment on table public.activity_logs is 'Lightweight activity log for critical device and ticket operations.';
comment on column public.activity_logs.metadata is 'Structured metadata. Secret values, tokens and raw file content must never be logged.';

create index profiles_department_id_idx on public.profiles (department_id);
create index devices_department_id_idx on public.devices (department_id);
create index devices_assigned_user_id_idx on public.devices (assigned_user_id);
create index devices_status_idx on public.devices (status);
create index tickets_created_by_idx on public.tickets (created_by);
create index tickets_assigned_to_idx on public.tickets (assigned_to);
create index tickets_status_idx on public.tickets (status);
create index tickets_priority_idx on public.tickets (priority);
create index tickets_department_id_idx on public.tickets (department_id);
create index tickets_device_id_idx on public.tickets (device_id);
create index tickets_created_at_idx on public.tickets (created_at desc);
create index ticket_comments_ticket_id_idx on public.ticket_comments (ticket_id);
create index ticket_attachments_ticket_id_idx on public.ticket_attachments (ticket_id);
create index ticket_status_history_ticket_id_idx on public.ticket_status_history (ticket_id);
create index device_maintenance_records_device_id_idx on public.device_maintenance_records (device_id);
create index activity_logs_entity_idx on public.activity_logs (entity_type, entity_id);

commit;
