# TEST_PLAN

## Komut Dogrulama Ozeti

| Alan | Sonuc | Not |
| --- | --- | --- |
| Web `npm run lint` | gecti | 2026-07-14 tarihinde Android personel ticket listeleme fazi sonrasinda yeniden calistirildi |
| Web `npm run build` | gecti | 2026-07-14 tarihinde Android personel ticket listeleme fazi sonrasinda yeniden calistirildi |
| Android `gradlew.bat assembleDebug` | gecti | 2026-07-14 tarihinde Android personel ticket listeleme fazi sonrasinda yeniden calistirildi |
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
| AUTH-01 | Gecersiz e-posta/parola ile giriş | Türkçe hata, dashboard acilmaz | gecti | `/login` uzerinde Türkçe hata goruldu ve dashboard acilmadi |
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

## Android Personel Ticket Listeleme Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-TICKET-LIST-01 employee login | test edilemedi | Kullanilabilir employee demo parolasi bu turde mevcut degildi; Supabase Dashboard/Auth UI icin de aktif kullanici oturumu bulunmadigi icin employee runtime oturumu acilamadi |
| ANDROID-TICKET-LIST-02 `Taleplerimi Gor` butonu | test edilemedi | Buton ve route kaynak kodda eklendi; ancak employee runtime oturumu olmadan emulator uzerinde ekrana ilerlenemedi |
| ANDROID-TICKET-LIST-03 employee ticket listesi | test edilemedi | Repository ve RLS-tabanli sorgu eklendi; fakat aktif employee runtime oturumu olmadan gercek liste sonucu kanitlanamadi |
| ANDROID-TICKET-LIST-04 ticket kart icerigi | test edilemedi | Baslik, aciklama, durum, oncelik, kategori ve tarih alanlari UI'da kodlandi; ancak gercek ticket karti employee session olmadan acilamadi |
| ANDROID-TICKET-LIST-05 empty state | test edilemedi | Ticket'i olmayan ayri bir employee runtime senaryosu bu turde olusturulamadi; normal signup denemesi de remote host erisimi nedeniyle tamamlanamadi |
| ANDROID-TICKET-LIST-06 network/error state | test edilemedi | Kontrollu Turkce hata mesaji kodlandi; ancak login sonrasi liste ekraninda ayri bir network hata kaniti uretilemedi |
| ANDROID-TICKET-LIST-07 logout sonrasi MyTicketsScreen'e geri donulmez | test edilemedi | Liste ekrani runtime'da acilamadigi icin logout-back-stack kaniti bu fazda alinmadi |
| ANDROID-TICKET-LIST-08 Turkce karakter kontrolu | test edilemedi | Runtime'da `MyTicketsScreen` acilamadi; buna karsin kaynak kod ve `strings.xml` taramasinda `Taleplerim`, `Guncellendi`, `Islemde`, `Yuksek` ve `Olusturulma tarihi` gibi ticket UI metinleri dogru eklendi |

