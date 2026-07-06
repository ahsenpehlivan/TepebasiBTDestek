# DATABASE

## Amac

Bu veritabani tasarimi, Tepebasi BT Destek prototipinin ticket yonetimi, cihaz envanteri, bakim gecmisi, yorumlar, dosya ekleri ve rol bazli erisim gereksinimlerini migration tabanli ve genisletilebilir bir yapiyla karsilamak icin hazirlandi.

## Enumlar

- `app_role`: `employee`, `technician`, `admin`
- `ticket_status`: `open`, `assigned`, `in_progress`, `waiting_user`, `resolved`, `closed`, `cancelled`
- `ticket_priority`: `low`, `normal`, `high`, `urgent`
- `ticket_category`: `hardware`, `software`, `network`, `printer_scanner`, `email_account`, `access_request`, `other`
- `device_type`: `desktop`, `laptop`, `monitor`, `printer`, `scanner`, `network_device`, `tablet`, `phone`, `other`
- `device_status`: `active`, `in_repair`, `spare`, `retired`, `lost`
- `maintenance_type`: `inspection`, `repair`, `upgrade`, `component_replacement`, `software_installation`, `other`

Enum degerleri veritabaninda Ingilizce tutulur. Turkce karsiliklar uygulama katmaninda gosterilir.

## Ana Tablolar

- `departments`
- `profiles`
- `devices`
- `tickets`
- `ticket_comments`
- `ticket_attachments`
- `ticket_status_history`
- `device_maintenance_records`
- `activity_logs`

Bu dokuz tablo ana uygulama verisini tasir ve tamaminda RLS etkindir.

## Trigger ve Helper Functionlar

### Ortak

- `set_updated_at()`

### Yetki yardimcilari

- `current_user_role()`
- `is_admin()`
- `is_technician_or_admin()`
- `can_access_ticket(ticket_id uuid)`
- `can_access_device(device_id uuid)`

### Is kurali yardimcilari

- `validate_ticket_status_transition(...)`
- `user_can_be_ticket_assignee(...)`
- `storage_ticket_uuid_from_path(...)`

### Trigger tabanli otomasyon

- `handle_new_user()`
- `protect_profile_mutation()`
- `handle_ticket_write()`
- `write_ticket_status_history()`
- `write_ticket_activity_log()`
- `write_device_activity_log()`

## Cihaz ve Bakim Is Kurallari

`devices` tablosu icin bu asamada web tarafinda su alanlar aktif olarak kullanilir:

- `asset_tag`
- `qr_token`
- `device_type`
- `brand`
- `model`
- `serial_number`
- `department_id`
- `assigned_user_id`
- `status`
- `purchase_date`
- `warranty_end_date`
- `operating_system`
- `notes`
- `is_active`
- `created_by`

`qr_token` opak UUID olarak tutulur ve web QR ekraninda yalnizca:

- `TBT-DEVICE:<qr_token>`

payload modeliyle kullanilir. Ham seri numarasi, IP, MAC veya kullanici bilgisi QR payload'ina eklenmez.

`device_maintenance_records` tablosunda:

- `performed_by` trigger ile mevcut auth kullanicisindan alinabilir
- `cost` negatif olamaz
- `description` en az 3 karakter olmalidir
- `ticket_id` opsiyoneldir
- `parts_used` bos ise `null`'a normalize edilir

## API Grant Tutarliligi

Supabase Data API'nin local reset sonrasinda da RLS policy'lerine ulasabilmesi icin public schema grant'leri migration ile korunur.

Migration:

- `20260706000200_restore_public_api_grants.sql`

Bu migration:

- `public` schema icin `usage`
- `public` schema altindaki tablo, sequence ve function'lar icin gerekli grant'ler
- ayni nesnelerin gelecekte olusacak surumleri icin default privilege tanimlari

ekler.

Bu sayede local `db reset` sonrasi `authenticated` ve `anon` session'lari tablo seviyesinde `permission denied` hatasina dusmeden RLS policy'leriyle degerlendirilir.

## Profile Role Guvenligi

`profiles` tablosunda rol ve kritik alan guvenligi iki katmanla korunur:

1. RLS policy'leri
2. `protect_profile_mutation()` trigger fonksiyonu

Normal uygulama davranisinda:

- Employee veya technician kendi rolunu degistiremez
- Employee veya technician baska profile satiri guncelleyemez
- Admin disi kullanici `role`, `department_id` ve `is_active` alanlarini degistiremez
- Kullanici kendi guvenli alanlarini guncelleyebilir

## Bootstrap Role Assignment Notu

Ilk demo admin veya technician role assignment islemi icin yalnizca database-owner baglaminda calisan kontrollu bootstrap istisnasi eklenmistir.

Migration:

- `20260706000100_fix_profile_bootstrap_admin_update.sql`

Eklenen mantik:

```sql
if current_user in ('postgres', 'supabase_admin') then
  return new;
end if;
```

Bu istisna:

- SQL Editor
- migration uygulamasi
- diger privileged veritabani yonetimi baglamlari

icin gecerlidir.

Bu istisna su roller icin gecerli degildir:

- `authenticated`
- `anon`

Sonuc olarak, normal authenticated kullanicilar kendi rollerini yukseltemez. Yalnizca database-owner baglaminda ilk bootstrap role assignment islemi serbesttir.

## Controlled Demo Veri Snippet'i

Demo ticket ve comment verileri migration'a gomulu degildir.

Dosya:

- `supabase/snippets/create_demo_tickets.sql`

Bu snippet:

- demo auth kullanicilarini e-posta ile cozumler
- demo cihazlari `asset_tag` ile bulur
- en az 6 kurgusal ticket olusturur
- public ve internal yorumlari ekler
- mevcut trigger ve status transition kurallariyla uyumlu sekilde history/activity log uretir
- tekrar calistirildiginda mumkun oldugunca duplicate uretmez

Web cihaz ekranlari icin ayri migration eklenmemistir; mevcut `supabase/seed.sql` altindaki 4 demo cihaz ve technician/admin tarafindan web uzerinden acilan kontrollu demo cihaz kayitlari kullanilir.

## Storage Yaklasimi

- Bucket adi: `ticket-attachments`
- Public erisim: `false`
- Boyut limiti: `10 MB`
- Ornek MIME tipleri:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `application/pdf`

Onerilen object path:

```text
<ticket_uuid>/<generated_file_name>
```

Storage policy'leri ilk path segmentinden ticket UUID cikarir ve `can_access_ticket(...)` ile kontrol yapar.

## Migration Sirasi

1. `20260703000100_create_enums.sql`
2. `20260703000200_create_core_tables.sql`
3. `20260703000300_create_functions_and_triggers.sql`
4. `20260703000400_enable_rls_and_policies.sql`
5. `20260703000500_create_storage.sql`
6. `20260706000100_fix_profile_bootstrap_admin_update.sql`
7. `20260706000200_restore_public_api_grants.sql`

## Prototip Karar Notlari

- Technician kullanicilar tum ticket kayitlarini okuyabilir
- Employee kullanicilar cihaz tarafinda yalnizca kendi uzerlerine atanmis aktif kayitlari okuyabilir
- Hard delete yerine `is_active` ve durum alanlari tercih edilir
