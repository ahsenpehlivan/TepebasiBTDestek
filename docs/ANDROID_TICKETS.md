# ANDROID_TICKETS

## Ozet

Bu dokuman artik Android tarafindaki personel ticket listeleme, ticket detay, ticket olusturma, technician queue ve technician status update temelini birlikte ozetler.
Bu fazda `TicketDetail` icine technician/admin icin temel status update aksiyon paneli eklendi.

Kapsam:

- employee home ekranindan `Taleplerimi Gor` gecisi
- employee akisi icin `CreateTicket` ve `TicketDetail` route'lari
- technician home ekranindan `Is Kuyrugunu Ac` gecisi
- Supabase PostgREST tabanli ticket repository
- RLS'ye guvenen sade ticket sorgulari
- loading, liste, empty ve error ekran durumlari
- Turkce UI etiketleri ve badge karsiliklari
- `TicketDetail` modeli ve `loadTicketDetail(ticketId)` repository fonksiyonu
- `CreateTicketInput` modeli ve `createTicket(input)` repository fonksiyonu
- `loadTechnicianQueue()` repository fonksiyonu
- `updateTicketStatus(ticketId, status)` repository fonksiyonu
- `MyTicketsScreen` kartindan veya `TechnicianQueueScreen` kartindan `TicketDetail/{ticketId}` route gecisi
- `TicketDetail` icinde technician/admin icin status update aksiyonlari

Bu fazda sunlar eklenmedi:

- ticket atama degistirme
- ticket yorum ekleme
- technician queue icinde filtreleme/siralama secenekleri
- admin ticket ekranlari
- pagination, pull-to-refresh
- cihaz secimi

Runtime notu:

- employee ve technician ticket ekranlarinin manuel runtime dogrulamasi bu fazda zorunlu tutulmadi
- minimum MVP dogrulamasi olarak build, emulator install, app acilisi ve login ekran gorunurlugu kanitlandi
- `TechnicianHome -> TechnicianQueue -> TicketDetail` baglantisi kaynak kod ve navigation seviyesinde dogrulandi
- status update aksiyonlari kaynak kod, repository ve ViewModel seviyesinde baglandi; ancak technician login ile gercek runtime durum guncelleme kaniti bu fazda alinmadi

## Konumlar

- Navigation:
  - `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/navigation/AppNavHost.kt`
  - `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/navigation/AppRoute.kt`
- Domain:
  - `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/domain/ticket/*`
- Data:
  - `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/data/ticket/*`
- UI:
  - `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/feature/tickets/*`

## Mimari

### Domain

Listeleme modelleri:

- `TicketSummary`
- `TicketStatus`
- `TicketPriority`
- `TicketCategory`

Detay modelleri:

- `TicketDetail`
- `TicketComment`

Create modeli:

- `CreateTicketInput`

Veritabani enum/string degerleri Ingilizce tutulur.
Android UI katmani bu degerleri Turkce label'lara map eder.

### Repository

Repository arayuzu:

```kotlin
suspend fun loadMyTickets(): Result<List<TicketSummary>>
suspend fun loadTechnicianQueue(): Result<List<TicketSummary>>
suspend fun loadTicketDetail(ticketId: String): Result<TicketDetail>
suspend fun updateTicketStatus(ticketId: String, status: TicketStatus): Result<Unit>
suspend fun createTicket(input: CreateTicketInput): Result<String>
```

Davranis:

- publishable key ile normal istemci baglantisi kullanilir
- service role kullanilmaz
- sorgular `tickets` tablosundan minimum alanlari ceker
- siralama `created_at desc`
- gorulebilen satirlar Supabase RLS sonucuna birakilir
- employee create akisi icin `department_id` mevcut session profile baglamindan cozulur
- employee insert'inde `created_by` ve `status` alanlari trigger/RLS tarafina birakilir
- technician queue varsayilan olarak `open`, `assigned`, `in_progress` ve `waiting_user` durumlarini newest-first getirir
- status update akisi Android'den yalnizca `status` alanini gonderir
- `assigned_to`, `assigned_at`, `resolved_at`, `closed_at` ve `updated_at` alanlari trigger/default mantigina birakilir

Secilen alanlar:

- `id`
- `ticket_number`
- `title`
- `description`
- `status`
- `priority`
- `category`
- `created_at`
- `updated_at`
- `device_id`
- `assigned_to`

Opsiyonel zenginlestirme:

- `devices` tablosundan cihaz etiketi
- `profiles` tablosundan atanan teknik personel adi
- `ticket_comments` tablosundan gorulebilen yorumlar

Bu alanlar RLS nedeniyle her zaman gelmeyebilir; UI'da opsiyonel tutulur.

### ViewModel ve UI Akisi

`MyTicketsViewModel`:

1. mevcut session state'i okur
2. rol employee degilse kontrollu hata durumu uretir
3. employee ise repository uzerinden ticket listesini yukler
4. sonucu `MyTicketsUiState` icine yazar

`TechnicianQueueViewModel`:

1. mevcut session state'i okur
2. rol technician degilse kontrollu hata durumu uretir
3. technician ise repository uzerinden queue listesini yukler
4. sonucu `TechnicianQueueUiState` icine yazar

