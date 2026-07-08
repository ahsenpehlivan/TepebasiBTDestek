# TEST_PLAN

## Komut Dogrulama Ozeti

| Alan | Sonuc | Not |
| --- | --- | --- |
| Web `npm run lint` | gecti | 2026-07-07 tarihinde Android handoff cleanup dogrulamasi sonrasinda yeniden calistirildi |
| Web `npm run build` | gecti | 2026-07-07 tarihinde erisilebilir sade tasarim polish fazi sonrasinda yeniden calistirildi |
| Android `gradlew.bat assembleDebug` | gecti | 2026-07-08 tarihinde Android auth foundation fazi sonrasinda yeniden calistirildi |
| `docker version` | gecti | Docker engine erisimi var |
| `npx supabase --version` | gecti | `2.109.0` |
| `npx supabase db reset` | gecti | Yeni migration dahil tüm migrationlar ve seed basariyla uygulandi |
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
| AUTH-01 | Gecersiz e-posta/parola ile giriş | Turkce hata, dashboard acilmaz | gecti | `/login` uzerinde Turkce hata goruldu ve dashboard acilmadi |
| AUTH-02 | Technician hesabiyla giriş | Dashboard acilir | gecti | Gecici remote technician hesabi ile `/dashboard` acildi |
| AUTH-03 | Admin hesabiyla giriş | Dashboard acilir | gecti | Gecici remote admin hesabi ile `/dashboard` acildi |
| AUTH-04 | Employee hesabiyla giriş | Access denied ekrani acilir | gecti | Gecici remote employee hesabi `/access-denied` ekranina yonlendirildi |
| AUTH-05 | Oturum acmadan `/dashboard` | `/login` sayfasina yonlenir | gecti | `/login?next=%2Fdashboard` yonlendirmesi gozlemlendi |
| AUTH-06 | Oturum acmadan `/tickets` | `/login` sayfasina yonlenir | gecti | `/login?next=%2Ftickets` yonlendirmesi gozlemlendi |
| AUTH-07 | Technician `/tickets` | RLS ile izin verilen liste veya empty state | gecti | `/tickets` acildi ve demo ticket listesi goruldu |
| AUTH-08 | Logout | Session kapanir ve `/login` acilir | gecti | Logout sonrasi `/login` sayfasi acildi |
| AUTH-09 | Logout sonrasi `/dashboard` | Tekrar `/login` | gecti | Logout sonrasi `/login?next=%2Fdashboard` yonlendirmesi oldu |
| AUTH-10 | Pasif profile ile giriş | Yonetim paneline erisim verilmez | gecti | Pasif runtime profile `/access-denied` ekranina yonlendirildi |
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
| Local duplicate korumasi | gecti | Snippet ikinci kez calistirildiginda ayni 6 kayıt korundu, duplicate olusmadi |
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
| `/devices/[id]` detay goruntuleme | gecti | Remote browser'da cihaz ozeti, QR token ozeti, ilgili ticket alani ve bakım bolumu acildi |
| Device create action | gecti | Ilk denemede kayıt olustu ancak formda kalma UX hatasi bulundu; action server redirect ile duzeltildi ve ikinci denemede detay sayfasina yonlendirerek dogrulandi |
| Device edit action | gecti | Remote browser'da model, atanan kullanici, durum, isletim sistemi ve notlar guncellenip detay ekraninda goruldu |
| Device pasife alma action | gecti | Onayli akista cihaz `is_active = false` ve `status = retired` durumuna gecti; form disabled oldu |
| QR onizleme ekrani | gecti | Protected QR sayfasinda payload `TBT-DEVICE:<token>` ve yazdir butonu goruldu |
| QR token route | gecti | `/devices/qr/[token]` route'u ilgili cihaz detayina yonlendirdi |
| Bakım kaydi ekleme action'i | gecti | Remote browser'da bakım kaydi eklendi ve ayni detay ekraninda listelendi |

