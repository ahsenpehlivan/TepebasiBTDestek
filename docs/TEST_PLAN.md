# TEST_PLAN

## Komut Dogrulama Ozeti

| Alan | Sonuc | Not |
| --- | --- | --- |
| Web `npm run lint` | gecti | 2026-07-06 tarihinde remote auth/RLS dogrulamasi sonrasinda yeniden calistirildi |
| Web `npm run build` | gecti | 2026-07-06 tarihinde remote auth/RLS dogrulamasi sonrasinda yeniden calistirildi |
| Android `gradlew.bat assembleDebug` | gecti | 2026-07-06 tarihinde yeniden calistirildi |
| `docker version` | gecti | Docker engine erisimi var |
| `npx supabase --version` | gecti | `2.109.0` |
| `npx supabase db reset` | gecti | Yeni migration dahil tum migrationlar ve seed basariyla uygulandi |
| `npx supabase db push` | gecti | `20260706000100_fix_profile_bootstrap_admin_update.sql` remote projeye uygulandi |
| `apps/web/.env.local` Git takibi | gecti | Dosya untracked; icerik raporlanmadi |

## Supabase Dogrulama Durumu

| Kontrol | Durum | Neden |
| --- | --- | --- |
| Yerel migration zinciri | gecti | `20260703000100` -> `20260706000100` arasi migrationlar uygulandi |
| Yerel seed sonucu | gecti | `supabase/seed.sql` reset sonrasinda yuklendi |
| Enum varligi | gecti | Beklenen enumlar mevcut |
| 9 ana tablo | gecti | Beklenen tablolar olustu |
| RLS etkinligi | gecti | Ana tablolarda `relrowsecurity = true` |
| `ticket-attachments` private bucket | gecti | Bucket `public = false` |
| Trigger ve helper functionlar | gecti | `protect_profile_mutation()` dahil beklenen functionlar bulundu |
| Uzak migration push | gecti | Linked remote proje ile `npx supabase db push` basarili tamamlandi |

## Smoke Testleri

Bu SQL dosyalari gercek rol davranisini degil, sema, RLS ve policy varligini kontrol eden smoke testlerdir.

| Test | Sonuc | Neden |
| --- | --- | --- |
| `supabase/tests/schema_smoke_test.sql` | gecti | `BEGIN -> DO -> ROLLBACK` ile hatasiz tamamlandi |
| `supabase/tests/rls_smoke_test.sql` | gecti | `BEGIN -> DO -> ROLLBACK` ile hatasiz tamamlandi |

## Remote Demo Profile Kontrolu

| E-posta | Beklenen Rol | Beklenen Birim | Sonuc | Neden |
| --- | --- | --- | --- | --- |
| `employee.demo@example.com` | `employee` | `IK` | gecti | Remote `profiles` ve `departments` sorgusunda eslesme bulundu |
| `technician.demo@example.com` | `technician` | `BILGI_ISLEM` | gecti | Remote `profiles` ve `departments` sorgusunda eslesme bulundu |
| `admin.demo@example.com` | `admin` | `BILGI_ISLEM` | gecti | Remote `profiles` ve `departments` sorgusunda eslesme bulundu |

## Auth Testleri

Not: Demo kullanici parolalari repository icinde tutulmadigi icin browser auth testleri, remote projede gecici olarak acilan ve test sonunda silinen kontrollu runtime kullanicilarla yapildi. Roller ve department atamalari demo kullanicilarla ayni tutuldu.