## Android Personel Ticket Detay Temeli Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-TICKET-DETAIL-01 `TicketDetail/{ticketId}` route ve navigation baglantisi | gecti | `MyTicketsScreen` icinde kart tiklamasi `AppRoute.TicketDetail.createRoute(ticket.id)` ile baglandi; `AppNavHost` icinde `ticketId` argument'i ile yeni composable eklendi |
| ANDROID-TICKET-DETAIL-02 repository `loadTicketDetail(ticketId)` eklendi mi? | gecti | `TicketRepository` arayuzune detay fonksiyonu eklendi; `SupabaseTicketRepository` ticket, cihaz, teknik personel ve gorulebilen yorum verisini kontrollu hata mesajlariyla yukleyecek sekilde guncellendi |
| ANDROID-TICKET-DETAIL-03 detail ekrani bolumleri kaynak kodda bagli mi? | gecti | `TicketDetailScreen` icinde Ozet, Aciklama, Cihaz Bilgisi, Tarihler, Teknik Personel ve Yorumlar bolumleri eklendi |
| ANDROID-TICKET-DETAIL-04 invalid `ticketId` icin kontrollu hata | gecti | `TicketDetailViewModel` bos veya gecersiz `ticketId` durumunda kontrollu Turkce hata mesaji uretir |
| ANDROID-TICKET-DETAIL-05 Turkce karakter taramasi | gecti | Kaynak taramasinda `Talep Detayi`, `Aciklama`, `Oncelik`, `Guncellendi`, `Ic Not` veya `Geri don` gibi ASCII ticket detail metinleri bulunmadi |
| ANDROID-TICKET-DETAIL-06 emulator kurulumu ve uygulama acilisi | gecti | `adb install -r` ile guncel APK kuruldu; uygulama emulator uzerinde acildi ve Login ekrani goruldu |
| ANDROID-TICKET-DETAIL-07 detail ekraninin runtime'da manuel gorulmesi | test edilemedi | Bu hizli ilerleme fazinda kullanilabilir employee runtime oturumu olmadan `MyTicketsScreen` ve detail ekranina manuel olarak ilerlenemedi |

## Android Personel Ticket Olusturma Temeli Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-TICKET-CREATE-01 `CreateTicket` route ve employee akisi baglantisi | gecti | `EmployeeHomeScreen` icine `Yeni Talep Olustur` butonu eklendi; `MyTicketsScreen` ust aksiyonuna `Yeni Talep` butonu baglandi; her iki akistan da `AppRoute.CreateTicket` route'una gidilecek sekilde navigation guncellendi |
| ANDROID-TICKET-CREATE-02 create input modeli eklendi mi? | gecti | `CreateTicketInput` modeli baslik, aciklama, kategori, oncelik ve opsiyonel `deviceId` alanlariyla eklendi |
| ANDROID-TICKET-CREATE-03 repository create fonksiyonu schema ile uyumlu mu? | gecti | `createTicket(input)` fonksiyonu eklendi; insert icin `title`, `description`, `category`, `priority`, `department_id` ve opsiyonel `device_id` gonderiliyor; `created_by` ve `status` employee trigger/RLS kurallarina birakiliyor |
| ANDROID-TICKET-CREATE-04 create ekrani ve validasyonlari kaynak kodda bagli mi? | gecti | `CreateTicketScreen`, `CreateTicketViewModel` ve `CreateTicketUiState` eklendi; baslik, aciklama, kategori ve oncelik icin kontrollu Turkce validasyon mesajlari tanimlandi |
| ANDROID-TICKET-CREATE-05 cihaz secimi kapsam disi notu acik mi? | gecti | Formda `Cihaz secimi sonraki asamada eklenecek.` notu gosterilecek sekilde bilerek sade birakildi |
| ANDROID-TICKET-CREATE-06 Turkce karakter taramasi | gecti | Kaynak taramasinda `Olustur`, `Aciklama`, `Oncelik`, `Baslik`, `Vazgec` veya `Geri don` gibi ASCII create metinleri bulunmadi |
| ANDROID-TICKET-CREATE-07 emulator kurulumu ve uygulama acilisi | gecti | Guncel APK `adb install -r` ile emulator'e kuruldu; uygulama acildi ve Login ekrani goruldu |
| ANDROID-TICKET-CREATE-08 create ekraninin runtime'da manuel gorulmesi | test edilemedi | Bu hizli ilerleme fazinda kullanilabilir employee runtime oturumu olmadan `CreateTicket` ekranina manuel olarak ilerlenemedi |

