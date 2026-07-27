# MENTOR PRESENTATION

## Slayt 1 — Tepebaşı BT Destek

- Bu projeyi belediye içindeki teknik destek sürecini daha düzenli takip edebilmek için geliştirdim.
- Amaç, talep yönetimi ile cihaz envanterini aynı yapı içinde toplamak oldu.
- Web tarafında yönetim paneli, Android tarafında ise mobil temel hazırlandı.
- Proje MVP mantığıyla planlandı; yani önce çalışan ana akışlara odaklandım.

Ekran görüntüsü buraya gelecek.

## Slayt 2 — Problem

- Teknik destek talepleri dağınık ilerlediğinde takip zorlaşıyor.
- Hangi talebin kimde olduğu ve hangi aşamada bulunduğu net görünmeyebiliyor.
- Cihaz envanteri ayrı tutulduğunda talep ile cihaz ilişkisi kopabiliyor.
- Rol bazlı erişim de böyle yapılarda ayrıca önemli hale geliyor.

Ekran görüntüsü buraya gelecek.

## Slayt 3 — Çözüm

- Bu ihtiyaç için rol bazlı bir web paneli hazırladım.
- Web tarafında ticket ve cihaz yönetimini aynı yapıda topladım.
- Android tarafında da aynı veri modelini kullanan mobil temel akışları kurdum.
- Böylece proje hem masaüstü kullanımına hem de mobil devamına açık hale geldi.

Ekran görüntüsü buraya gelecek.

## Slayt 4 — Kullanılan Teknolojiler

- Web tarafında Next.js ve TypeScript kullandım.
- Android tarafında Kotlin ve Jetpack Compose kullandım.
- Veri, kimlik doğrulama ve güvenlik için Supabase tercih ettim.
- Yetki kontrolünde Row Level Security yapısını temel aldım.

Ekran görüntüsü buraya gelecek.

## Slayt 5 — Web Panel Özellikleri

- Giriş, çıkış ve rol bazlı erişim kontrolü var.
- Dashboard üzerinde genel özet ve sayaç kartları bulunuyor.
- Talep listesi ve talep detay ekranları hazır durumda.
- Cihaz listesi, cihaz detay ve bakım alanı da web tarafında çalışıyor.

Ekran görüntüsü buraya gelecek.

## Slayt 6 — Ticket / Talep Yönetimi Akışı

- Personel tarafından oluşturulan talepler listelenebiliyor.
- Talep detayında durum, atama ve yorum geçmişi görülebiliyor.
- Teknik personel veya yönetici gerekli durum değişikliklerini yapabiliyor.
- Public yorum ve internal not ayrımıyla daha kontrollü bir akış sağlandı.

Ekran görüntüsü buraya gelecek.

## Slayt 7 — Cihaz Envanteri ve QR Yaklaşımı

- Cihazlar için envanter listesi ve detay ekranı oluşturdum.
- Cihaza ait bakım kayıtları aynı ekranda takip edilebiliyor.
- QR tarafında doğrudan hassas veri yerine güvenli bir önizleme yaklaşımı kullandım.
- Böylece hem cihaz takibi hem de güvenlik tarafı birlikte korunmuş oldu.

Ekran görüntüsü buraya gelecek.

## Slayt 8 — Android Uygulama Kapsamı

- Android tarafında önce kimlik doğrulama omurgasını ve rol bazlı home ekranlarını kurdum.
- Employee, technician ve admin için ayrı başlangıç ekranları hazırladım.
- Ticket ve device modülleri için temel ekran altyapılarını ekledim.
- Bu modüller proje içinde hazır; canlı demo tarafında ise önce doğrulanan ana ekranları öne çıkarmayı tercih ettim.

Ekran görüntüsü buraya gelecek.

## Slayt 9 — Güvenlik: Supabase Auth + RLS

- Kullanıcı doğrulamasını Supabase Auth ile yönettim.
- Veri erişiminde ana güvenlik katmanı olarak RLS kullandım.
- İstemci tarafına service role gibi yüksek yetkili anahtarlar vermedim.
- Rol bilgisi ve erişim sınırları veritabanı kurallarıyla korunuyor.

Ekran görüntüsü buraya gelecek.

## Slayt 10 — Sonuç ve Sonraki Geliştirmeler

- Web MVP tarafı staj tesliminde anlatılabilir bir seviyeye geldi.
- Android tarafında güçlü bir temel kuruldu ve sonraki fazlara hazır hale geldi.
- Sonraki adım olarak mobil ekranların canlı doğrulamasını artırmak uygun olur.
- İleride karar destek, akıllı çözüm önerisi ve daha geniş mobil akışlar eklenebilir.

Ekran görüntüsü buraya gelecek.