## Device ve Maintenance RLS Runtime Testleri

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| DEVICE-RLS-01 Employee kendi atanmis aktif cihazini okuyabiliyor | gecti | Local employee session ile technician tarafindan atanan test cihaz `1` kayıt olarak goruldu |
| DEVICE-RLS-02 Employee tüm cihaz listesini goremiyor | gecti | Local employee session yalniz atanmis cihazini gordu; unassigned demo cihazlar gorunmedi |
| DEVICE-RLS-03 Technician cihaz listesini gorebiliyor | gecti | Local technician session ile toplam `6` cihaz kaydi okundu |
| DEVICE-RLS-04 Technician cihaz olusturabiliyor | gecti | Local technician session ile yeni demo cihaz insert edildi |
| DEVICE-RLS-05 Technician cihaz guncelleyebiliyor | gecti | Local technician session ile ayni cihaz `status = in_repair` ve not guncellemesi basariyla uygulandi |
| DEVICE-RLS-06 Employee cihaz olusturamiyor | gecti | Local employee session insert denemesi RLS ile engellendi |
| MAINT-RLS-01 Technician bakım kaydi ekleyebiliyor | gecti | Local technician session ile yeni maintenance kaydi oluşturuldu |
| MAINT-RLS-02 Employee bakım kaydi ekleyemiyor | gecti | Local employee session maintenance insert denemesi RLS ile engellendi |
| MAINT-RLS-03 Cihaz detayinda bakım gecmisi gorunuyor | gecti | Local technician session sorgusunda 1 maintenance kaydi dondu; remote browser detayinda da gorundu |
| Pasife alma sonrasi employee gorunurlugu | gecti | Local technician session ile pasife alinan cihaz employee session gorunumunden dustu |

## Hala Manuel Olan Kontroller

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| AUTH-12 eksik env browser akisi | test edilemedi | Next.js build cache etkisini bozmadan ayrik browser instance ile eksik env senaryosu tekrar uretilemedi |

## UI Polish ve Manual Route Testleri

| Test | Sonuc | Neden |
| --- | --- | --- |
| `/dashboard` manuel kontrolu | gecti | Local browser oturumunda dashboard kartlari, hizli linkler ve oturum ozeti beklendigi gibi gorundu |
| `/tickets` manuel kontrolu | gecti | Header, filtre alani, liste/kart yapisi ve detay linkleri kontrol edildi |
| `/tickets/[id]` manuel kontrolu | gecti | Ticket ozeti, cihaz ozeti, durum gecmisi ve `İç Not` etiketi yerinde goruldu |
| `/devices` manuel kontrolu | gecti | Header, filtreler, aktif/pasif cihaz ayrimi ve detay linkleri dogrulandi |
| `/devices/[id]` manuel kontrolu | gecti | Teknik bilgi bloklari, guvenli QR ozeti ve bakım listesi goruldu |
| `/devices/new` manuel kontrolu | gecti | Zorunlu alan karti, yardim metinleri ve geri dön aksiyonu goruldu |
| `/devices/[id]/edit` manuel kontrolu | gecti | Duzenleme formu, yardim metinleri ve detay sayfasina don linki goruldu |
| `/devices/[id]/qr` manuel kontrolu | gecti | QR karti, demo uyarisi ve yazdirma butonu goruldu |
| `/devices/qr/[token]` manuel kontrolu | gecti | Token route'u ilgili cihaz detayina yonlendi |
| 390x844 responsive kontrolu | gecti | `/tickets`, `/devices`, `/devices/[id]` ve `/devices/[id]/qr` ekranlarinda yatay tasma olusmadi |
| 768 genislik responsive kontrolu | gecti | Dashboard, ticket detay ve device edit ekranlarinda tasma olmadan okunabilir duzen korundu |
| Desktop responsive kontrolu | gecti | Dashboard, tickets, devices ve QR ekranlarinda kart ve bosluk hiyerarsisi tutarli kaldi |

Not: Bu route ve responsive kontrolleri local Supabase'e bagli ayri bir web instance uzerinde manual browser dogrulamasi olarak yapilmistir.

