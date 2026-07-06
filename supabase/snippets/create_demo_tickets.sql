-- Controlled demo ticket and comment generator.
-- Run this snippet only from Supabase SQL Editor or another privileged
-- database-owner context after the demo auth users and profile rows exist.
--
-- This script intentionally resolves auth/profile UUID values by e-mail and
-- device UUID values by asset_tag so it can be reused across local and remote
-- environments without hard-coded auth UUID assumptions.

begin;

do $$
declare
  employee_user_id uuid;
  technician_user_id uuid;
  admin_user_id uuid;
  employee_department_id uuid;
  it_department_id uuid;
  demo_pc_id uuid;
  demo_laptop_id uuid;
  demo_printer_id uuid;
  seed record;
  resolved_ticket_id uuid;
  existing_status public.ticket_status;
begin
  select u.id
  into employee_user_id
  from auth.users as u
  where u.email = 'employee.demo@example.com';

  select u.id
  into technician_user_id
  from auth.users as u
  where u.email = 'technician.demo@example.com';

  select u.id
  into admin_user_id
  from auth.users as u
  where u.email = 'admin.demo@example.com';

  if employee_user_id is null or technician_user_id is null or admin_user_id is null then
    raise exception 'Demo auth kullanicilari eksik. employee.demo@example.com, technician.demo@example.com ve admin.demo@example.com hesaplarini once olusturun.';
  end if;

  select d.id
  into employee_department_id
  from public.departments as d
  where d.code = 'IK';

  select d.id
  into it_department_id
  from public.departments as d
  where d.code = 'BILGI_ISLEM';

  if employee_department_id is null or it_department_id is null then
    raise exception 'Beklenen departman seed kayitlari bulunamadi. IK ve BILGI_ISLEM kayitlarini kontrol edin.';
  end if;

  select d.id into demo_pc_id
  from public.devices as d
  where d.asset_tag = 'DEMO-PC-001';

  select d.id into demo_laptop_id
  from public.devices as d
  where d.asset_tag = 'DEMO-LPT-001';

  select d.id into demo_printer_id
  from public.devices as d
  where d.asset_tag = 'DEMO-PRN-001';

  if demo_pc_id is null or demo_laptop_id is null or demo_printer_id is null then
    raise exception 'Beklenen demo cihaz kayitlari eksik. DEMO-PC-001, DEMO-LPT-001 ve DEMO-PRN-001 asset_tag kayitlarini kontrol edin.';
  end if;

  create temporary table if not exists pg_temp.demo_ticket_seed (
    sort_order integer primary key,
    title text not null,
    description text not null,
    category public.ticket_category not null,
    priority public.ticket_priority not null,
    department_id uuid not null,
    device_id uuid,
    creator_id uuid not null,
    lifecycle_actor_id uuid not null,
    assigned_to_id uuid,
    due_at timestamptz,
    final_status public.ticket_status not null
  ) on commit drop;

  truncate pg_temp.demo_ticket_seed;

  insert into pg_temp.demo_ticket_seed (
    sort_order,
    title,
    description,
    category,
    priority,
    department_id,
    device_id,
    creator_id,
    lifecycle_actor_id,
    assigned_to_id,
    due_at,
    final_status
  )
  values
    (
      1,
      'Demo yazici kagit sikismasi',
      'Kurgusal demo kaydi. Kullanici yazicida tekrar eden kagit sikismasi oldugunu ve ciktinin tamamlanamadigini iletiyor.',
      'printer_scanner',
      'normal',
      employee_department_id,
      demo_printer_id,
      employee_user_id,
      technician_user_id,
      null,
      now() + interval '1 day',
      'open'
    ),
    (
      2,
      'Demo bilgisayar acilis yavasligi',
      'Kurgusal demo kaydi. Masaustu cihaz acilisinda belirgin yavaslama ve oturum gecisinde bekleme oldugu bildirildi.',
      'hardware',
      'high',
      employee_department_id,
      demo_pc_id,
      employee_user_id,
      technician_user_id,
      technician_user_id,
      now() + interval '2 days',
      'assigned'
    ),
    (
      3,
      'Demo ag baglantisi kesintisi',
      'Kurgusal demo kaydi. Kullanici belirli araliklarla ag baglantisinin koptugunu ve paylasimli kayitlara ulasamadigini belirtiyor.',
      'network',
      'urgent',
      employee_department_id,
      demo_laptop_id,
      employee_user_id,
      technician_user_id,
      technician_user_id,
      now() + interval '6 hours',
      'in_progress'
    ),
    (
      4,
      'Demo e-posta erisim sorunu',
      'Kurgusal demo kaydi. E-posta kutusu aciliyor ancak gonderim sirasinda erisim hatasi aliniyor.',
      'email_account',
      'high',
      employee_department_id,
      null,
      employee_user_id,
      admin_user_id,
      admin_user_id,
      now() + interval '1 day',
      'resolved'
    ),
    (
      5,
      'Demo dahili teknik kontrol kaydi',
      'Kurgusal demo kaydi. Teknik ekip tarafinda yalnizca ic kontrol ve ortam dogrulamasi icin acilan test kaydidir.',
      'software',
      'low',
      it_department_id,
      demo_pc_id,
      technician_user_id,
      technician_user_id,
      technician_user_id,
      now() + interval '3 days',
      'in_progress'
    ),
    (
      6,
      'Demo yazilim kurulum talebi',
      'Kurgusal demo kaydi. Yonetici tarafinda acilan ornek kurulum talebi; test amacli surec ve filtre dogrulamasi icin kullanilir.',
      'software',
      'low',
      it_department_id,
      demo_laptop_id,
      admin_user_id,
      admin_user_id,
      technician_user_id,
      now() + interval '2 days',
      'waiting_user'
    );

  for seed in
    select *
    from pg_temp.demo_ticket_seed
    order by sort_order
  loop
    select t.id, t.status
    into resolved_ticket_id, existing_status
    from public.tickets as t
    where t.title = seed.title
      and t.created_by = seed.creator_id
    order by t.created_at desc
    limit 1;

    if resolved_ticket_id is null then
      perform set_config('request.jwt.claim.sub', seed.creator_id::text, true);

      insert into public.tickets (
        title,
        description,
        category,
        priority,
        department_id,
        device_id,
        due_at
      )
      values (
        seed.title,
        seed.description,
        seed.category,
        seed.priority,
        seed.department_id,
        seed.device_id,
        seed.due_at
      )
      returning id, status into resolved_ticket_id, existing_status;
    end if;

    if existing_status = 'open' and seed.final_status <> 'open' then
      perform set_config('request.jwt.claim.sub', seed.lifecycle_actor_id::text, true);

      update public.tickets as t
      set
        assigned_to = coalesce(seed.assigned_to_id, t.assigned_to),
        due_at = coalesce(t.due_at, seed.due_at),
        status = 'assigned'
      where t.id = resolved_ticket_id
        and t.status = 'open';

      select t.status
      into existing_status
      from public.tickets as t
      where t.id = resolved_ticket_id;
    end if;

    if existing_status = 'assigned' and seed.final_status in ('in_progress', 'waiting_user', 'resolved') then
      perform set_config('request.jwt.claim.sub', seed.lifecycle_actor_id::text, true);

      update public.tickets
      set status = 'in_progress'
      where id = resolved_ticket_id
        and status = 'assigned';

      select t.status
      into existing_status
      from public.tickets as t
      where t.id = resolved_ticket_id;
    end if;

    if existing_status = 'in_progress' and seed.final_status = 'waiting_user' then
      perform set_config('request.jwt.claim.sub', seed.lifecycle_actor_id::text, true);

      update public.tickets
      set status = 'waiting_user'
      where id = resolved_ticket_id
        and status = 'in_progress';

      select t.status
      into existing_status
      from public.tickets as t
      where t.id = resolved_ticket_id;
    end if;

    if existing_status in ('in_progress', 'waiting_user') and seed.final_status = 'resolved' then
      perform set_config('request.jwt.claim.sub', seed.lifecycle_actor_id::text, true);

      update public.tickets
      set status = 'resolved'
      where id = resolved_ticket_id
        and status in ('in_progress', 'waiting_user');
    end if;
  end loop;

  create temporary table if not exists pg_temp.demo_comment_seed (
    sort_order integer primary key,
    ticket_title text not null,
    author_id uuid not null,
    content text not null,
    is_internal boolean not null default false
  ) on commit drop;

  truncate pg_temp.demo_comment_seed;

  insert into pg_temp.demo_comment_seed (
    sort_order,
    ticket_title,
    author_id,
    content,
    is_internal
  )
  values
    (
      1,
      'Demo yazici kagit sikismasi',
      employee_user_id,
      'Kurgusal demo notu: Sorun ilk kat ortak yazicida test edildi, kagit yolu kontrol edilmesini rica ediyorum.',
      false
    ),
    (
      2,
      'Demo bilgisayar acilis yavasligi',
      technician_user_id,
      'Genel yorum: Baslangic uygulamalari ve disk doluluk orani kontrol edilmek uzere ticket teknik ekibe atandi.',
      false
    ),
    (
      3,
      'Demo bilgisayar acilis yavasligi',
      technician_user_id,
      'Ic teknik not: Profil acilis suresini etkileyen arka plan servisleri icin ayrintili log toplaniyor.',
      true
    ),
    (
      4,
      'Demo e-posta erisim sorunu',
      admin_user_id,
      'Ic teknik not: Kurgusal hesabın posta istemcisi yetki tokeni yenilenerek tekrar test edildi.',
      true
    ),
    (
      5,
      'Demo e-posta erisim sorunu',
      admin_user_id,
      'Genel yorum: E-posta erisimi tekrar dogrulandi ve kullaniciya test sonrasi olumlu geri donus verildi.',
      false
    ),
    (
      6,
      'Demo ag baglantisi kesintisi',
      technician_user_id,
      'Ic teknik not: Bu kayit employee tarafinda gorunmemesi gereken ag testi ayrintilarini icerir.',
      true
    );

  for seed in
    select *
    from pg_temp.demo_comment_seed
    order by sort_order
  loop
    select t.id
    into resolved_ticket_id
    from public.tickets as t
    where t.title = seed.ticket_title
    order by t.created_at desc
    limit 1;

    if resolved_ticket_id is null then
      raise exception 'Yorum eklenmek istenen ticket bulunamadi: %', seed.ticket_title;
    end if;

    if not exists (
      select 1
      from public.ticket_comments as c
      where c.ticket_id = resolved_ticket_id
        and c.author_id = seed.author_id
        and c.is_internal = seed.is_internal
        and c.content = seed.content
    ) then
      perform set_config('request.jwt.claim.sub', seed.author_id::text, true);

      insert into public.ticket_comments (
        ticket_id,
        author_id,
        content,
        is_internal
      )
      values (
        resolved_ticket_id,
        seed.author_id,
        seed.content,
        seed.is_internal
      );
    end if;
  end loop;

  perform set_config('request.jwt.claim.sub', '', true);
end;
$$;

select
  t.ticket_number,
  t.title,
  t.status,
  p.full_name as created_by_name,
  a.full_name as assigned_to_name
from public.tickets as t
join public.profiles as p
  on p.id = t.created_by
left join public.profiles as a
  on a.id = t.assigned_to
where t.title in (
  'Demo yazici kagit sikismasi',
  'Demo bilgisayar acilis yavasligi',
  'Demo ag baglantisi kesintisi',
  'Demo e-posta erisim sorunu',
  'Demo yazilim kurulum talebi',
  'Demo dahili teknik kontrol kaydi'
)
order by t.ticket_number;

commit;
