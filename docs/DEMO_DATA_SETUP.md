# DEMO_DATA_SETUP

## Seed Neleri Olusturur

`supabase/seed.sql` su guvenli demo referans verilerini olusturur:

- Departman kayitlari
- Kurgusal cihaz envanteri kayitlari
- QR token degerleri
- Ornek marka, model ve garanti bilgileri

Seed tekrar calistirildiginda duplicate olusturmamasi icin `on conflict` yaklasimi kullanilir.

## Seed Neleri Bilerek Olusturmaz

- `auth.users` icine demo kullanici
- Ticket kayitlari
- Ticket yorumlari
- Attachment metadata kayitlari
- Bakim kayitlari
- Activity log kayitlari

Bu karar, kullanici kimligi gerektiren verileri migration veya seed icine gommemek icindir.

## Demo Kullanici Hesaplari Nasil Olusturulur

Supabase projesi hazir olduktan sonra Dashboard > Auth uzerinden yalnizca kurgusal hesaplar olusturulmalidir:

- `employee.demo@example.com`
- `technician.demo@example.com`
- `admin.demo@example.com`

Metadata tarafinda su kurgu isimler kullanilabilir:

- `Demo Personel`
- `Demo Teknik Personel`
- `Demo Yonetici`

Parola bu dokumana yazilmaz.

## Beklenen Trigger Davranisi

Yeni auth kullanicilari olusturuldugunda `handle_new_user()` trigger'inin `public.profiles` tablosunda ilgili satiri olusturmasi beklenir.

Ilk kontrol ornegi:

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

## Bootstrap Role Assignment Notu

Ilk demo admin veya technician role assignment islemi icin yalnizca database-owner baglaminda calisan kontrollu bootstrap istisnasi eklenmistir. Normal `authenticated` kullanicilar kendi rollerini yukseltemez.

Bu nedenle SQL Editor uzerinden ilk rol atamasi yapilabilir; ancak uygulama kullanicilari icin role elevation korumasi devam eder.

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

- Migration veya seed icine sabit auth UUID koymayin
- Parolalari, token'lari veya secret key'leri bu dokumana yazmayin
- Gercek kurum verisi, gercek cihaz seri numarasi veya gercek personel bilgisi kullanmayin
