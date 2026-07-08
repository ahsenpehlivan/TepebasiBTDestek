# ANDROID_AUTH

## Ozet

Android uygulamasinda bu fazda yalnizca auth temeli kurulmustur.

Kapsam:

- Supabase Auth ile giris ve cikis omurgasi
- `profiles` tablosundan rol ve profil cozumleme
- Role gore baslangic ekrani yonlendirmesi
- Employee, technician ve admin rollerinin Android tarafinda ayrilmasi
- Eksik config, pasif profil ve profile satiri yok durumlari icin kontrollu ekranlar

Bu fazda ticket listesi, ticket detay, QR tarama, foto yukleme, realtime, notification veya offline katmani eklenmemistir.

## Konumlar

- Uygulama giris noktasi: `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/MainActivity.kt`
- App container: `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/core/AppContainer.kt`
- Supabase client: `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/data/remote/supabase/SupabaseClientProvider.kt`
- Auth repository: `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/data/auth/SupabaseAuthRepository.kt`
- Session modelleri: `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/domain/auth/*`
- Navigation: `apps/android/app/src/main/java/com/ahsen/tepebasibtdestek/navigation/*`

## Config ve Secrets Yaklasimi

- Android istemcisi yalnizca iki public deger kullanir:
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
- Gercek degerler `apps/android/secrets.properties` dosyasinda tutulur.
- Repository'ye yalnizca `apps/android/secrets.defaults.properties` eklenir.
- `apps/android/secrets.properties` ve `apps/android/local.properties` Git tarafindan izlenmez.
- Service role key, database password veya secret key Android uygulamasina eklenmez.

`BuildConfig` alanlari:

- `BuildConfig.SUPABASE_URL`
- `BuildConfig.SUPABASE_PUBLISHABLE_KEY`

Eksik config durumunda uygulama crash etmek yerine su mesaji temel alir:

`Supabase yapilandirmasi eksik. Lutfen Android secrets.properties dosyasini kontrol edin.`

## Auth Mimarisi

Akis:

1. Uygulama `Splash` rotasinda acilir.
2. Supabase client yapilandirmasi kontrol edilir.
3. Auth plugin baslatimi beklenir ve mevcut session okunur.
4. Session varsa `profiles` tablosundan kullanicinin profili okunur.
5. `is_active = false` ise `AccessDenied` ekranina gidilir.
6. Profil varsa rol okunur ve role gore ana ekrana gidilir.
7. Profil yoksa `AuthError` ekranina gidilir.

Role davranisi:

- `employee` -> `EmployeeHomeScreen`
- `technician` -> `TechnicianHomeScreen`
- `admin` -> `AdminHomeScreen`

Web'den farkli olarak employee rolu Android tarafinda kendi mobil baslangic ekranina yonlendirilir.

## Login ve Logout Akisi

Login:

- E-posta trim ve lowercase normalize edilir.
- Bos alanlar icin Turkce validation mesaji gosterilir.
- Ham Supabase hata metni kullaniciya verilmez.
- Basarili giris sonrasi profile/role cozumlenir ve dogru route acilir.

Logout:

- Supabase session kapatilir.
- Back stack temizlenerek `Login` ekranina donulur.
- Hata olursa Turkce mesaj gosterilir.

## Role-Based Home Ekranlari

Bu fazdaki home ekranlari iskelet niteligindedir.

- Employee home: personel mobil ekraninin hazirlandigini bildirir
- Technician home: teknik kuyrugun sonraki fazda gelecegini bildirir
- Admin home: mobil yonetici ozetinin sonraki faza birakildigini bildirir

Tum home ekranlarinda:

- kullanici adi
- rol etiketi
- sonraki faz notu
- logout butonu

bulunur.

## Test Senaryolari

Hedef senaryolar:

- eksik config
- gecersiz giris
- employee / technician / admin login
- pasif profile
- profile satiri olmayan auth kullanicisi
- logout
- logout sonrasi geri tusu
- uygulama yeniden acildiginda mevcut session ile dogru role donus

Bu turde emulator veya fiziksel cihaz erisimi olmadigi icin runtime cihaz testleri tamamlanamadi. `assembleDebug` ve kaynak kod akislarinin tutarliligi dogrulandi.

## Bilinen Eksikler

- Gercek cihaz veya emulator uzerinde Android auth senaryolari henuz manuel olarak dogrulanmadi.
- Ticket listeleme ve detay ekranlari sonraki faza birakildi.
- Android tarafinda demo kullanici parolalari dokumante edilmedi ve source code'a yazilmadi.

## Sonraki Asama

- Android personel ticket listeleme
- Android personel ticket detay ekrani
- Android technician ticket queue iskeleti
