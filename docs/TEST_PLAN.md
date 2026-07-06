# TEST_PLAN

## Komut Dogrulama Ozeti

| Alan | Sonuc | Not |
| --- | --- | --- |
| Web `npm run lint` | gecti | 2026-07-06 tarihinde calistirildi |
| Web `npm run build` | gecti | Ortam degiskenleri olmadan build tamamladi |
| Android `gradlew.bat assembleDebug` | gecti | Android tarafinda regresyon gorulmedi |
| `npx supabase --version` | gecti | `2.109.0` |
| `docker version` | kaldi | Docker daemon/engine erisimi yok |
| `npx supabase status` | kaldi | Docker engine kapali oldugu icin calismadi |

## Supabase Dogrulama Durumu

| Kontrol | Durum | Neden |
| --- | --- | --- |
| `npx supabase stop` | test edilemedi | Docker engine kapali |
| `npx supabase start` | test edilemedi | Docker engine kapali |
| `npx supabase db reset` | test edilemedi | Docker engine kapali |
| Yerel seed sonucu | test edilemedi | `db reset` calismadi |
| `schema_smoke_test.sql` | test edilemedi | Yerel PostgreSQL container acilamadi |
| `rls_smoke_test.sql` | test edilemedi | Yerel PostgreSQL container acilamadi |
| Uzak migration push | test edilemedi | Yerel reset kapisi gecilemedi, project ref saglanmadi |

Bu nedenle migration ve RLS tarafinda bu asamada yalnizca statik dosya incelemesi ve komut hazirligi vardir; runtime basari raporlanmamistir.

## Auth ve Role Testleri

| Kod | Senaryo | Beklenen | Sonuc | Neden |
| --- | --- | --- | --- | --- |
| AUTH-01 | Gecersiz e-posta/parola ile giris | Turkce hata, dashboard acilmaz | test edilemedi | `.env.local` ve demo hesaplar hazir degil |
| AUTH-02 | Technician hesabiyla giris | Dashboard acilir | test edilemedi | Demo auth kullanicisi olusturulmadi |
| AUTH-03 | Admin hesabiyla giris | Dashboard acilir | test edilemedi | Demo auth kullanicisi olusturulmadi |
| AUTH-04 | Employee hesabiyla giris | Access denied ekrani acilir | test edilemedi | Demo auth kullanicisi olusturulmadi |
| AUTH-05 | Oturum acmadan `/dashboard` | `/login` sayfasina redirect | test edilemedi | Runtime env degerleri eklenmedi |
| AUTH-06 | Oturum acmadan `/tickets` | `/login` sayfasina redirect | test edilemedi | Runtime env degerleri eklenmedi |
| AUTH-07 | Technician `/tickets` | RLS tarafindan izin verilen liste veya empty state | test edilemedi | Demo technician session'i yok |
| AUTH-08 | Logout | Session kapanir ve `/login` acilir | test edilemedi | Gercek oturum olusturulmadi |
| AUTH-09 | Logout sonrasi `/dashboard` | Tekrar `/login` | test edilemedi | Gercek oturum olusturulmadi |
| AUTH-10 | Pasif profile ile giris | Yonetim paneline erisim verilmez | test edilemedi | Pasif demo profile hazir degil |
| AUTH-11 | Profile satiri olmayan auth kullanicisi | Kontrollu hata; uygulama cokmez | test edilemedi | Bu durum icin demo auth kaydi olusturulmadi |
| AUTH-12 | Environment variable eksik | Secret gostermeyen anlasilir gelistirme hatasi | gecti | Browser uzerinden `/login` acildiginda anlasilir env hata mesaji goruldu |

## Browser Tabanli Hizli Kontrol

| Senaryo | Sonuc | Not |
| --- | --- | --- |
| Ana sayfa `/` acilisi | gecti | Giris linki ve guncel kapsam kartlari goruldu |
| `/login` env eksik davranisi | gecti | Beklenen gelistirme hatasi uretiliyor |

## RLS Runtime Testleri

RLS runtime testleri bu asamada test edilemedi.

Nedenler:

- Yerel Supabase stack baslatilamadi
- Uzak gelistirme projesi baglanmadi
- Demo kullanicilar olusturulmadi
- Demo ticket ve yorum verisi hazir degil

Sonraki asamada demo kullanicilar ve kontrollu demo ticket verileri hazirlandiginda, gercek session uzerinden publishable key + user session davranisi test edilmelidir.
