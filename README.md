# Tepebasi BT Destek

Tepebasi BT Destek, belediye personeli ile teknik ekipler icin teknik destek talep yonetimi ve cihaz envanteri takibini hedefleyen cok platformlu bir prototiptir.

Bu repository bir uretim sistemi degildir. Gercek kurum verisi, gercek personel adi, gercek kurum e-postasi ve gizli anahtarlar kullanilmaz.

## Teknoloji Ozeti

### Web

- Next.js 16 App Router
- TypeScript
- ESLint
- CSS Modules
- Supabase SSR auth client katmani

### Android

- Kotlin
- Jetpack Compose
- Gradle Kotlin DSL

### Supabase

- PostgreSQL migration dosyalari
- Row Level Security politika taslagi
- Private Storage bucket migrationi
- Seed ve SQL smoke test dosyalari

## Repository Yapisi

```text
.
|-- apps/
|   |-- android/
|   `-- web/
|-- docs/
|-- supabase/
|   |-- migrations/
|   |-- tests/
|   |-- config.toml
|   `-- seed.sql
|-- .editorconfig
|-- .gitignore
`-- README.md
```

## Mevcut Durum

### Tamamlananlar

- Web icin Supabase SSR browser/server/proxy katmani
- Web login ve logout server action akisi
- Profile ve rol cozumleme
- Technician ve admin icin protected route yapisi
- Employee web erisim reddi sayfasi
- Gercek `tickets` tablosundan filtrelenebilir listeleme sayfasi
- Ticket detay route'u, durum gecmisi ve yorum gorunumu
- Technician/admin icin ticket atama, durum degistirme ve public/internal yorum action'lari
- Ticket detay ekraninda mevcut duruma gore daraltilmis status gecisleri ve son durumlarda pasiflesen durum formu
- Dashboard kartlarinin gercek ticket ve cihaz sayilariyla beslenmesi
- Controlled demo ticket/comment SQL snippet'i ve local/remote demo veri dogrulamasi
- Cihaz envanteri listeleme, filtreleme ve detay ekranlari
- Technician/admin icin cihaz olusturma, duzenleme ve pasife alma akislari
- Cihaz bakim kayitlarini goruntuleme ve ekleme akisi
- Protected QR onizleme ve token yonlendirme route'lari
- Ticket ve device ekranlarinda Android handoff oncesi is akisi ve kavram netlestirmeleri
- Ticket ve cihaz ekranlari icin UI/UX polish, responsive iyilestirmeler ve tutarli loading/empty/error state'leri
- QR print ekraninin sunuma uygun sade gorunumu
- Staj raporu icin screenshot plani
- Yerel `supabase db reset`, seed ve smoke test dogrulamalari
- Remote `db push` ve demo profile rol/department kontrolu
- Gercek browser oturumu ile auth ve protected route dogrulamasi
- Gercek session ile ticket, comment, device ve maintenance RLS runtime dogrulamasi
- Web lint ve production build dogrulamasi
- Android `assembleDebug` regresyon dogrulamasi
- Migration, seed, RLS ve storage SQL dosyalari

### Henuz Tamamlanmayan veya Bloklu Alanlar

- Ticket create/update ekranlari
- Android Supabase entegrasyonu
- QR, realtime, bildirim ve dosya yukleme akislari
- Android auth, role/profile cozumleme ve ticket ekranlari
- AUTH-12 eksik env senaryosunun ayrik browser instance ile tekrar uretimi

## Gelecek Faz Fikirleri

Detayli gelecek faz notlari icin `docs/FUTURE_PHASES.md` dosyasini kullanin. Bu fikirler mevcut MVP'nin parcasi degildir; Android handoff sonrasinda ayri fazlar olarak ele alinmalidir.

### Akilli Cozum Oneri Akisi

- Personel ticket acmadan once sorunu yazar.
- Ilk surum ML olmak zorunda degildir; onayli cozum kutuphanesi, kategori eslestirme ve anahtar kelime eslestirme ile baslamalidir.
- Kullanici onerilen guvenli adimlari denerse ticket acilmadan sorun kapanabilir.
- Sorun devam ederse ticket acilir ve kayda `onerilen cozum denendi ama cozulmedi` bilgisi eklenir.
- Ileride bu yapi ML, semantic search veya embedding tabanli onerilere donusturulebilir.

### Istatistiksel Karar Destek Paneli

- Technician ve admin kullanicilar icin karar destek niteliginde analiz ekranlari hedeflenir.
- En cok ticket acilan departmanlar, sik ariza veren cihaz turleri, kategori yogunlugu ve ortalama cozum suresi gibi gostergeler sunulabilir.
- Uzun vadede cozum onerisiyle ticket acilmadan kapanan sorun sayisi da bu panelde izlenebilir.

## MVP Demo Akisi

Web MVP'nin Android handoff oncesi onerilen demo sirasi:

1. Login
2. Dashboard
3. Ticket listesi ve filtreleme
4. Ticket detay, teknik atama ve durum degistirme
5. Public yorum ve internal teknik not
6. Device listesi ve device detay
7. QR preview ve maintenance kaydi
8. Access denied ornegi
9. RLS ve test kaniti

Detayli sunum akisi icin `docs/MVP_DEMO_SCENARIO.md` dosyasini, ekran goruntusu plani icin `docs/SCREENSHOT_PLAN.md` dosyasini kullanin.

Ticket detay ekraninda yalnizca mevcut duruma uygun status secenekleri gosterilir. `closed` ve `cancelled` durumlarinda form pasif hale gelir ve kullaniciya Turkce son-durum mesaji gosterilir.

Not: `devices.assigned_user_id` cihazi kullanan veya zimmetli personeli, `tickets.assigned_to` ise talep uzerinde calisan teknik personeli ifade eder.

## Supabase Durumu

- `npx supabase --version`: `2.109.0`
- `docker version`: Docker engine erisimi var
- `npx supabase db reset`: gecti
- Linked remote migration gecmisi: `20260706000200_restore_public_api_grants.sql` kaydi mevcut
- Schema ve RLS smoke testleri: gecti

2026-07-06 tarihi itibariyla linked remote Supabase projesi uzerinde demo profile kayitlari, controlled demo ticket/comment verileri, `/tickets`, `/tickets/[id]`, `/devices`, `/devices/[id]` ve `/devices/[id]/qr` ekranlari ile web auth akislari dogrulanmistir. Local ortamda ise `20260706000200_restore_public_api_grants.sql` migration'i ile Data API grant'leri reset sonrasinda kalici hale getirilmis; gercek session ile ticket/comment/device/maintenance RLS testleri gecmistir.

## Web Ortam Degiskenleri

`apps/web/.env.local` icinde yalnizca su iki public deger bulunmalidir:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Asagidaki degerleri istemci ortamina eklemeyin:

- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DATABASE_PASSWORD`