`MyTicketsScreen` durumlari:

- loading
- liste
- empty
- error

`TechnicianQueueScreen` durumlari:

- loading
- liste
- empty
- error

`TicketDetailViewModel`:

1. route icinden gelen `ticketId` degerini okur
2. mevcut session state'i kontrol eder
3. session yoksa kontrollu hata durumu uretir
4. `loadTicketDetail(ticketId)` ile detay verisini yukler
5. technical role ise gecerli status aksiyonlarini hesaplar
6. sonucu `TicketDetailUiState` icine yazar

Status update akisi:

1. technician veya admin `TicketDetailScreen` icindeki `Talep Islemleri` bolumunu gorur
2. guvenli aksiyonlar yalnizca mevcut status'e gore acilir
3. `updateTicketStatus(ticketId, status)` ViewModel uzerinden cagrilir
4. basarili olursa detail verisi yeniden yuklenir ve basari mesaji gosterilir
5. hata olursa kontrollu Turkce hata mesaji gosterilir

`CreateTicketViewModel`:

1. mevcut session state'i kontrol eder
2. employee degilse kontrollu hata durumu uretir
3. baslik, aciklama, kategori ve oncelik alanlarini dogrular
4. `createTicket(input)` ile insert istegi gonderir
5. basarili olursa `Talebiniz olusturuldu.` mesaji ve varsa yeni ticket id'si ile navigation sinyali uretir

Employee home akisi:

1. employee login
2. `EmployeeHomeScreen`
3. `Taleplerimi Gor`
4. `MyTicketsScreen`
5. kart secimi
6. `TicketDetailScreen`

Create akisi:

1. employee login
2. `EmployeeHomeScreen` veya `MyTicketsScreen`
3. `Yeni Talep Olustur`
4. `CreateTicketScreen`
5. basarili ise `TicketDetailScreen` veya `MyTicketsScreen`

Technician queue akisi:

1. technician login
2. `TechnicianHomeScreen`
3. `Is Kuyrugunu Ac`
4. `TechnicianQueueScreen`
5. kart secimi
6. `TicketDetailScreen`

Status update akisi:

1. technician veya admin `TicketDetailScreen`
2. `Isleme Al`, `Kullanici Bekleniyor` veya `Cozuldu`
3. basarili olursa detail refresh

## RLS Yaklasimi

Bu ekranlar istemci bazli sahte yetki kontrolu yapmaz.

Yaklasim:

- Android istemcisi `tickets` tablosuna normal select istegi atar
- hangi kayitlarin donecegine Supabase RLS karar verir
- UI tarafinda employee ve technician route'lari ilgili role uygun ViewModel ile acilir

Bu nedenle:

- auth kullanicisinin goremedigi ticket'lar Android'e donmez
- ekstra service role veya gizli bypass kullanilmaz
- status update RLS ve trigger kurallarini dolasmadan normal update istegi ile calisir

## Test Senaryolari

- ANDROID-TICKET-LIST-01 employee login
- ANDROID-TICKET-LIST-02 `Taleplerimi Gor` butonu
- ANDROID-TICKET-LIST-03 employee ticket listesi
- ANDROID-TICKET-LIST-04 ticket kart icerigi
- ANDROID-TICKET-LIST-05 empty state
- ANDROID-TICKET-LIST-06 network/error state
- ANDROID-TICKET-LIST-07 logout sonrasi listeye geri donus
- ANDROID-TICKET-LIST-08 Turkce karakter kontrolu
- ANDROID-TICKET-DETAIL-01 ticket kartindan detail route gecisi
- ANDROID-TICKET-CREATE-01 employee home create gecisi
- ANDROID-TICKET-CREATE-02 `MyTickets` ust aksiyonundan create gecisi
- ANDROID-TECH-QUEUE-01 technician home queue gecisi
- ANDROID-TECH-QUEUE-02 `loadTechnicianQueue()` repository fonksiyonu
- ANDROID-TECH-QUEUE-03 queue ekrani durumlari
- ANDROID-TECH-QUEUE-04 karttan detail route gecisi
- ANDROID-TECH-QUEUE-05 minimum emulator acilisi
- ANDROID-TICKET-STATUS-01 web/schema status mantigi ile uyum
- ANDROID-TICKET-STATUS-02 `updateTicketStatus()` repository fonksiyonu
- ANDROID-TICKET-STATUS-03 `TicketDetail` technician aksiyon paneli
- ANDROID-TICKET-STATUS-04 status update state ve detail refresh
- ANDROID-TICKET-STATUS-05 minimum emulator acilisi

## Bilinen Eksikler

- Technician queue bu fazda read-only iskelet olarak eklendi
- Queue icin kullaniciya acik filtre veya atama aksiyonu yok
- Status update bu fazda yalnizca `TicketDetail` icinde bulunur; `TechnicianQueue` kartlari uzerinde dogrudan aksiyon yoktur
- Queue ekraninin gercek technician oturumuyla manuel liste kaniti bu fazda alinmadi
- TicketDetail icindeki status update aksiyonlarinin gercek technician session ile runtime kaniti bu fazda alinmadi

## Sonraki Asama

- Android ticket yorum goruntuleme/yazma iskeleti
