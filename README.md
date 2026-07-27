# Tepebaşı BT Destek

Tepebaşı BT Destek, belediye personelinin teknik destek taleplerini yönetmek ve cihaz envanterini takip etmek için hazırlanan çok platformlu bir MVP prototipidir. Proje; Next.js tabanlı bir web yönetim paneli, Kotlin/Compose tabanlı bir Android uygulaması ve Supabase tabanlı veri, kimlik doğrulama ve RLS güvenlik katmanından oluşur.

Bu depo bir üretim sistemi değildir. Gerçek kurum verisi, gerçek kullanıcı parolası, gerçek kurum e-postası veya gizli anahtarlar kullanılmaz.

## Teknoloji Özeti

### Web

- Next.js 16 App Router
- TypeScript
- ESLint
- CSS Modules
- Supabase SSR auth istemcisi

### Android

- Kotlin
- Jetpack Compose
- Navigation Compose
- Gradle Kotlin DSL
- Supabase Kotlin istemcisi
- Kotlin serialization

### Supabase

- PostgreSQL migration dosyaları
- Row Level Security policy yapısı
- Private Storage bucket
- Seed verileri
- SQL smoke test dosyaları

## Repository Yapısı

```text
.
|-- apps/
|   |-- android/
|   `-- web/
|-- docs/
|-- supabase/
|   |-- migrations/
|   |-- snippets/
|   |-- tests/
|   |-- config.toml
|   `-- seed.sql
|-- .editorconfig
|-- .gitignore
`-- README.md
```

## Web MVP'de Tamamlananlar

- Supabase SSR auth, login ve logout akışı
- Server-side role guard ve protected route yapısı
- Dashboard ve gerçek sayaç kartları
- Ticket listeleme, filtreleme ve detay ekranları
- Ticket atama, durum güncelleme ve public/internal yorum işlemleri
- Device listeleme, detay, create, edit ve passive akışları
- Maintenance records görüntüleme ve ekleme
- Güvenli QR preview ve token route yönlendirmesi
- Türkçe, sade ve kurumsal frontend tasarımı
- Responsive web doğrulamaları ve demo akışı

## Android MVP'de Tamamlananlar

### Runtime'da doğrulanan temel alanlar

- Supabase auth foundation
- Role-based home ekranları
- Login, logout ve erişim engeli akışları
- Geçersiz giriş ve eksik config hata ekranları
- Minimum emulator açılış doğrulamaları

### Foundation seviyesinde tamamlanan alanlar

- Employee ticket list, detail ve create foundation
- Technician queue foundation
- Technician status update foundation
- Ticket comment foundation
- Device list foundation
- Device detail foundation
- Device maintenance history foundation
- Device QR preview foundation

Bu Android ekranlarının önemli bir kısmı build, navigation ve kaynak kod seviyesinde tamamlanmıştır; ancak hepsi gerçek employee veya technician oturumuyla uçtan uca runtime doğrulanamamıştır.

## Android Tarafında Runtime'da Hâlâ Test Edilemeyen Noktalar

- Employee `MyTicketsScreen` canlı listeleme
- Employee ticket detail canlı ilerleyişi
- Employee ticket create canlı insert kanıtı
- Technician queue canlı listeleme
- Technician status update canlı kanıtı
- Ticket comment submit canlı kanıtı
- Device list ve device detail canlı kanıtı
- Device maintenance history canlı kanıtı
- Device QR preview canlı kanıtı
- Session restore testi

Bu alanlar kapsam dışı bırakılmadı; yalnızca bu fazda güvenli demo hesap/parola erişimi ve kontrollü runtime ilerleyişi sağlanamadığı için `test edilemedi` olarak korundu.

## Supabase ve Güvenlik Yaklaşımı

- Service role veya secret key istemciye verilmez.
- Web tarafında rol kararı her zaman `public.profiles.role` üzerinden server-side çözülür.
- Android tarafında yalnızca `SUPABASE_URL` ve `SUPABASE_PUBLISHABLE_KEY` kullanılır.
- `devices.assigned_user_id` cihazı kullanan personeli, `tickets.assigned_to` ise ticket üzerinde çalışan teknik personeli ifade eder.
- RLS tüm ana tablolarda etkindir.
- İlk demo admin veya technician rol ataması için yalnızca database-owner bağlamında çalışan kontrollü bootstrap istisnası vardır.
- Normal `authenticated` kullanıcılar kendi rollerini yükseltemez.

## Doğrulama Özeti

- `npx supabase db reset` geçti
- Seed doğrulaması geçti
- Schema smoke test geçti
- RLS smoke test geçti
- Web `npm run lint` geçti
- Web `npm run build` geçti
- Android `gradlew.bat assembleDebug` geçti
- Remote web auth ve RLS runtime doğrulamaları tamamlandı
- Android tarafında minimum emulator açılış kontrolleri tekrar tekrar doğrulandı

Detaylar için:

- [Architecture](docs/ARCHITECTURE.md)
- [Authentication](docs/AUTHENTICATION.md)
- [Android Auth](docs/ANDROID_AUTH.md)
- [Android Tickets](docs/ANDROID_TICKETS.md)
- [Android Devices](docs/ANDROID_DEVICES.md)
- [Database](docs/DATABASE.md)
- [RLS Matrix](docs/RLS_MATRIX.md)
- [Test Plan](docs/TEST_PLAN.md)
- [Daily Progress](docs/DAILY_PROGRESS.md)
- [MVP Demo Scenario](docs/MVP_DEMO_SCENARIO.md)
- [Screenshot Plan](docs/SCREENSHOT_PLAN.md)
- [Future Phases](docs/FUTURE_PHASES.md)

## Yerel Geliştirme

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

```bash
npx supabase stop
npx supabase start
npx supabase db reset
npx supabase status
```

## Ortam Dosyaları

- `apps/web/.env.local` Git'e eklenmez.
- `apps/android/secrets.properties` Git'e eklenmez.
- `apps/android/local.properties` Git'e eklenmez.
- Service role key, database password ve demo kullanıcı parolaları dokümana yazılmaz.

## Teslim Notu

Mevcut MVP, staj teslimi için anlatılabilir durumdadır. Web panel tarafı uçtan uca güçlü biçimde tamamlanmıştır. Android tarafı ise auth omurgası ve ana iş akışlarının foundation düzeyinde hazırlanmış, build güvenliği korunmuş ve sonraki fazlara devredilebilir hale getirilmiştir.
