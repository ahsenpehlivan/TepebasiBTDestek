# AUTHENTICATION

## Özet

Projede web ve Android için ortak Supabase auth yaklaşımı kullanılır; ancak erişim davranışı platforma göre farklıdır.

- Web panel teknik personel ve yöneticilere açıktır.
- Android uygulama employee, technician ve admin rolleri için ayrı başlangıç ekranları içerir.

## Web Auth Akışı

Web tarafında tamamlanan yapı:

- browser client
- server client
- `src/proxy.ts`
- login/logout server action'ları
- protected layout
- role ve aktiflik çözümleme

Web kuralları:

1. Kullanıcı yoksa `/login`
2. Profile satırı yoksa `/auth-error`
3. `is_active = false` ise `/access-denied`
4. `employee` ise `/access-denied`
5. `technician` ve `admin` ise panel açılır

Rol kararı yalnızca `public.profiles.role` alanından verilir.

## Android Auth Akışı

Android tarafında auth foundation tamamlanmıştır.

Davranış:

- `employee` -> `EmployeeHomeScreen`
- `technician` -> `TechnicianHomeScreen`
- `admin` -> `AdminHomeScreen`
- `is_active = false` -> `AccessDenied`
- profile satırı yok -> `AuthError`
- eksik config -> `ConfigError`

Bu ayrım bilinçlidir; çünkü web panel ile personel odaklı mobil akış farklı ihtiyaçlara hizmet eder.

## Güvenlik İlkeleri

- Service role key istemciye eklenmez.
- Android tarafında yalnızca `SUPABASE_URL` ve `SUPABASE_PUBLISHABLE_KEY` kullanılır.
- Web tarafında rol kararı client state veya cookie metadata üzerinden verilmez.
- `.env.local`, `secrets.properties` ve demo parola bilgileri Git'e alınmaz.

## Web Runtime Doğrulamaları

Gerçek browser akışında doğrulananlar:

- geçersiz girişte Türkçe hata
- technician dashboard erişimi
- admin dashboard erişimi
- employee web panel reddi
- pasif profil reddi
- profile satırı olmayan kullanıcı için kontrollü hata
- logout sonrası protected route yönlendirmesi

## Android Runtime Doğrulamaları

Gerçek emulator akışında doğrulananlar:

- eksik config hata ekranı
- geçersiz giriş
- employee login
- technician login
- admin login
- pasif profil
- profile satırı olmayan kullanıcı
- logout
- logout sonrası geri tuşu

Hâlâ test edilemeyen Android auth noktası:

- session restore testi

Bu senaryo, yeni geçici auth kullanıcısı oluşturmama ve mevcut parolaları dokümana yazmama kuralları nedeniyle yeniden kanıtlanamadı.

## Bilinen Sınırlar

- AUTH-12 eksik env browser senaryosu ayrık instance ile yeniden üretilmedi
- Android tarafında bazı sonraki ekranlar auth sonrası canlı oturumla ilerlenemedi

Bu nedenle Android’de auth omurgası güçlü biçimde kurulmuş olsa da bazı sonraki feature ekranları dokümantasyonda foundation seviyesinde tutulur.