## Yerel Gelistirme Komutlari

### Web

```bash
cd apps/web
npm install
npm run lint
npm run build
```

### Android

```bash
cd apps/android
gradlew.bat assembleDebug
```

### Supabase

Docker engine calisiyorsa:

```bash
npx supabase stop
npx supabase start
npx supabase db reset
npx supabase status
```

Smoke testler:

```bash
psql -f supabase/tests/schema_smoke_test.sql
psql -f supabase/tests/rls_smoke_test.sql
```

## Guvenlik Notlari

- Service role veya secret key istemciye eklenmez.
- `.env.local` Git'e eklenmez.
- Rol bilgisi client state, cookie metadata veya localStorage uzerinden dogrulanmaz.
- Web paneli erisimi yalnizca server-side profile ve rol cozumlemesi ile acilir.
- Ilk demo admin veya technician role assignment islemi icin yalnizca database-owner baglaminda calisan kontrollu bootstrap istisnasi vardir.
- Normal `authenticated` kullanicilar kendi rollerini yukseltemez.
- Public API grant'leri migration ile korunur; local reset sonrasinda tablo erisimleri RLS policy'lerine kadar ulasabilir.

## Dokumantasyon

- [Architecture](docs/ARCHITECTURE.md)
- [Authentication](docs/AUTHENTICATION.md)
- [Database](docs/DATABASE.md)
- [RLS Matrix](docs/RLS_MATRIX.md)
- [Demo Data Setup](docs/DEMO_DATA_SETUP.md)
- [Supabase Remote Setup](docs/SUPABASE_REMOTE_SETUP.md)
- [Daily Progress](docs/DAILY_PROGRESS.md)
- [Future Phases](docs/FUTURE_PHASES.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Screenshot Plan](docs/SCREENSHOT_PLAN.md)
