# RLS_MATRIX

## Genel Notlar

- Tum ana uygulama tablolarinda RLS etkindir.
- Admin rolu icin bile RLS kapatilmamistir; admin yetkisi policy uzerinden verilir.
- Technician kullanicilar prototip kullanimini kolaylastirmak amaciyla ticket kayitlarini genis okuyabilir.
- Employee kullanicilar yalnizca kendi profile satirlari, kendi ticket kayitlari ve kendi erisebildigi iliskili kayitlarla sinirlidir.

## Yetki Matrisi

| Tablo | Employee SELECT | Employee INSERT | Employee UPDATE | Employee DELETE | Technician Yetkileri | Admin Yetkileri | Policy Isimleri | Guvenlik Gerekcesi |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `departments` | Yalnizca aktif kayitlari okur | Yok | Yok | Yok | Tum departmanlari okur | Tum CRUD | `employees_can_read_active_departments`, `technicians_can_read_departments`, `admins_can_manage_departments` | Pasif referans veriler employee tarafinda gizli tutulur |
| `profiles` | Kendi profile satirini okur | Yok | Kendi satirinda sinirli alan guncellemesi | Yok | Tum profilleri okuyabilir | Tum CRUD | `users_can_read_own_profile`, `technicians_can_read_profiles`, `users_can_update_own_profile`, `admins_can_manage_profiles` | Role elevation trigger ile ayrica korunur |
| `devices` | Yalnizca kendi uzerine atanmis aktif cihazlari okur | Yok | Yok | Yok | Tum cihazlari okuyabilir, olusturabilir, guncelleyebilir | Ayni | `users_can_read_accessible_devices`, `technicians_can_insert_devices`, `technicians_can_update_devices` | Employee taraf en dar erisimle sinirlandi |
| `tickets` | Kendi olusturdugu ticket kayitlarini okur | Kendi ticket kaydini olusturur | Dogrudan guncelleyemez | Yok | Tum ticket kayitlarini okuyabilir, olusturabilir, guncelleyebilir | Ayni | `users_can_read_accessible_tickets`, `employees_can_create_own_tickets`, `technicians_and_admins_can_create_tickets`, `technicians_can_update_tickets` | Employee insert guvenligi trigger + `with check` ile korunur |
| `ticket_comments` | Erisebildigi ticket icin yalnizca normal yorumlari okur | Internal olmayan yorum ekler | Yok | Yok | Normal ve internal yorumlari okur, yorum ekler | Internal yorumlari ve delete islemini yonetebilir | `users_can_read_accessible_ticket_comments`, `employees_can_create_public_comments`, `technicians_can_create_comments`, `admins_can_delete_comments` | Internal notlar employee tarafinda gizlidir |
| `ticket_attachments` | Erisebildigi ticket metadata kayitlarini okur | Erisebildigi ticket icin kayit olusturur | Yok | Yok | Metadata kayitlarini okuyabilir, guncelleyebilir, silebilir | Ayni | `users_can_read_accessible_ticket_attachments`, `users_can_create_accessible_ticket_attachments`, `technicians_can_update_ticket_attachments`, `technicians_can_delete_ticket_attachments` | Public URL yerine private metadata yaklasimi vardir |
| `ticket_status_history` | Erisebildigi ticket history kayitlarini okur | Yok | Yok | Yok | Erisebildigi history kayitlarini okur | Ayni | `users_can_read_accessible_ticket_status_history` | History trigger ile yazilir |
| `device_maintenance_records` | Erisebildigi cihazlarin bakim gecmisini okur | Yok | Yok | Yok | Kayit okuyabilir, olusturabilir, guncelleyebilir | Ayni | `users_can_read_accessible_device_maintenance`, `technicians_can_create_device_maintenance`, `technicians_can_update_device_maintenance` | Employee yazma yetkisi kapali tutulur |
| `activity_logs` | Yok | Yok | Yok | Yok | Yok | Tum kayitlari okur | `admins_can_read_activity_logs` | Log tablosu yalnizca admin gorunurlugune aciktir |

## Storage Objects Politikalari

`storage.objects` icin private bucket uzerinde su policy'ler tanimlidir:

- `users_can_read_ticket_attachment_objects`
- `users_can_upload_ticket_attachment_objects`
- `technicians_can_update_ticket_attachment_objects`
- `technicians_can_delete_ticket_attachment_objects`

Bu policy'ler object path icinden ticket UUID cikarir ve `can_access_ticket(...)` ile erisim kontrolu yapar.

## Bootstrap Istisnasi Notu

Ilk demo admin veya technician role assignment islemi icin `protect_profile_mutation()` fonksiyonunda yalnizca database-owner baglamina acik kontrollu bootstrap istisnasi vardir.

Bu istisna:

- `postgres`
- `supabase_admin`

rolleri icin gecerlidir.

Bu istisna:

- `authenticated`
- `anon`

rollerine acik degildir.

Dolayisiyla normal uygulama kullanicilari kendi rollerini yukseltemez.

## Runtime Dogrulama Notlari

2026-07-06 tarihli gercek session testlerinde:

- Employee session ile yalnizca kendisine atanmis aktif cihaz kaydi goruldu.
- Technician session ile tum demo cihazlar ve technician tarafindan acilan yeni demo cihaz kayitlari goruldu.
- Employee session ile `devices` insert islemi RLS tarafindan engellendi.
- Technician session ile `devices` insert ve update islemleri basariyla calisti.
- Technician session ile `device_maintenance_records` insert islemi basariyla calisti.
- Employee session ile `device_maintenance_records` insert islemi RLS tarafindan engellendi.
- Pasife alinan cihaz kaydi employee session gorunumunden dustu.
