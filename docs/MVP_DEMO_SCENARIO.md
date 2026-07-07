# MVP_DEMO_SCENARIO

## Demo Amaci

Bu demo akisi, Tepebasi BT Destek web MVP'sinin rol bazli erisim, ticket yasam dongusu, cihaz envanteri ve RLS guvenlik anlatimini tek parca bir sunumda gostermek icin hazirlanmistir.

## Kullanilan Roller

- `employee`
- `technician`
- `admin`

## Demo Veri Uyarisi

- Gercek kurum verisi kullanilmaz.
- Demo cihaz, demo ticket ve demo kullanici verileri kurgusaldir.
- Sunumda parola, secret, key, gercek e-posta, gercek seri numarasi, gercek IP veya gercek MAC gorunmemelidir.

## Gelecek Faz Notu

Bu demo senaryosu mevcut Web MVP'yi anlatir. Asagidaki fikirler mevcut demo akisinda tamamlanmis ozellik gibi sunulmamali; yalnizca sonraki fazlar icin yol haritasi olarak anilmalidir:

- Akilli Cozum Oneri Akisi
- Istatistiksel Karar Destek Paneli

Detay icin `docs/FUTURE_PHASES.md` dosyasina bakin.

## Sunum Akisi

### 1. Login

- Ne gosterilecek?
  Demo login ekrani ve teknik personel hesabiyla giris.
- Hangi ozelligi kanitliyor?
  SSR auth akisi ve korumali panel girisi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Kimlik dogrulama ve oturum yonetimi.

### 2. Dashboard

- Ne gosterilecek?
  Gercek count kartlari ve aktif oturum bilgisi.
- Hangi ozelligi kanitliyor?
  Dashboard'in dogrudan ticket ve device tablolarindan beslenmesi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Web yonetim paneli genel gorunum.

### 3. Ticket Listesi

- Ne gosterilecek?
  Ticket listesi ve filtreleme alanlari.
- Hangi ozelligi kanitliyor?
  Server-side sorgu, filtreleme ve role uygun erisim.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Ticket listeleme ve filtreleme.

### 4. Ticket Filtresi

- Ne gosterilecek?
  Durum veya kategori filtresi uygulanmis liste.
- Hangi ozelligi kanitliyor?
  URL parametreli filtreleme ve kullanilabilir liste akisi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Kullanici deneyimi ve veri daraltma.

### 5. Ticket Detay

- Ne gosterilecek?
  Ticket ozeti, cihaz ozeti, yorumlar ve durum gecmisi.
- Hangi ozelligi kanitliyor?
  Tek kayit uzerinde butunlesik is takibi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Ticket detay ekran tasarimi.

### 6. Talep Atama

- Ne gosterilecek?
  Ticket'in bir teknik personele atanmasi.
- Hangi ozelligi kanitliyor?
  `tickets.assigned_to` alaninin teknik sorumlu mantigi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Teknik operasyon ve gorevlendirme akisi.

### 7. Durum Degistirme

- Ne gosterilecek?
  Mevcut duruma gore daraltilmis status secenekleri.
- Hangi ozelligi kanitliyor?
  Frontend is akisi ile backend transition kurallarinin uyumu.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Is kurali ve ticket yasam dongusu.

### 8. Public Yorum

- Ne gosterilecek?
  Kullaniciya gorunebilen genel yorum.
- Hangi ozelligi kanitliyor?
  Ticket iletisim akisi ve yorum ekleme.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Kullanici bilgilendirme mekanizmasi.

### 9. Internal Teknik Not

- Ne gosterilecek?
  Teknik ekip icin gorunen `Ic Not` ornegi.
- Hangi ozelligi kanitliyor?
  Public/internal yorum ayrimi ve RLS farki.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Rol bazli veri gorunurlugu.

### 10. Device Listesi

- Ne gosterilecek?
  Device listesi, durum etiketleri ve kullanan personel bilgisi.
- Hangi ozelligi kanitliyor?
  Envanter ekraninin cihaz odakli takip mantigi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Cihaz envanteri yonetimi.

### 11. Device Detay

- Ne gosterilecek?
  Teknik bilgiler, kullanan personel, ilgili ticketlar ve bakim gecmisi.
- Hangi ozelligi kanitliyor?
  `devices.assigned_user_id` ile ticket teknik atamasinin farkli kavramlar oldugu.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Cihaz detay modeli ve veri iliskileri.

### 12. Device QR Preview

- Ne gosterilecek?
  Demo/prototip uyarisiyla QR preview ekrani.
- Hangi ozelligi kanitliyor?
  Guvenli QR payload yaklasimi ve protected route mantigi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  QR entegrasyonu icin hazirlik.

### 13. Maintenance Record

- Ne gosterilecek?
  Bakim gecmisi ve yeni kayit ekleme alani.
- Hangi ozelligi kanitliyor?
  Device odakli teknik islem takibi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Bakim ve servis gecmisi yonetimi.

### 14. Access Denied Ornegi

- Ne gosterilecek?
  Employee rolunde web panel erisim reddi.
- Hangi ozelligi kanitliyor?
  Role guard ve panel sinirlandirmasi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Yetkilendirme kurallari.

### 15. RLS ve Test Kaniti

- Ne gosterilecek?
  Test planindan secilen lint/build/RLS dogrulama kanitlari.
- Hangi ozelligi kanitliyor?
  MVP'nin sadece arayuz degil, veri guvenligi ve test kapsami ile tamamlandigi.
- Staj raporunda hangi baslik altinda anlatilabilir?
  Test ve dogrulama sureci.

## Staj Raporunda Gelecek Faz Olarak Anilabilecek Basliklar

- Akilli Cozum Oneri Akisi: Ilk surumde kural tabanli ve onayli cozum kutuphanesi ile baslayip ileride ML veya semantic search'e genisleyebilecek yardim katmani
- Istatistiksel Karar Destek Paneli: Ticket, cihaz ve bakim verilerinden yonetsel analiz ureten karar destek ekrani
