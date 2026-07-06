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
- Gercek `tickets` tablosundan ilk listeleme sayfasi
- Web lint ve production build dogrulamasi
- Android `assembleDebug` regresyon dogrulamasi
- Migration, seed, RLS ve storage SQL dosyalari

### Henuz Tamamlanmayan veya Bloklu Alanlar

- Yerel Supabase `db reset` dogrulamasi
- Yerel schema smoke test ve RLS smoke test calistirma
- Uzak gelistirme Supabase projesine migration uygulama
- Demo auth kullanicilarini olusturma
- Ticket create/update/assignment/comment akislari
- Android Supabase entegrasyonu
- QR, realtime, bildirim ve dosya yukleme akislari

## Supabase Durumu

- `npx supabase --version`: `2.109.0`
- `docker version`: Docker client gorunuyor, ancak daemon/engine erisimi yok
- `npx supabase status`: Docker engine kapali oldugu icin basarisiz

Bu nedenle 2026-07-06 tarihi itibariyla yerel migration reset kapisi gecilemedi ve uzak Supabase projesine migration uygulama asamasina gecilmedi.

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

Docker engine kapaliyken veya migration reset basarisizken uzak projeye `link` ya da `db push` uygulanmamalidir.

## Guvenlik Notlari

- Service role veya secret key istemciye eklenmez.
- `.env.local` Git'e eklenmez.
- Rol bilgisi client state, cookie metadata veya localStorage uzerinden dogrulanmaz.
- Web paneli erisimi yalnizca server-side profile ve rol cozumlemesi ile acilir.
- Runtime RLS dogrulamasi tamamlanmadan Supabase katmani guvenli kabul edilmez.

## Dokumantasyon

- [Architecture](docs/ARCHITECTURE.md)
- [Authentication](docs/AUTHENTICATION.md)
- [Database](docs/DATABASE.md)
- [RLS Matrix](docs/RLS_MATRIX.md)
- [Demo Data Setup](docs/DEMO_DATA_SETUP.md)
- [Supabase Remote Setup](docs/SUPABASE_REMOTE_SETUP.md)
- [Daily Progress](docs/DAILY_PROGRESS.md)
- [Test Plan](docs/TEST_PLAN.md)
