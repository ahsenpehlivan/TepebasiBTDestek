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
| Remote grant migration gecmisi | gecti | Linked remote `supabase_migrations.schema_migrations` sorgusunda `20260706000200_restore_public_api_grants.sql` kaydi dogrulandi |
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
| Data API grant tutarliligi | gecti | Local reset sonrasi `anon` ve `authenticated` rollerine gerekli tablo/function/sequence grant'leri `20260706000200_restore_public_api_grants.sql` ile kalici hale getirildi |
| Uzak grant migration varligi | gecti | Linked remote migration gecmisinde `20260706000200` kaydi bulundu |

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
| AUTH-07 | Technician `/tickets` | RLS ile izin verilen liste veya empty state | gecti | `/tickets` acildi ve demo ticket listesi goruldu |
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
| Technician `/tickets` gorebilmeli | gecti | Browser akisinda `/tickets` sayfasi demo ticket listesiyle acildi |
| Anonymous `/tickets` gorememeli | gecti | Browser akisinda `/login?next=%2Ftickets` yonlendirmesi oldu; local anon session `tickets` sorgusu `0` satir dondu |
| Employee baska profile okuyamamali | gecti | Local employee session ile kendi disindaki `profiles` kayitlari `0` satir dondu |
| Technician profilleri okuyebilmeli | gecti | Local technician session ile 3 demo profile ozeti goruldu |
| Technician ticket sorgusu | gecti | Local technician session ile 6 demo ticket kaydi dondu |
| Employee ticket sorgusu | gecti | Local employee session ile 4 kendi ticket kaydi dondu |
| Employee baska kullanici ticket'ini gorememeli | gecti | Local employee session `Demo dahili teknik kontrol kaydi` kaydini goremedi |
| Employee public yorumu gorebilmeli | gecti | Local employee session ile hedef ticket'ta 1 public comment dondu |
| Employee internal yorumu gorememeli | gecti | Local employee session ile ayni ticket'ta `0` internal comment dondu |
| Technician internal yorumu gorebilmeli | gecti | Local technician session ile ayni ticket'ta `1` internal comment dondu |

## Bootstrap Role Assignment Duzeltmesi

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| Yeni migration ile `protect_profile_mutation()` guncellemesi | gecti | `20260706000100_fix_profile_bootstrap_admin_update.sql` local reset ve remote push sirasinda uygulandi |
| Database-owner baglaminda ilk role assignment | gecti | Kontrollu bootstrap istisnasi yalnizca privileged database-owner baglamina acik |
| Normal authenticated self-escalation | gecti | Runtime testlerde authenticated web kullanicilari rol bypass alamadi |

## Demo Ticket ve Comment Veri Testleri

| Test | Sonuc | Neden |
| --- | --- | --- |
| Local controlled demo snippet uygulamasi | gecti | `supabase/snippets/create_demo_tickets.sql` local veritabaninda calisti ve 6 ticket olusturdu |
| Local duplicate korumasi | gecti | Snippet ikinci kez calistirildiginda ayni 6 kayit korundu, duplicate olusmadi |
| Local comment/history/activity olusumu | gecti | 6 comment, 3 internal comment, history ve activity log kayitlari dogrulandi |
| Remote controlled demo snippet uygulamasi | gecti | Linked remote projede snippet calisti ve 6 demo ticket olustu |
| Remote demo comment olusumu | gecti | Linked remote projede 6 comment ve 3 internal comment dogrulandi |

## Ticket Arayuzu ve Action Testleri

