# ANDROID_TICKETS

## Ozet

Bu dokuman artik Android tarafindaki personel ticket listeleme, ticket detay ve ticket olusturma temelini birlikte ozetler.
Bu fazda employee akisi icine `Yeni Talep Olustur` ekrani eklendi.

Kapsam:

- employee home ekranindan `Taleplerimi Gor` gecisi
- Supabase PostgREST tabanli ticket listeleme repository'si
- RLS'ye guvenen sade ticket sorgusu
- loading, liste, empty ve error ekran durumlari
- Turkce UI etiketleri ve badge karsiliklari
- `TicketDetail` modeli ve `loadTicketDetail(ticketId)` repository fonksiyonu
- ticket ozet, aciklama, cihaz, tarihler, teknik personel ve yorumlar bolumleri
- `MyTicketsScreen` kartindan `TicketDetail/{ticketId}` route gecisi
- `CreateTicketInput` modeli ve `createTicket(input)` repository fonksiyonu
- `CreateTicket` route'u ve employee akisi icindeki yeni talep formu
- employee home ve `MyTicketsScreen` uzerinden create ekrani gecisi

Bu fazda sunlar eklenmedi:

- ticket detay aksiyonlari
- ticket durum degistirme
- ticket yorum ekleme
- ticket atama degistirme
- technician queue
- admin ticket ekranlari
- pagination, filtreleme, pull-to-refresh
- cihaz secimi

Runtime notu:

- employee runtime oturumu acilamadigi icin `MyTicketsScreen` gercek cihaz/emulator uzerinde kanitlanamadi
- auth tablolari icin dogrudan SQL insert/clone yapilmadi
- Supabase Dashboard/Auth UI oturumu bu ortamda hazir degildi
- publishable key ile normal signup denemesi bu ortamda remote host erisimi nedeniyle tamamlanamadi

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

Not:

- mevcut veritabani enum'unda `access_request` de bulundugu icin Android tarafinda bu deger de desteklenir

### Repository

Repository arayuzu:

```kotlin
suspend fun loadMyTickets(): Result<List<TicketSummary>>
suspend fun loadTicketDetail(ticketId: String): Result<TicketDetail>
suspend fun createTicket(input: CreateTicketInput): Result<String>
```

Davranis:

- publishable key ile normal istemci baglantisi kullanilir
- service role kullanilmaz
- sorgu `tickets` tablosundan minimum alanlari ceker
- siralama `created_at desc`
- filtreleme employee id'si ile istemci tarafinda zorlanmaz
- gorulebilen satirlar yalnizca Supabase RLS sonucuna birakilir
- create akisi icin `department_id` mevcut session profile baglamindan cozulur
- employee insert'inde `created_by` ve `status` alanlari trigger/RLS tarafina birakilir

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

Bu iki alan RLS nedeniyle her zaman gelmeyebilir; bu nedenle UI'da opsiyonel tutulur.

### ViewModel ve UI Akisi

`MyTicketsViewModel`:

1. mevcut session state'i okur
2. rol employee degilse kontrollu hata durumu uretir
3. employee ise repository uzerinden ticket listesini yukler
4. sonucu `MyTicketsUiState` icine yazar

`MyTicketsScreen` durumlari:

- loading
- liste
- empty
- error

`TicketDetailViewModel`:

1. route icinden gelen `ticketId` degerini okur
2. mevcut session state'i kontrol eder
3. employee degilse kontrollu hata durumu uretir
4. `loadTicketDetail(ticketId)` ile detay verisini yukler
5. sonucu `TicketDetailUiState` icine yazar

`TicketDetailScreen` bolumleri:

- Ozet
- Aciklama
- Cihaz Bilgisi
- Tarihler
- Teknik Personel
- Yorumlar

`CreateTicketViewModel`:

1. mevcut session state'i kontrol eder
2. employee degilse kontrollu hata durumu uretir
3. baslik, aciklama, kategori ve oncelik alanlarini dogrular
4. `createTicket(input)` ile insert istegi gonderir
5. basarili olursa `Talebiniz olusturuldu.` mesaji ve varsa yeni ticket id'si ile navigation sinyali uretir

`CreateTicketScreen`:

- Talep basligi
- Aciklama
- Kategori secimi
- Oncelik secimi
- Cihaz seciminin sonraki fazda gelecegini belirten not
- Kaydet / Vazgec aksiyonlari

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

## RLS Yaklasimi

Bu ekran employee tarafinda istemci bazli sahte yetki kontrolu yapmaz.

Yaklasim:

- Android istemcisi `tickets` tablosuna normal select istegi atar
- hangi kayitlarin donecegine Supabase RLS karar verir
- uygulama tarafinda yalnizca employee route'undan bu ekranin acilmasi hedeflenir

Bu nedenle:

- auth kullanicisinin goremedigi ticket'lar Android'e donmez
- ekstra service role veya gizli bypass kullanilmaz

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
- ANDROID-TICKET-DETAIL-02 detail ekraninda ozet ve aciklama bolumu
- ANDROID-TICKET-DETAIL-03 cihaz ve teknik personel fallback metinleri
- ANDROID-TICKET-DETAIL-04 yorumlar bolumu
- ANDROID-TICKET-DETAIL-05 invalid ticketId icin kontrollu hata
- ANDROID-TICKET-CREATE-01 employee home create gecisi
- ANDROID-TICKET-CREATE-02 `MyTickets` ust aksiyonundan create gecisi
- ANDROID-TICKET-CREATE-03 baslik, aciklama, kategori ve oncelik validasyonu
- ANDROID-TICKET-CREATE-04 repository insert alani schema uyumu
- ANDROID-TICKET-CREATE-05 basarili create sonrasi navigation davranisi
- ANDROID-TICKET-CREATE-06 Turkce karakter kontrolu

## Bilinen Eksikler

- Bu fazda kullanilabilir employee demo parolasi veya aktif Dashboard oturumu bulunmadigi icin liste ekrani gercek runtime'da kanitlanamadi
- Publishable key ile yeni test employee olusturma denemesi bu ortamda remote host erisimi nedeniyle tamamlanamadi
- TicketDetail route'u kaynak kod ve navigation duzeyinde baglandi; ancak employee runtime oturumu olmadan detail ekraninin gercek ticket verisiyle manuel goruntusu kanitlanamadi
- CreateTicket route'u ve repository akisi kaynak kod duzeyinde baglandi; ancak employee runtime oturumu olmadan formun gercek insert sonucu manuel kanitlanamadi
- filtreleme, sayfalama ve yenileme aksiyonu eklenmedi
- ticket yorum ekleme, durum degistirme ve atama degistirme bu fazda eklenmedi
- cihaz secimi bu fazda bilerek eklenmedi; formda sonraki faz notu olarak birakildi

## Sonraki Asama

- Android technician ticket queue iskeleti
