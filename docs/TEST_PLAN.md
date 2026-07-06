# TEST_PLAN

## Komut Dogrulama Ozeti

| Alan | Sonuc | Not |
| --- | --- | --- |
| Web `npm run lint` | gecti | 2026-07-06 tarihinde yeniden calistirildi |
| Web `npm run build` | gecti | Build `.env.local` ile tamamlandi; icerik raporlanmadi |
| Android `gradlew.bat assembleDebug` | gecti | 2026-07-06 tarihinde yeniden calistirildi |
| `docker version` | gecti | Docker engine erisimi var |
| `npx supabase --version` | gecti | `2.109.0` |
| `npx supabase stop` | gecti | Yerel stack temiz bicimde durduruldu |
| `npx supabase start` | gecti | Yerel stack yeniden ayaga kalkti |
| `npx supabase db reset` | gecti | Tum migrationlar ve seed basariyla uygulandi |
| `npx supabase status` | gecti | Local stack calisiyor |

## Supabase Dogrulama Durumu

| Kontrol | Durum | Neden |
| --- | --- | --- |
| Yerel migration zinciri | gecti | `20260703000100` -> `20260703000500` arasi tum migrationlar uygulandi |
| Yerel seed sonucu | gecti | `supabase/seed.sql` reset sonrasinda yüklendi |
| Enum varligi | gecti | 7 hedef enum olustu |
| 9 ana tablo | gecti | Beklenen 9 tablo olustu |
| RLS etkinligi | gecti | 9 ana tablonun tamaminda `relrowsecurity = true` |
| `ticket-attachments` private bucket | gecti | Bucket `public = false` |
| `departments` seed kayitlari | gecti | 6 kayit mevcut |
| Demo cihaz seed kayitlari | gecti | 4 kayit mevcut |
| Trigger ve helper functionlar | gecti | Beklenen helper function ve trigger isimleri bulundu |
| Uzak migration push | test edilemedi | Bu asama yalnizca yerel dogrulama icin yapildi; remote islem calistirilmadi |

## Smoke Testleri

Bu iki SQL dosyasi gercek rol davranisini degil, sema, RLS ve policy varligini kontrol eden smoke testlerdir.

| Test | Sonuc | Neden |
| --- | --- | --- |
| `supabase/tests/schema_smoke_test.sql` | gecti | `BEGIN -> DO -> ROLLBACK` ile hatasiz tamamlandi |
| `supabase/tests/rls_smoke_test.sql` | gecti | `BEGIN -> DO -> ROLLBACK` ile hatasiz tamamlandi |

## Auth ve Role Testleri

| Kod | Senaryo | Beklenen | Sonuc | Neden |
| --- | --- | --- | --- | --- |
| AUTH-01 | Gecersiz e-posta/parola ile giris | Turkce hata, dashboard acilmaz | test edilemedi | Gercek demo auth kullanicilari ve kontrollu giris verisi bu turda hazirlanmadi |
| AUTH-02 | Technician hesabiyla giris | Dashboard acilir | test edilemedi | Demo technician hesabi olusturulmadi |
| AUTH-03 | Admin hesabiyla giris | Dashboard acilir | test edilemedi | Demo admin hesabi olusturulmadi |
| AUTH-04 | Employee hesabiyla giris | Access denied ekrani acilir | test edilemedi | Demo employee hesabi olusturulmadi |
| AUTH-05 | Oturum acmadan `/dashboard` | `/login` sayfasina redirect | test edilemedi | Browser session senaryosu bu turda tekrar koşturulmadi |
| AUTH-06 | Oturum acmadan `/tickets` | `/login` sayfasina redirect | test edilemedi | Browser session senaryosu bu turda tekrar koşturulmadi |
| AUTH-07 | Technician `/tickets` | RLS tarafindan izin verilen liste veya empty state | test edilemedi | Demo technician session'i yok |
| AUTH-08 | Logout | Session kapanir ve `/login` acilir | test edilemedi | Gercek oturum olusturulmadi |
| AUTH-09 | Logout sonrasi `/dashboard` | Tekrar `/login` | test edilemedi | Gercek oturum olusturulmadi |
| AUTH-10 | Pasif profile ile giris | Yonetim paneline erisim verilmez | test edilemedi | Pasif demo profile hazir degil |
| AUTH-11 | Profile satiri olmayan auth kullanicisi | Kontrollu hata; uygulama cokmez | test edilemedi | Bu durum icin demo auth kaydi olusturulmadi |
| AUTH-12 | Environment variable eksik | Secret gostermeyen anlasilir gelistirme hatasi | test edilemedi | Bu turda `.env.local` mevcut oldugu icin eksik env senaryosu tekrar uretilmedi |

## Diger Dogrulamalar

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| `apps/web/.env.local` Git takibi | gecti | Dosya mevcut ama Git tarafindan izlenmiyor |

## RLS Runtime Testleri

RLS runtime testleri bu asamada halen test edilemedi.

Nedenler:

- Demo auth kullanicilari olusturulmadi
- Rol bazli gercek publishable-key + user session senaryolari kosulmadi
- Demo ticket/comment verisi hazir degil

Yerel SQL smoke testleri gecti, ancak bunlar runtime yetki davranisinin tam kaniti olarak yorumlanmamalidir.