## Android Handoff Cleanup Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| `/tickets/[id]` status secenekleri mevcut duruma gore daraliyor mu? | gecti | Local browser akisinda `#1001` icin `in_progress / waiting_user / cancelled`, `#1002` icin `waiting_user / resolved / cancelled`, `#1003` icin yalnizca `closed` secenegi goruldu |
| Atanmamis open ticket'ta status yardimi dogru mu? | gecti | `#1000` kaydinda yalnizca `cancelled` secenegi acildi ve `Once talebi bir teknik personele atayin...` yardim metni goruldu |
| Closed/cancelled ticket icin status formu kapanıyor mu? | gecti | Manual UI aksiyonlariyla `#1003` kaydi `closed`, `#1000` kaydi `cancelled` durumuna getirildi; her iki sayfada da select ve submit pasif hale geldi ve son-durum mesaji goruldu |
| Ticket işlem sirasi yardim metni gorunuyor mu? | gecti | Ticket detay ekranlarinda `Onerilen işlem sirasi: once talebi teknik personele atayin...` yardim metni goruldu |
| Device assigned user kavrami UI'da net mi? | gecti | `/devices/[id]`, `/devices/new` ve `/devices/[id]/edit` ekranlarinda `Cihazı Kullanan Personel` etiketi ve teknik atamadan ayri oldugunu belirten yardim metni goruldu |
| Device assigned user kavrami dokumantasyonda net mi? | gecti | `README.md`, `docs/DATABASE.md`, `docs/DEMO_DATA_SETUP.md` ve `docs/RLS_MATRIX.md` icinde `devices.assigned_user_id` ile `tickets.assigned_to` ayrimi dogrulandi |
| `docs/MVP_DEMO_SCENARIO.md` guncel mi? | gecti | Demo amaci, roller, veri uyarisi ve 15 adimli sunum akisi manuel olarak kontrol edildi |
| `docs/SCREENSHOT_PLAN.md` guncel mi? | gecti | `Onerilen Sunum Sirasi` bolumu ile screenshot kanitlari `docs/MVP_DEMO_SCENARIO.md` ile uyumlu bulundu |

## Gelecek Faz Dokumantasyon Kontrolu

| Test | Sonuc | Neden |
| --- | --- | --- |
| Gelecek fazlar tamamlanmis ozellik gibi yazilmadi mi? | gecti | `README.md`, `docs/MVP_DEMO_SCENARIO.md` ve `docs/FUTURE_PHASES.md` icinde bu basliklar acikca `gelecek faz` ve `mevcut MVP'nin parcasi degil` olarak konumlandi |
| Akilli çözüm onerisi akisi icin ilk surum yaklasimi net mi? | gecti | Ilk surumun ML zorunlulugu olmadan, onayli çözüm kutuphanesi, kategori ve anahtar kelime eslestirmesiyle baslayacagi yazildi |
| Karar destek paneli icin hedef gostergeler net mi? | gecti | Departman, cihaz, kategori, çözüm suresi, bakım ve ticket-acilmadan-cozulen sorun metrikleri gelecekteki analiz ekranlari olarak listelendi |

## Erisilebilir Sade Tasarim Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| Genel tasarim dili sade ve kurumsal gorunuyor mu? | gecti | Açık arka plan, beyaz kart, sakin mavi vurgu ve daha ferah bosluklar ortak bileşenlere uygulandi |
| Form alanlari ve butonlar buyutuldu mu? | gecti | Login, filtre, talep islemleri ve cihaz formlarinda yukseklik ve ic bosluklar arttirildi |
| Login/access/auth-error metinleri sade mi? | gecti | Ekran basliklari ve aciklamalar daha guven verici ve daha az teknik hale getirildi |
| Dashboard ve liste metinleri daha yaln Turkce mi? | gecti | Dashboard aksiyonlari, talep ve cihaz liste basliklari daha sade Turkce ile güncellendi |
| Durum bilgileri yalnizca renkle anlatilmiyor mu? | gecti | Sayaç kartlarinda renk noktasinin yerine metin etiketleri kullanildi; badge metinleri korunmaya devam etti |
| Browser ile manuel route ve responsive tekrar testi | test edilemedi | Bu izin profilinde in-app browser otomasyonu `node_repl` kernel erisim hatasi nedeniyle yeniden baglanamadi; yerine `http://127.0.0.1:3000` route cevaplari shell uzerinden kontrol edildi |
| Shell uzerinden route cevap kontrolu | gecti | `/login` 200 dondu; `/access-denied`, `/dashboard`, `/tickets` ve `/devices` anonim oturumda 307 yonlendirme verdi |

