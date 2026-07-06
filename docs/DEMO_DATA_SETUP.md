# DEMO_DATA_SETUP

## Seed Neleri Olusturur

`supabase/seed.sql` yalnizca guvenli demo referans verileri uretir:

- Departman kayitlari
- Kurgusal cihaz envanteri
- QR token degerleri
- Marka, model ve garanti bitis bilgileri

Seed tekrar calistirildiginda duplicate olusturmamasi icin `on conflict` yaklasimi kullanilir.

## Seed Neleri Bilerek Olusturmaz

- `auth.users` icine demo kullanici
- Ticket kayitlari
- Ticket yorumlari
- Attachment metadata kayitlari
- Bakim kayitlari
- Activity log kayitlari

Auth kullanicilari ve role atamalari migration veya seed icine gomulmez.

## Demo Kullanici Olusturma Sirasi

Migrationlar uzak gelistirme projesine uygulandiktan sonra Supabase Dashboard > Auth bolumunden su kurgusal hesaplar olusturulabilir:

- `employee.demo@example.com`
- `technician.demo@example.com`
- `admin.demo@example.com`

Parola bu dokumana yazilmaz. Gercek kurum e-postasi veya gercek personel adi kullanilmaz.

Metadata alaninda su kurgu isimler tercih edilebilir:

- `Demo Personel`
- `Demo Teknik Personel`
- `Demo Yonetici`

## Beklenen Trigger Davranisi

Yeni auth kullanicisi olusturuldugunda `handle_new_user()` trigger'inin `public.profiles` tablosunda bir satir olusturmasi beklenir.

Ilk kontrol icin:

```sql
select
  u.id,
  u.email,
  p.full_name,
  p.role,
  p.is_active
from auth.users as u
left join public.profiles as p
  on p.id = u.id
where u.email in (
  'employee.demo@example.com',
  'technician.demo@example.com',
  'admin.demo@example.com'
);
```

## Rol ve Birim Atama Ornekleri

Technician profiline rol ve birim atamak icin:

```sql
update public.profiles as p
set
  role = 'technician',
  department_id = (
    select id
    from public.departments
    where code = 'BILGI_ISLEM'
  ),
  full_name = 'Demo Teknik Personel',
  is_active = true
from auth.users as u
where p.id = u.id
  and u.email = 'technician.demo@example.com';
```

Admin profiline rol ve birim atamak icin:

```sql
update public.profiles as p
set
  role = 'admin',
  department_id = (
    select id
    from public.departments
    where code = 'BILGI_ISLEM'
  ),
  full_name = 'Demo Yonetici',
  is_active = true
from auth.users as u
where p.id = u.id
  and u.email = 'admin.demo@example.com';
```

Employee profiline birim ve ad kontrolu icin:

```sql
update public.profiles as p
set
  department_id = (
    select id
    from public.departments
    where code = 'IK'
  ),
  full_name = 'Demo Personel',
  is_active = true
from auth.users as u
where p.id = u.id
  and u.email = 'employee.demo@example.com';
```

## Son Kontrol

```sql
select
  u.email,
  p.full_name,
  p.role,
  p.is_active,
  d.name as department_name
from auth.users as u
join public.profiles as p
  on p.id = u.id
left join public.departments as d
  on d.id = p.department_id
where u.email in (
  'employee.demo@example.com',
  'technician.demo@example.com',
  'admin.demo@example.com'
)
order by u.email;
```

## Kurallar

- Migration veya seed icine sabit auth UUID koymayin.
- Parolalari, token'lari veya secret key'leri bu dokumana yazmayin.
- Gercek kurum verisi, gercek cihaz seri numarasi veya gercek personel bilgisi kullanmayin.