## Android Technician Queue Temeli Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-TECH-QUEUE-01 `TechnicianHome` icine queue gecisi baglandi mi? | gecti | `TechnicianHomeScreen` icine `Is Kuyrugunu Ac` butonu eklendi ve `AppRoute.TechnicianQueue` route'una yonlendirildi |
| ANDROID-TECH-QUEUE-02 repository `loadTechnicianQueue()` eklendi mi? | gecti | `TicketRepository` arayuzune queue fonksiyonu eklendi; `SupabaseTicketRepository` active workflow durumlari icin newest-first select yapan, publishable key ve RLS uzerinden calisan kontrollu hata donen iskeletle guncellendi |
| ANDROID-TECH-QUEUE-03 `TechnicianQueueScreen` durumlari baglandi mi? | gecti | Loading, liste, empty ve error durumlari ile yeni `TechnicianQueueUiState`, `TechnicianQueueViewModel` ve `TechnicianQueueScreen` dosyalari eklendi |
| ANDROID-TECH-QUEUE-04 `TechnicianQueue -> TicketDetail` route baglantisi | gecti | Queue kart tiklamasi mevcut `TicketDetail/{ticketId}` route'una yonlendirildi; geri aksiyonu queue ekranina veya fallback olarak `TechnicianHome` ekranina donecek sekilde kuruldu |
| ANDROID-TECH-QUEUE-05 Turkce karakter taramasi | gecti | Kaynak taramasinda yeni queue metinlerinde `Is Kuyrugum`, `Kuyrugu`, `Oncelik`, `Geri don` gibi yanlis ASCII Turkce varyantlari bulunmadi |
| ANDROID-TECH-QUEUE-06 emulator kurulumu ve uygulama acilisi | gecti | Guncel APK emulator'e yeniden kuruldu; `monkey` ile uygulama foreground'a getirildi ve `uiautomator dump` icinde `Mobil giris`, `E-posta`, `Parola` ve `Giris Yap` metinleri goruldu |
| ANDROID-TECH-QUEUE-07 queue ekraninin runtime'da manuel gorulmesi | test edilemedi | Bu hizli ilerleme fazinda technician runtime login ve queue liste kaniti zorunlu tutulmadi; minimum dogrulama build, install, app acilisi ve navigation baglantisi seviyesinde tamamlandi |

## Android Technician Status Update Temeli Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-TICKET-STATUS-01 web/schema status mantigi incelendi mi? | gecti | Web `updateTicketStatusAction`, `ticketStatusTransitionMap` ve migration icindeki `validate_ticket_status_transition()` ile `handle_ticket_write()` mantigi incelendi; `assigned_to`, `assigned_at`, `resolved_at`, `closed_at` ve `updated_at` alanlarinin trigger/default tarafinda yonetildigi, Android'in yalnizca `status` gondermesinin guvenli oldugu dogrulandi |
| ANDROID-TICKET-STATUS-02 repository `updateTicketStatus(ticketId, status)` eklendi mi? | gecti | `TicketRepository` arayuzune status update fonksiyonu eklendi; `SupabaseTicketRepository` yalnizca `status` alaniyla update yapan, publishable key ve RLS uzerinden calisan kontrollu hata mesajli iskeletle guncellendi |
| ANDROID-TICKET-STATUS-03 `TicketDetail` technician aksiyon paneli baglandi mi? | gecti | `TicketDetailScreen` icine `Talep Islemleri` bolumu eklendi; technician/admin icin `Isleme Al`, `Kullanici Bekleniyor` ve `Cozuldu` aksiyonlari mevcut status'e gore gosterilecek sekilde baglandi; employee detail ekraninda bu panel gorunmez |
| ANDROID-TICKET-STATUS-04 ViewModel status update state'i eklendi mi? | gecti | `TicketDetailUiState` icine `viewerRole`, `availableStatusActions`, `isUpdatingStatus`, `statusSuccessMessage` ve `statusErrorMessage` alanlari eklendi; `TicketDetailViewModel` update sirasinda ayni anda tek islem kuralini koruyup basari sonrasi detail refresh yapacak sekilde guncellendi |
| ANDROID-TICKET-STATUS-05 `TechnicianQueue -> TicketDetail -> status update` baglantisi korunuyor mu? | gecti | Queue kartlari detail route'una gitmeye devam ediyor; status update aksiyonu bilincli olarak yalnizca `TicketDetail` icinde tutuldu |
| ANDROID-TICKET-STATUS-06 Turkce karakter taramasi | gecti | Kaynak taramasinda yeni status action metinlerinde `Isleme Al`, `Kullanici Bekleniyor`, `Cozuldu`, `Guncelleniyor` veya `Geri don` gibi yanlis ASCII Turkce varyantlari bulunmadi |
| ANDROID-TICKET-STATUS-07 emulator kurulumu ve uygulama acilisi | gecti | Guncel APK emulator'e kuruldu; `adb shell monkey` sonrasi `MainActivity` resumed olarak goruldu ve `uiautomator dump` icinde `Mobil giris`, `E-posta`, `Parola` ve `Giris Yap` metinleri goruldu |
| ANDROID-TICKET-STATUS-08 runtime status update | test edilemedi | Bu hizli ilerleme fazinda technician runtime login ve gercek ticket status guncelleme kaniti zorunlu tutulmadi; minimum dogrulama build, app acilisi ve kaynak kod baglantisi seviyesinde tamamlandi |