| Kod | Senaryo | Beklenen | Sonuc | Neden |
| --- | --- | --- | --- | --- |
| AUTH-01 | Gecersiz e-posta/parola ile giris | Turkce hata, dashboard acilmaz | gecti | `/login` uzerinde Turkce hata goruldu ve dashboard acilmadi |
| AUTH-02 | Technician hesabiyla giris | Dashboard acilir | gecti | Gecici remote technician hesabi ile `/dashboard` acildi |
| AUTH-03 | Admin hesabiyla giris | Dashboard acilir | gecti | Gecici remote admin hesabi ile `/dashboard` acildi |
| AUTH-04 | Employee hesabiyla giris | Access denied ekrani acilir | gecti | Gecici remote employee hesabi `/access-denied` ekranina yonlendirildi |
| AUTH-05 | Oturum acmadan `/dashboard` | `/login` sayfasina yonlenir | gecti | `/login?next=%2Fdashboard` yonlendirmesi gozlemlendi |
| AUTH-06 | Oturum acmadan `/tickets` | `/login` sayfasina yonlenir | gecti | `/login?next=%2Ftickets` yonlendirmesi gozlemlendi |
| AUTH-07 | Technician `/tickets` | RLS ile izin verilen liste veya empty state | gecti | `/tickets` acildi ve empty state goruldu |
| AUTH-08 | Logout | Session kapanir ve `/login` acilir | gecti | Logout sonrasi `/login` sayfasi acildi |
| AUTH-09 | Logout sonrasi `/dashboard` | Tekrar `/login` | gecti | Logout sonrasi `/login?next=%2Fdashboard` yonlendirmesi oldu |
| AUTH-10 | Pasif profile ile giris | Yonetim paneline erisim verilmez | gecti | Pasif runtime profile `/access-denied` ekranina yonlendirildi |
| AUTH-11 | Profile satiri bulunmayan auth kullanicisi | Kontrollu hata; uygulama cokmez | gecti | `/auth-error` ekrani kontrollu bicimde acildi |
| AUTH-12 | Environment variable eksik | Secret gostermeyen anlasilir gelistirme hatasi | test edilemedi | Ayrik browser instance icin eksik env durumunu Next.js build cache etkisini bozmadan canli olarak yeniden uretmek bu turde guvenli degildi; kaynak kodda `apps/web/src/lib/supabase/env.ts` secret icermeyen hata mesaji atiyor |

## RLS Runtime Testleri

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| Employee web paneline girememeli | gecti | Browser akisinda login sonrasi `/access-denied` goruldu |
| Employee `/tickets` rotasina erisememeli | gecti | Browser akisinda `/tickets` istegi `/access-denied` ekraninda kaldi |
| Technician `/tickets` gorebilmeli | gecti | Browser akisinda `/tickets` sayfasi empty state ile acildi |
| Anonymous `/tickets` gorememeli | gecti | Browser akisinda `/login?next=%2Ftickets` yonlendirmesi oldu; anon SQL sorgusu `0` kayit dondurdu |
| Employee baska profile okuyamamali | gecti | Employee session ile `profiles` sorgusunda kendi disindaki kayitlar `0` satir dondu |
| Technician profilleri okuyebilmeli | gecti | Technician session ile `profiles` sorgusu `5` satir dondurdu |
| Technician ticket sorgusu | gecti | Technician session ile `tickets` sorgusu RLS hatasi vermeden `0` satir dondu |
| Employee ticket sorgusu | gecti | Employee session ile `tickets` sorgusu RLS hatasi vermeden `0` satir dondu |
| Internal yorum gorunurlugu | test edilemedi | Remote ortamda yorum verisi yok |
| Baska kullanici ticket senaryolari | test edilemedi | Remote ortamda demo ticket verisi yok |

## Bootstrap Role Assignment Duzeltmesi

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| Yeni migration ile `protect_profile_mutation()` guncellemesi | gecti | `20260706000100_fix_profile_bootstrap_admin_update.sql` local reset ve remote push sirasinda uygulandi |
| Database-owner baglaminda ilk role assignment | gecti | Kontrollu bootstrap istisnasi yalnizca privileged database-owner baglamina acik |
| Normal authenticated self-escalation | gecti | Runtime testlerde authenticated web kullanicilari rol bypass alamadi |

## Hala Manuel Olan Kontroller

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| Remote SQL Editor uzerinden demo role assignment tekrar denemesi | test edilemedi | Bu turde Dashboard SQL Editor acilmadi; linked remote ve browser tarafi terminalden dogrulandi |
