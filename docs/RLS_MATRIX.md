# RLS_MATRIX

## Genel Notlar

- Tüm ana uygulama tablolarında RLS etkindir.
- Admin rolü için bile RLS kapatılmamıştır; admin yetkisi policy üzerinden verilir.
- Technician kullanıcılar prototip kullanımını kolaylaştırmak amacıyla ticket kayıtlarını geniş okuyabilir.
- Employee kullanıcılar yalnızca kendi profile satırları, kendi ticket kayıtları ve kendi erişebildiği ilişkili kayıtlarla sınırlıdır.

## Yetki Matrisi

| Tablo | Employee SELECT | Employee INSERT | Employee UPDATE | Employee DELETE | Technician Yetkileri | Admin Yetkileri | Policy İsimleri | Güvenlik Gerekçesi |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `departments` | Yalnızca aktif kayıtları okur | Yok | Yok | Yok | Tüm departmanları okur | Tüm CRUD | `employees_can_read_active_departments`, `technicians_can_read_departments`, `admins_can_manage_departments` | Referans verinin pasif kayıtları employee tarafında gizli tutulur |
| `profiles` | Kendi profile satırını okur | Yok | Kendi satırında sınırlı alan güncellemesi | Yok | Tüm profilleri okuyabilir | Tüm CRUD | `users_can_read_own_profile`, `technicians_can_read_profiles`, `users_can_update_own_profile`, `admins_can_manage_profiles` | Role elevation trigger ile ayrıca korunur |
| `devices` | Yalnızca kendi üzerine atanmış aktif cihazları okur | Yok | Yok | Yok | Tüm cihazları okuyabilir, oluşturabilir, güncelleyebilir | Aynı yetkiler; delete yerine yönetim güncellemesi hedeflenir | `users_can_read_accessible_devices`, `technicians_can_insert_devices`, `technicians_can_update_devices` | Employee tarafı en dar erişimle sınırlandı |
| `tickets` | Kendi oluşturduğu ticket kayıtlarını okur | Kendi ticket kaydını oluşturur | Doğrudan güncelleyemez | Yok | Tüm ticket kayıtlarını okuyabilir, oluşturabilir, güncelleyebilir | Aynı | `users_can_read_accessible_tickets`, `employees_can_create_own_tickets`, `technicians_and_admins_can_create_tickets`, `technicians_can_update_tickets` | Employee insert güvenliği trigger + `with check` ile korunur |
| `ticket_comments` | Erişebildiği ticket için yalnızca normal yorumları okur | Internal olmayan yorum ekler | Yok | Yok | Normal ve internal yorumları okur, yorum ekler | Internal yorumları ve delete işlemini yönetebilir | `users_can_read_accessible_ticket_comments`, `employees_can_create_public_comments`, `technicians_can_create_comments`, `admins_can_delete_comments` | Internal notların employee tarafından görülmesi engellenir |
| `ticket_attachments` | Erişebildiği ticket attachment metadata kayıtlarını okur | Erişebildiği ticket için kayıt oluşturur | Yok | Yok | Metadata kayıtlarını okuyabilir, güncelleyebilir, silebilir | Aynı | `users_can_read_accessible_ticket_attachments`, `users_can_create_accessible_ticket_attachments`, `technicians_can_update_ticket_attachments`, `technicians_can_delete_ticket_attachments` | Public URL yerine private metadata yaklaşımı uygulanır |
| `ticket_status_history` | Erişebildiği ticket history kayıtlarını okur | Yok | Yok | Yok | Erişebildiği history kayıtlarını okur | Aynı | `users_can_read_accessible_ticket_status_history` | History istemci tarafından değiştirilemez, trigger ile yazılır |
| `device_maintenance_records` | Yalnızca erişebildiği cihazların bakım geçmişini okur | Yok | Yok | Yok | Kayıt okuyabilir, oluşturabilir, güncelleyebilir | Aynı | `users_can_read_accessible_device_maintenance`, `technicians_can_create_device_maintenance`, `technicians_can_update_device_maintenance` | Employee yazma yetkisi kapalı tutulur |
| `activity_logs` | Yok | Yok | Yok | Yok | Yok | Tüm kayıtları okur | `admins_can_read_activity_logs` | Log tablosu dar tutuldu, yalnızca admin görünürlüğü verildi |

## Storage Objects Politikaları

`storage.objects` için private bucket üstünde aşağıdaki politikalar tanımlanır:

- `users_can_read_ticket_attachment_objects`
- `users_can_upload_ticket_attachment_objects`
- `technicians_can_update_ticket_attachment_objects`
- `technicians_can_delete_ticket_attachment_objects`

Bu politikalar object path içinden güvenli biçimde ticket UUID çıkarır ve `can_access_ticket(...)` ile erişim kontrolü yapar.

## Ek Güvenlik Notları

- Employee kullanıcılar `status`, `assigned_to` veya role gibi kritik alanları istemci üzerinden zorlayarak değiştiremez.
- Ticket history ve activity log kayıtları doğrudan istemci insert politikasına açılmamıştır.
- Storage tarafında employee delete yetkisi bu aşamada verilmemiştir; sahte güvenlik hissi oluşturmamak için yalnızca güvenli okunma ve yükleme akışları bırakılmıştır.
