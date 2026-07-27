# FUTURE_PHASES

Bu belge, mevcut MVP tesliminden sonra düşünülebilecek gelecek faz fikirlerini toplar.

Bu başlıklar:

- mevcut MVP'nin parçası değildir
- tamamlanmış özellik gibi sunulmamalıdır
- ayrı planlama, test ve güvenlik değerlendirmesi gerektirir

## 1. Akıllı Çözüm Öneri Akışı

### Amaç

Personel ticket açmadan önce yaşadığı sorunu yazar. Sistem, önceden onaylanmış güvenli çözüm adımlarını önerir.

Kullanıcı:

- `Denedim, sorun çözüldü` derse ticket açılmaz
- `Denedim, sorun devam ediyor` derse ticket açılır

### İlk Sürüm Yaklaşımı

İlk sürüm ML olmak zorunda değildir.

İlk sürüm şu yapı ile başlamalıdır:

- onaylı çözüm kütüphanesi
- kategori eşleştirme
- anahtar kelime eşleştirme
- kolay uygulanabilir çözüm adımları

### Güvenlik Notları

- öneriler technician veya admin tarafından onaylanmış olmalıdır
- riskli donanım müdahaleleri kullanıcıya önerilmemelidir
- kullanıcı cevabı loglanmalıdır
- sorun çözülmezse normal ticket akışı devam etmelidir

## 2. İstatistiksel Karar Destek Paneli

### Amaç

Technician ve admin kullanıcıları için ticket, cihaz ve bakım verilerinden özet analiz üretmektir.

### Örnek Göstergeler

- en çok ticket açılan departmanlar
- en sık arıza çıkaran cihaz türleri
- en sık ticket kategorileri
- ortalama çözüm süresi
- açık / bekleyen / çözülen ticket sayıları
- bakım kaydı yoğunluğu

### Beklenen Değer

- tekrar eden sorun alanları görünür olur
- önleyici bakım planları desteklenir
- cihaz yenileme kararları veriye dayalı hale gelir

## 3. Bilinçli Olarak Sonraya Bırakılan Teknik Alanlar

- QR tarama
- kamera entegrasyonu
- fotoğraf upload
- realtime
- push notification
- gelişmiş Android device CRUD

Bu başlıklar MVP teslimini büyütmemek ve mevcut çalışan yapıyı riske atmamak için sonraki fazlara bırakılmıştır.