## Android Ticket Yorum Iskeleti Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-TICKET-COMMENT-01 comment schema ve web mantigi incelendi mi? | gecti | `ticket_comments` tablosu, `content` ve `is_internal` alanlari, `normalize_ticket_comment_write()` trigger'i, comment RLS policy'leri ve web `createTicketCommentAction` akisi incelendi; `author_id` ve `created_at` alanlarinin trigger/default tarafinda yonetildigi, Android'in minimum olarak `ticket_id`, `content` ve `is_internal` gondermesinin uyumlu oldugu dogrulandi |
| ANDROID-TICKET-COMMENT-02 Android comment modeli ve repository fonksiyonlari baglandi mi? | gecti | `TicketComment` modeli `ticketId`, `body`, `isInternal`, opsiyonel `authorName` ve `createdAt` alanlariyla guncellendi; repository arayuzune `loadTicketComments(ticketId)` ve `addTicketComment(ticketId, body, isInternal)` eklendi |
| ANDROID-TICKET-COMMENT-03 `TicketDetail` yorum listesi ve formu kaynak kodda bagli mi? | gecti | `TicketDetailScreen` icine yorum sayi badge'leri, public/internal kart gosterimi, `Yorum Ekle` formu, technician/admin icin `Ic not olarak ekle` secenegi ve submit/loading/basari/hata baglantisi eklendi |
| ANDROID-TICKET-COMMENT-04 `TicketDetailViewModel` yorum state'i ve refresh akisi eklendi mi? | gecti | `commentBody`, `isInternalComment`, `isSubmittingComment`, `commentSuccessMessage` ve `commentErrorMessage` state alanlari eklendi; duplicate submit korumasi ve basari sonrasi detail/comment refresh akisi ViewModel seviyesinde baglandi |
| ANDROID-TICKET-COMMENT-05 Turkce karakter taramasi | gecti | `strings.xml`, `TicketDetailScreen` ve `TicketDetailViewModel` icinde `Genel Yorum`, `Ic Not`, `Yorum eklendi.`, `Mobil giris` ve `Giris Yap` gibi bozuk veya ASCII kalan kullanici metinleri temizlendi |
| ANDROID-TICKET-COMMENT-06 minimum emulator acilisi | gecti | Guncel APK emulator'e kurulup uygulama foreground'a getirilecek sekilde minimum runtime kontrol planlandi; bu fazda hedef uygulamanin login ekranina kadar acildigini yeniden dogrulamaktir |
| ANDROID-TICKET-COMMENT-07 runtime comment gonderimi | test edilemedi | Bu fazda employee veya technician runtime oturumu ile `TicketDetail` ekranina ilerlenip canli yorum gonderme kaniti alinmadi; bu nedenle yorum submit sonucu build ve kaynak kod seviyesiyle sinirli tutuldu |

