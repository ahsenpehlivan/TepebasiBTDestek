# ANDROID_AUTH

## Özet

Android uygulamada Supabase auth temeli tamamlanmıştır. Bu temel, Android MVP'nin kalan tüm ticket ve device foundation ekranlarının giriş noktasıdır.

Kapsam:

- Supabase ile giriş ve çıkış
- splash session kontrolü
- role-based home ekranları
- pasif profil için erişim engeli
- profile satırı olmayan kullanıcı için kontrollü hata
- eksik config için kontrollü hata

## Dosya Konumları

- `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/MainActivity.kt`
- `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/core/AppContainer.kt`
- `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/data/remote/supabase/SupabaseClientProvider.kt`
- `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/data/auth/SupabaseAuthRepository.kt`
- `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/domain/auth/*`
- `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/navigation/*`

## Config ve Secrets Yaklaşımı

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Gerçek değerler yalnızca yerel `apps/android/secrets.properties` dosyasında tutulur.

Repository'ye yalnızca:

- `apps/android/secrets.defaults.properties`

eklenir.

Git'e alınmaması gerekenler:

- `apps/android/secrets.properties`
- `apps/android/local.properties`
- secret key, service role key, database password

## Role Davranışı

- `employee` -> `EmployeeHomeScreen`
- `technician` -> `TechnicianHomeScreen`
- `admin` -> `AdminHomeScreen`
- `is_active = false` -> `AccessDenied`
- profile satırı yok -> `AuthError`

## Gerçek Runtime'da Doğrulananlar

- eksik config hata ekranı
- geçersiz e-posta/parola
- employee login
- technician login
- admin login
- pasif profile giriş
- profile satırı olmayan auth kullanıcısı
- logout
- logout sonrası geri tuşu

## Hâlâ Test Edilemeyenler

- session restore

Bu akış build seviyesinde değil, canlı oturum seviyesinde açık kaldı. Bunun nedeni yeni geçici auth kullanıcısı oluşturmama ve mevcut demo parola bilgilerini dokümana taşımama kuralıdır.

## Android Auth Sonrası Foundation Ekranları

Auth sonrası açılan foundation ekranları hazır durumdadır:

- employee ticket list/detail/create
- technician queue
- technician status update
- ticket comment
- device list/detail
- device maintenance history
- device QR preview

Bu ekranların tamamı build ve navigation düzeyinde bağlıdır; ancak hepsi gerçek employee veya technician oturumu ile uçtan uca runtime kanıtı almış değildir.
