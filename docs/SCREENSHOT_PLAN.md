# SCREENSHOT_PLAN

Bu plan, staj sunumu ve staj raporu icin alinacak ekran goruntulerinin kapsamini tanimlar.

## Guvenlik Kurali

- Gercek kurum verisi, gercek kisi bilgisi, gercek seri numarasi, gercek IP, gercek MAC, parola, token veya secret iceren ekran goruntusu alinmamalidir.
- Yalnizca demo kullanicilar, demo ticket kayitlari ve demo cihaz verileri kullanilmalidir.
- Login ekraninda parola alani doldurulmus halde ekran goruntusu alinmamalidir.

## Onerilen Ekranlar

| Ekran | Onerilen Dosya Adi | Rapor Bolumu | Kanitladigi Ozellik |
| --- | --- | --- | --- |
| Dashboard genel gorunumu | `01-dashboard-overview.png` | Web yonetim paneli | Role guard sonrasi gercek count kartlari ve panel girisi |
| Login ekrani | `02-login-screen.png` | Kimlik dogrulama | SSR login giris formu ve demo kullanim siniri |
| Access denied ekrani | `03-access-denied.png` | Yetkilendirme | Employee hesabinin web panelden engellenmesi |
| Ticket listesi filtreli gorunum | `04-ticket-list-filtered.png` | Ticket yonetimi | Server-side filtreleme ve responsive liste/kart yapisi |
| Ticket detay ve ic not | `05-ticket-detail-internal-comment.png` | Ticket detay akisi | Public/internal comment ayrimi ve durum gecmisi |
| Device listesi filtreli gorunum | `06-device-list-filtered.png` | Cihaz envanteri | Device filtreleri, durum etiketleri ve aktif/pasif ayrimi |
| Device detay ekrani | `07-device-detail.png` | Cihaz detay akisi | Teknik bilgiler, guvenli QR ozeti ve bakim gecmisi |
| Device duzenleme formu | `08-device-edit-form.png` | Cihaz form akislari | Zorunlu alanlar, yardim metinleri ve form tutarliligi |
| QR preview ekrani | `09-device-qr-preview.png` | QR akisi | Sunuma uygun QR gorunumu ve demo uyari metni |
| Maintenance record bolumu | `10-device-maintenance.png` | Bakim kayitlari | Bakim gecmisi ve kayit ekleme alani |
| Test veya smoke test kaniti | `11-test-results.png` | Dogrulama ve testler | Lint, build, smoke test veya route dogrulama ciktilari |

## Android Ekranlari

| Ekran | Onerilen Dosya Adi | Rapor Bolumu | Kanitladigi Ozellik |
| --- | --- | --- | --- |
| Android login ekrani | `12-android-login.png` | Android auth | Supabase auth giriş formu ve demo uyarı metni |
| Android employee home | `13-android-employee-home.png` | Android role yonlendirmesi | Employee rolu icin mobil başlangıç ekrani |
| Android technician home | `14-android-technician-home.png` | Android role yonlendirmesi | Technician rolu icin mobil başlangıç ekrani |
| Android admin home | `15-android-admin-home.png` | Android role yonlendirmesi | Admin rolu icin mobil başlangıç ekrani |
| Android access denied | `16-android-access-denied.png` | Android auth hata akisi | Pasif profile kontrollu erişim engeli |
| Android auth error | `17-android-auth-error.png` | Android auth hata akisi | Profile satiri olmayan kullanicida kontrollu hata |
| Android config error | `18-android-config-error.png` | Android config guvenligi | Eksik secrets durumunda anlasılır hata |
| Android logout sonrasi login | `19-android-logout-login.png` | Android logout | Logout sonrasi login ekranina temiz dönüş |

## Onerilen Sunum Sirasi

| Sira | Onerilen Dosya Adi | Demo Adimi | Kanitladigi Ozellik |
| --- | --- | --- | --- |
| 1 | `02-login-screen.png` | Login | SSR auth giris ekrani |
| 2 | `01-dashboard-overview.png` | Dashboard | Gercek count kartlari ve panel girisi |
| 3 | `04-ticket-list-filtered.png` | Ticket listesi ve filtre | Server-side filtreleme |
| 4 | `05-ticket-detail-internal-comment.png` | Ticket detay, atama, durum ve internal not | Ticket yasam dongusu ve yorum ayrimi |
| 5 | `06-device-list-filtered.png` | Device listesi | Envanter filtreleme ve durum gorunumu |
| 6 | `07-device-detail.png` | Device detay | Cihazi kullanan personel ile teknik atama ayrimi |
| 7 | `08-device-edit-form.png` | Device duzenleme | Form ve zimmetli personel kavrami |
| 8 | `09-device-qr-preview.png` | QR preview | Guvenli QR yaklasimi |
| 9 | `10-device-maintenance.png` | Maintenance record | Bakim gecmisi ve cihaz takibi |
| 10 | `03-access-denied.png` | Access denied | Employee panel kisiti |
| 11 | `11-test-results.png` | RLS/test kaniti | Lint, build ve test dogrulamasi |

## Cekim Notlari

- Dashboard ve liste ekranlarinda bosluklarin, kart stillerinin ve Turkce metinlerin duzgun gorunmesi icin desktop genislikte cekim alin.
- Responsive kanit gerekiyorsa ayni ekran icin 390px ve tablet gorunumleri ayrica kaydedilebilir.
- QR preview ekraninda yazdirma butonu ve demo uyarisi birlikte gorunecek sekilde cekim alin.
- Test sonucu ekran goruntulerinde secret veya `.env.local` icerigi yer almamalidir.
- `docs/MVP_DEMO_SCENARIO.md` icindeki sira ile uyumlu kalin.

## Erisilebilir Tasarim Notu

- Ekran goruntulerinde buyuk butonlar, ferah form alanlari ve rahat okunur yazi boyutlari korunmalidir.
- Durum ve oncelik etiketleri sadece renk lekesi gibi kalmamali; metinleri de net secilmelidir.
- Login, access denied ve auth error ekranlari korkutucu veya asiri teknik gorunmemelidir.
- Dashboard, ticket ve device ekranlarinda fazla beyaz gorunum yerine yumusak section ayrimlari ve kart baslik hiyerarsisi gorunur olmalidir.
- Android ekran goruntulerinde de gercek Supabase URL, publishable key veya parola gosterilmemelidir.