## Ikinci Gorsel Polish Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| Fazla beyaz ve duz gorunum azaltildi mi? | gecti | `globals.css`, shell, header ve ana kartlarda acik mavi-gri section tonlari, yumusak gradientler ve daha belirgin katman ayrimlari uygulandi |
| Baslik ve govde metni hiyerarsisi netlesti mi? | gecti | Dashboard, talep, cihaz, login ve hata ekranlarinda header bantlari, kart baslik agirliklari ve yardimci metin tonlari dengelendi |
| Kart ve buton oranlari standartlasti mi? | gecti | Status/state kartlari ile form, detay ve aksiyon butonlari ortak yukseklik ve padding ailesine yaklastirildi |
| Ticket ve device ekranlarinda bolum ayrimi guclendi mi? | gecti | Filtre kartlari, liste kartlari, detay ozetleri, yorum/bakım alanlari ve QR preview ayri section tonlariyla ayrildi |
| 390px / 768px / desktop gorsel tekrar testi | test edilemedi | Bu turde in-app browser otomasyonu tekrar kullanilamadi; kullanici tarafinda manuel gorsel responsive kontrol onerilir |

## Android Auth Foundation Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| Android auth dependency ve BuildConfig uretilmesi | gecti | `secrets.defaults.properties`, version catalog, BuildConfig alanlari ve Supabase Kotlin modulleri ile `gradlew.bat assembleDebug` basariyla tamamlandi |
| ANDROID-AUTH-01 eksik `secrets.properties` veya eksik config | test edilemedi | `apps/android/secrets.properties` dosyasi bulunmuyor ve ConfigError akisi kaynak kodda var; ancak emulator/fiziksel cihaz uzerinde ekran akisi calistirilamadi |
| ANDROID-AUTH-02 gecersiz e-posta/parola | test edilemedi | Login ekraninda Turkce hata akisleri yazildi; fakat bu izin profilinde adb/emulator erisimi olmadigi icin gercek runtime denemesi yapilamadi |
| ANDROID-AUTH-03 employee hesabi ile giris | test edilemedi | Employee role yonlendirmesi `EmployeeHomeScreen` olarak kodlandi; manuel cihaz testi yapilamadi |
| ANDROID-AUTH-04 technician hesabi ile giris | test edilemedi | Technician role yonlendirmesi `TechnicianHomeScreen` olarak kodlandi; manuel cihaz testi yapilamadi |
| ANDROID-AUTH-05 admin hesabi ile giris | test edilemedi | Admin role yonlendirmesi `AdminHomeScreen` olarak kodlandi; manuel cihaz testi yapilamadi |
| ANDROID-AUTH-06 pasif profile ile giris | test edilemedi | `is_active = false` icin `AccessDenied` akisi repository ve navigation katmaninda eklendi; cihaz uzerinde calistirilamadi |
| ANDROID-AUTH-07 profile satiri olmayan auth kullanicisi | test edilemedi | Profil yoksa `AuthError` route'u kodlandi; manuel runtime kaniti alinmadi |
| ANDROID-AUTH-08 logout | test edilemedi | Logout back stack temizleme akisi navigation katmaninda yazildi; adb/emulator olmadigi icin kullanici akisi denenemedi |
| ANDROID-AUTH-09 logout sonrasi geri tusu | test edilemedi | Login'e donuste `popUpTo(... inclusive = true)` kullanildi; fiziksel geri tusu davranisi cihazda test edilemedi |
| ANDROID-AUTH-10 uygulama yeniden acildiginda session ile dogru home | test edilemedi | `auth.awaitInitialization()` ve session restore akisi eklendi; ancak uygulama kapanip acma senaryosu cihaz/emulator yoklugu nedeniyle dogrulanamadi |
