begin;

create type public.app_role as enum (
  'employee',
  'technician',
  'admin'
);

create type public.ticket_status as enum (
  'open',
  'assigned',
  'in_progress',
  'waiting_user',
  'resolved',
  'closed',
  'cancelled'
);

create type public.ticket_priority as enum (
  'low',
  'normal',
  'high',
  'urgent'
);

create type public.ticket_category as enum (
  'hardware',
  'software',
  'network',
  'printer_scanner',
  'email_account',
  'access_request',
  'other'
);

create type public.device_type as enum (
  'desktop',
  'laptop',
  'monitor',
  'printer',
  'scanner',
  'network_device',
  'tablet',
  'phone',
  'other'
);

create type public.device_status as enum (
  'active',
  'in_repair',
  'spare',
  'retired',
  'lost'
);

create type public.maintenance_type as enum (
  'inspection',
  'repair',
  'upgrade',
  'component_replacement',
  'software_installation',
  'other'
);

comment on type public.app_role is 'Application role used by profile and RLS logic.';
comment on type public.ticket_status is 'Workflow state of a support ticket.';
comment on type public.ticket_priority is 'Priority level stored in English for UI mapping later.';
comment on type public.ticket_category is 'Support request category values used by tickets.';
comment on type public.device_type is 'Device classification used by inventory records.';
comment on type public.device_status is 'Lifecycle state of a managed device.';
comment on type public.maintenance_type is 'Maintenance work classification for device history.';

commit;
