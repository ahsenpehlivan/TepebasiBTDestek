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
- Dashboard kartlarinin gercek ticket ve cihaz sayilariyla beslenmesi
- Controlled demo ticket/comment SQL snippet'i ve local/remote demo veri dogrulamasi
- Yerel `supabase db reset`, seed ve smoke test dogrulamalari
- Remote `db push` ve demo profile rol/department kontrolu
- Gercek browser oturumu ile auth ve protected route dogrulamasi
- Gercek session ile ticket, comment ve profile RLS runtime dogrulamasi
- Web lint ve production build dogrulamasi
- Android `assembleDebug` regresyon dogrulamasi
- Migration, seed, RLS ve storage SQL dosyalari

### Henuz Tamamlanmayan veya Bloklu Alanlar

- Ticket create/update ekranlari
- Cihaz envanteri web ekranlari
- Android Supabase entegrasyonu
- QR, realtime, bildirim ve dosya yukleme akislari
- Bakim kayitlari ve cihaz detay akislarinin web'e tasinmasi
- AUTH-12 eksik env senaryosunun ayrik browser instance ile tekrar uretimi

## Supabase Durumu

- `npx supabase --version`: `2.109.0`
- `docker version`: Docker engine erisimi var
- `npx supabase db reset`: gecti
- `npx supabase db push`: onceki bootstrap migration icin gecti; son grant migration'i bu turde CLI DB parola degiskeni olmadan tekrar push edilemedi
- Schema ve RLS smoke testleri: gecti

2026-07-06 tarihi itibariyla linked remote Supabase projesi uzerinde demo profile kayitlari, controlled demo ticket/comment verileri, `/tickets` ve `/tickets/[id]` ekranlari ile web auth akislari dogrulanmistir. Local ortamda ise `20260706000200_restore_public_api_grants.sql` migration'i ile Data API grant'leri reset sonrasinda kalici hale getirilmis ve gercek session ile ticket/comment RLS testleri gecmistir.

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
- [Test Plan](docs/TEST_PLAN.md)