| Test | Sonuc | Neden |
| --- | --- | --- |
| `/tickets` arama ve filtreleme | gecti | Query parametreli durum filtresi browser akisinda dogrulandi |
| `/tickets/[id]` detay goruntuleme | gecti | Remote browser'da ticket ozeti, cihaz ozeti, yorumlar ve durum gecmisi acildi |
| Ticket atama action'i | gecti | Ticket `#1003` icin assignee kaydi `Runtime Teknik Personel 2` olarak dogrulandi |
| Ticket status transition action'i | gecti | Ticket `#1003` icin `resolved -> closed` gecisi history tablosunda dogrulandi |
| Public/internal yorum action'i | gecti | Ticket `#1003` comment sayisi 2'den 3'e, internal comment sayisi 1'den 2'ye yukselerek dogrulandi |
| Dashboard gercek count kartlari | gecti | Ticket ve cihaz sayaclari gercek sorgularla beslendi; remote toplam demo ticket `6`, cihaz sayisi `4` |

## Device ve Maintenance Testleri

| Test | Sonuc | Neden |
| --- | --- | --- |
| `/devices` listeleme | gecti | Remote browser akisinda 4 demo cihaz tablo halinde goruldu |
| `/devices` filtreleme | gecti | `status=in_repair` filtresi ile liste tek cihaz kaydina daraldi |
| `/devices/[id]` detay goruntuleme | gecti | Remote browser'da cihaz ozeti, QR token ozeti, ilgili ticket alani ve bakim bolumu acildi |
| Device create action | gecti | Ilk denemede kayit olustu ancak formda kalma UX hatasi bulundu; action server redirect ile duzeltildi ve ikinci denemede detay sayfasina yonlendirerek dogrulandi |
| Device edit action | gecti | Remote browser'da model, atanan kullanici, durum, isletim sistemi ve notlar guncellenip detay ekraninda goruldu |
| Device pasife alma action | gecti | Onayli akista cihaz `is_active = false` ve `status = retired` durumuna gecti; form disabled oldu |
| QR onizleme ekrani | gecti | Protected QR sayfasinda payload `TBT-DEVICE:<token>` ve yazdir butonu goruldu |
| QR token route | gecti | `/devices/qr/[token]` route'u ilgili cihaz detayina yonlendirdi |
| Bakim kaydi ekleme action'i | gecti | Remote browser'da bakim kaydi eklendi ve ayni detay ekraninda listelendi |

## Device ve Maintenance RLS Runtime Testleri

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| DEVICE-RLS-01 Employee kendi atanmis aktif cihazini okuyabiliyor | gecti | Local employee session ile technician tarafindan atanan test cihaz `1` kayit olarak goruldu |
| DEVICE-RLS-02 Employee tum cihaz listesini goremiyor | gecti | Local employee session yalniz atanmis cihazini gordu; unassigned demo cihazlar gorunmedi |
| DEVICE-RLS-03 Technician cihaz listesini gorebiliyor | gecti | Local technician session ile toplam `6` cihaz kaydi okundu |
| DEVICE-RLS-04 Technician cihaz olusturabiliyor | gecti | Local technician session ile yeni demo cihaz insert edildi |
| DEVICE-RLS-05 Technician cihaz guncelleyebiliyor | gecti | Local technician session ile ayni cihaz `status = in_repair` ve not guncellemesi basariyla uygulandi |
| DEVICE-RLS-06 Employee cihaz olusturamiyor | gecti | Local employee session insert denemesi RLS ile engellendi |
| MAINT-RLS-01 Technician bakim kaydi ekleyebiliyor | gecti | Local technician session ile yeni maintenance kaydi olusturuldu |
| MAINT-RLS-02 Employee bakim kaydi ekleyemiyor | gecti | Local employee session maintenance insert denemesi RLS ile engellendi |
| MAINT-RLS-03 Cihaz detayinda bakim gecmisi gorunuyor | gecti | Local technician session sorgusunda 1 maintenance kaydi dondu; remote browser detayinda da gorundu |
| Pasife alma sonrasi employee gorunurlugu | gecti | Local technician session ile pasife alinan cihaz employee session gorunumunden dustu |

## Hala Manuel Olan Kontroller

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| AUTH-12 eksik env browser akisi | test edilemedi | Next.js build cache etkisini bozmadan ayrik browser instance ile eksik env senaryosu tekrar uretilemedi |
