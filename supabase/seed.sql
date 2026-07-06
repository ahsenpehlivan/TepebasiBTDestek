begin;

insert into public.departments (
  code,
  name,
  description,
  is_active
)
values
  ('BILGI_ISLEM', 'Bilgi İşlem', 'Demo seed kaydı - teknik destek koordinasyonu için örnek müdürlük.', true),
  ('IK', 'İnsan Kaynakları', 'Demo seed kaydı - personel süreçleri için örnek müdürlük.', true),
  ('MALI_HIZMETLER', 'Mali Hizmetler', 'Demo seed kaydı - mali süreçler için örnek müdürlük.', true),
  ('FEN_ISLERI', 'Fen İşleri', 'Demo seed kaydı - saha operasyonları için örnek müdürlük.', true),
  ('PARK_BAHCELER', 'Park ve Bahçeler', 'Demo seed kaydı - çevre ve bakım süreçleri için örnek müdürlük.', true),
  ('KULTUR_SOSYAL', 'Kültür ve Sosyal İşler', 'Demo seed kaydı - etkinlik ve sosyal hizmet süreçleri için örnek müdürlük.', true)
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active;

with device_seed as (
  select *
  from (
    values
      (
        'DEMO-PC-001',
        '00000000-0000-4000-8000-000000000001'::uuid,
        'desktop'::public.device_type,
        'DemoTech',
        'OfficeStation A1',
        'DEMO-SN-0001',
        'BILGI_ISLEM',
        'active'::public.device_status,
        date '2025-01-15',
        date '2028-01-15',
        '10.10.10.11'::inet,
        'aa:bb:cc:dd:ee:01',
        'Windows 11 Pro',
        'Demo seed cihazı - gerçek kurum varlığı değildir.'
      ),
      (
        'DEMO-LPT-001',
        '00000000-0000-4000-8000-000000000002'::uuid,
        'laptop'::public.device_type,
        'DemoTech',
        'FieldBook X2',
        'DEMO-SN-0002',
        'IK',
        'active'::public.device_status,
        date '2025-03-10',
        date '2028-03-10',
        null,
        'aa:bb:cc:dd:ee:02',
        'Windows 11 Pro',
        'Demo seed cihazı - test amaçlı dizüstü kayıt.'
      ),
      (
        'DEMO-PRN-001',
        '00000000-0000-4000-8000-000000000003'::uuid,
        'printer'::public.device_type,
        'PrintLab',
        'MonoJet P4',
        'DEMO-SN-0003',
        'MALI_HIZMETLER',
        'in_repair'::public.device_status,
        date '2024-06-01',
        date '2027-06-01',
        null,
        'aa:bb:cc:dd:ee:03',
        null,
        'Demo seed cihazı - bakım geçmişi için ayrılmış örnek kayıt.'
      ),
      (
        'DEMO-SCN-001',
        '00000000-0000-4000-8000-000000000004'::uuid,
        'scanner'::public.device_type,
        'ScanWorks',
        'Archive S1',
        'DEMO-SN-0004',
        'KULTUR_SOSYAL',
        'spare'::public.device_status,
        date '2023-11-20',
        date '2026-11-20',
        null,
        'aa:bb:cc:dd:ee:04',
        null,
        'Demo seed cihazı - yedek envanter senaryosu için örnek kayıt.'
      )
  ) as value_list (
    asset_tag,
    qr_token,
    device_type,
    brand,
    model,
    serial_number,
    department_code,
    status,
    purchase_date,
    warranty_end_date,
    ip_address,
    mac_address,
    operating_system,
    notes
  )
)
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
  ip_address,
  mac_address,
  operating_system,
  notes,
  is_active
)
select
  s.asset_tag,
  s.qr_token,
  s.device_type,
  s.brand,
  s.model,
  s.serial_number,
  d.id,
  s.status,
  s.purchase_date,
  s.warranty_end_date,
  s.ip_address,
  s.mac_address,
  s.operating_system,
  s.notes,
  true
from device_seed as s
join public.departments as d
  on d.code = s.department_code
on conflict (asset_tag) do update
set
  qr_token = excluded.qr_token,
  device_type = excluded.device_type,
  brand = excluded.brand,
  model = excluded.model,
  serial_number = excluded.serial_number,
  department_id = excluded.department_id,
  status = excluded.status,
  purchase_date = excluded.purchase_date,
  warranty_end_date = excluded.warranty_end_date,
  ip_address = excluded.ip_address,
  mac_address = excluded.mac_address,
  operating_system = excluded.operating_system,
  notes = excluded.notes,
  is_active = excluded.is_active;

commit;