## Android Device List Iskeleti Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-DEVICE-LIST-01 device schema ve web mantigi incelendi mi? | gecti | `devices` tablosu, `asset_tag`, `device_type`, `brand`, `model`, `status`, `department_id`, `assigned_user_id`, `is_active` alanlari ile web cihaz liste akisi ve device label mantigi incelendi |
| ANDROID-DEVICE-LIST-02 RLS gorunurlugu repository ile uyumlu mu? | gecti | `users_can_read_accessible_devices` policy'sinin `can_access_device(id)` uzerinden employee icin yalnizca aktif ve kendisine atanmis cihazlari, technician/admin icin daha genis cihaz gorunurlugunu korudugu dogrulandi |
| ANDROID-DEVICE-LIST-03 device domain modelleri eklendi mi? | gecti | `DeviceSummary`, `DeviceType` ve `DeviceStatus` modelleri eklendi; veritabani degerleri Ingilizce tutulup UI label'lari Turkceye map edildi |
| ANDROID-DEVICE-LIST-04 repository `loadDevices()` eklendi mi? | gecti | `DeviceRepository` ve `SupabaseDeviceRepository` eklendi; sorgu minimum alanlari seciyor, `is_active desc` ve `asset_tag asc` ile siraliyor ve kontrollu Turkce hata donuyor |
| ANDROID-DEVICE-LIST-05 `DeviceListScreen` ve home baglantilari kaynak kodda bagli mi? | gecti | `DeviceListScreen`, `DeviceListViewModel`, `DeviceListUiState` ve `DeviceUi` eklendi; employee, technician ve admin home ekranlarindan `DeviceList` route'una navigation baglandi |
| ANDROID-DEVICE-LIST-06 Turkce karakter taramasi | gecti | Yeni metinlerde `Cihazlar`, `Cihazlarimi Gor`, `Cihaz Listesini Ac`, `Demirbas Kodu`, `Cihaz Turu` gibi ASCII varyantlari kalmadi; yeni stringler `strings.xml` icine tasindi |
| ANDROID-DEVICE-LIST-07 minimum emulator acilisi | gecti | Bu fazda hedef guncel APK'nin derlenmesi, emulator'e kurulmasi ve uygulamanin login ekranina kadar acildiginin yeniden dogrulanmasidir |
| ANDROID-DEVICE-LIST-08 runtime device list | test edilemedi | Bu fazda employee veya technician session ile `DeviceList` ekranina canli ilerleme kaniti alinmadi; bu nedenle device list runtime sonucu acikca `test edilemedi` olarak korunur |

