# Tepebaşı BT Destek

Tepebaşı BT Destek, belediye içindeki teknik destek taleplerini ve cihaz envanterini daha düzenli takip edebilmek için hazırladığım çok platformlu bir MVP prototipidir. Proje, web tarafında yönetim paneli; mobil tarafta ise Android için temel kullanıcı akışlarını içerir.

## Projenin Amacı

Bu projede hedefim, teknik destek sürecini yalnızca mesajlaşma veya dağınık kayıtlarla yürütmek yerine daha izlenebilir bir yapıya taşımaktı.

Temel ihtiyaçlar şunlardı:

- personelin destek talebi oluşturabilmesi
- teknik personelin talepleri takip edebilmesi
- cihaz envanterinin kayıt altında tutulabilmesi
- rol bazlı yetki kontrolünün korunması
- web ve mobil tarafın aynı veri modeline dayanması

## Kullanılan Teknolojiler

### Web

- Next.js 16
- TypeScript
- ESLint
- CSS Modules
- Supabase SSR auth

### Android

- Kotlin
- Jetpack Compose
- Navigation Compose
- Gradle Kotlin DSL
- Supabase Kotlin istemcisi

### Backend ve Veri Katmanı

- Supabase
- PostgreSQL
- Row Level Security
- Supabase Auth
- Supabase Storage

## Web Panel Özellikleri

- giriş ve çıkış akışı
- rol bazlı erişim kontrolü
- dashboard ekranı
- talep listesi
- talep detay ekranı
- yorum, durum ve atama akışı
- cihaz listesi
- cihaz detay ekranı
- cihaz oluşturma ve düzenleme akışı
- bakım kayıtları bölümü
- QR önizleme ekranı

## Android Uygulama Kapsamı

Android tarafında kimlik doğrulama akışı ve rol bazlı başlangıç ekranları hazırlandı. Employee, technician ve admin için giriş sonrası farklı home ekranları gösteriliyor.

Ticket ve device tarafında ise temel ekran altyapısı hazırlandı:

- ticket listesi için temel yapı
- ticket detay ekranı için temel yapı
- yeni talep oluşturma ekranı için temel yapı
- technician queue için temel yapı
- ticket yorum akışı için temel yapı
- cihaz listesi ve cihaz detay ekranı için temel yapı
- bakım geçmişi ve QR önizleme için temel yapı

Bu alanlar proje içinde yer alıyor. Android tarafında kimlik doğrulama ve rol bazlı ana ekranlar doğrulandı; ticket ve cihaz modülleri için temel ekran, repository ve navigation altyapısı hazırlandı.

## Güvenlik Yaklaşımı

- Rol bazlı erişim kontrolü Supabase Auth ve `profiles` yapısı üzerinden yönetilir.
- Ana tablolarda RLS aktiftir.
- Service role key istemci tarafına verilmez.
- Web ve Android tarafı kullanıcı oturumu ile çalışır.
- QR içeriğinde doğrudan hassas bilgi yerine güvenli token yaklaşımı kullanılır.

## Kurulum / Çalıştırma

### Web

```bash
cd apps/web
npm install
npm run lint
npm run build
npm run dev
```

### Android

```bash
cd apps/android
gradlew.bat assembleDebug
```

### Supabase

```bash
npx supabase start
npx supabase db reset
npx supabase status
```

## Proje Klasör Yapısı

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
|-- .gitignore
`-- README.md
```

## Gelecek Geliştirme Fikirleri

- Android tarafında ticket ve device ekranlarının canlı doğrulamasını tamamlamak
- mobil tarafta ticket akışlarını genişletmek
- karar destek ve raporlama ekranları eklemek
- kural tabanlı akıllı çözüm önerisi akışını ayrı fazda değerlendirmek

Detaylı test durumu ve proje notları için `docs/` klasöründeki belgeler kullanılabilir.