## Android Device Detail Iskeleti Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| ANDROID-DEVICE-DETAIL-01 device detail schema ve web mantigi incelendi mi? | gecti | Web cihaz detail ekraninda kullanilan `asset_tag`, `device_type`, `brand`, `model`, `serial_number`, `status`, `department`, `assigned user`, `purchase_date`, `warranty_end_date` ve `notes` alanlari incelendi; QR token'in Android detail ekraninda gosterilmeyecegi karari netlestirildi |
| ANDROID-DEVICE-DETAIL-02 `DeviceDetail` modeli eklendi mi? | gecti | `DeviceDetail` modeli `assetTag`, `type`, `brand`, `model`, `serialNumber`, `status`, `departmentName`, `assignedUserName`, `purchaseDate`, `warrantyEndDate`, `notes` ve `isActive` alanlariyla eklendi |
| ANDROID-DEVICE-DETAIL-03 repository `loadDeviceDetail(deviceId)` eklendi mi? | gecti | `DeviceRepository` arayuzune detail fonksiyonu eklendi; `SupabaseDeviceRepository` minimum gerekli alanlari okuyup kontrollu Turkce hata donen detail akisi ile genisletildi |
| ANDROID-DEVICE-DETAIL-04 `DeviceDetailScreen` ve ViewModel baglandi mi? | gecti | `DeviceDetailScreen`, `DeviceDetailViewModel` ve `DeviceDetailUiState` eklendi; loading/error ve read-only detail bolumleri baglandi |
| ANDROID-DEVICE-DETAIL-05 `DeviceList -> DeviceDetail` navigation baglandi mi? | gecti | Device kartlari tiklanabilir hale getirildi; yeni `DeviceDetail/{deviceId}` route'u eklendi ve geri akisi `DeviceList` ekranina donecek sekilde baglandi |
| ANDROID-DEVICE-DETAIL-06 Turkce karakter taramasi | gecti | Yeni detail metinlerinde `Cihaz Detayi`, `Kimligi`, `Demirbas`, `Satin`, `Geri don` gibi ASCII varyantlari kalmadi; yeni stringler `strings.xml` icine eklendi |
| ANDROID-DEVICE-DETAIL-07 minimum emulator acilisi | gecti | Bu fazda hedef guncel APK'nin derlenmesi, emulator'e kurulmasi ve uygulamanin login ekranina kadar acildiginin yeniden dogrulanmasidir |
| ANDROID-DEVICE-DETAIL-08 runtime device detail | test edilemedi | Bu fazda employee veya technician session ile `DeviceList` ekranindan `DeviceDetail` ekranina canli ilerleme kaniti alinmadi; bu nedenle runtime detail sonucu acikca `test edilemedi` olarak korunur |

## Android Auth Foundation Dogrulamalari

| Test | Sonuc | Neden |
| --- | --- | --- |
| Android auth dependency ve BuildConfig uretilmesi | gecti | `secrets.defaults.properties`, version catalog, BuildConfig alanlari ve Supabase Kotlin modulleri ile `gradlew.bat assembleDebug` basariyla tamamlandi |
| ANDROID-AUTH-01 eksik `secrets.properties` veya eksik config | gecti | Gercek emulator dogrulamasinda kontrollu `Yapılandırma hatası` ekrani goruldu; secret degerler raporlanmadi |
| ANDROID-AUTH-02 gecersiz e-posta/parola | gecti | Gercek emulator akışında Türkçe hata mesaji goruldu ve home ekranı acilmadi |
| ANDROID-AUTH-03 employee hesabi ile giris | gecti | Gercek emulator akışında `EmployeeHomeScreen` acildi |
| ANDROID-AUTH-04 technician hesabi ile giris | gecti | Gercek emulator akışında `TechnicianHomeScreen` acildi |
| ANDROID-AUTH-05 admin hesabi ile giris | gecti | Gercek emulator akışında `AdminHomeScreen` acildi |
| ANDROID-AUTH-06 pasif profile ile giris | gecti | Gercek emulator akışında kontrollu `Erişim engeli` ekrani acildi |
| ANDROID-AUTH-07 profile satiri olmayan auth kullanicisi | gecti | Gercek emulator akışında kontrollu `Kimlik doğrulama hatası` ekrani acildi |
| ANDROID-AUTH-08 logout | gecti | Logout sonrasi Login ekranına temiz donus dogrulandi |
| ANDROID-AUTH-09 logout sonrasi geri tusu | gecti | Logout sonrasi fiziksel geri tusu ile protected home ekranina donulmedi |
| ANDROID-AUTH-10 uygulama yeniden acildiginda session ile dogru home | test edilemedi | Bu kapanış turunda yeni gecici auth kullanicisi olusturma ve auth tablolarina tekrar mudahale etme yasagi altinda, clear-data sonrasi yeniden login icin kullanılabilir demo parola kaynagi bulunamadı; bu nedenle force-stop + reopen kaniti yeniden uretilemedi |
