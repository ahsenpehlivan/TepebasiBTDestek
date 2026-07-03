# DEVELOPMENT_RULES

## Kodlama Standartları

- Mevcut çalışan yapı bozulmadan küçük ve doğrulanabilir adımlarla ilerlenmelidir.
- Kod sade, okunabilir ve tekrar kullanıma uygun olmalıdır.
- Gereksiz bağımlılık eklenmemelidir.

## İsimlendirme Kuralları

- Dosya ve klasör adları mevcut teknoloji gelenekleriyle uyumlu olmalıdır.
- TypeScript tarafında anlamlı İngilizce kod isimleri tercih edilmelidir.
- Kullanıcıya görünen metinler Türkçe olmalıdır.
- Android package name `com.ahsen.tepebasibtdestek` olarak korunmalıdır.

## TypeScript Strict Yaklaşımı

- `strict` ayarı korunmalıdır.
- Tür tanımları mümkün olduğunca açık yazılmalıdır.
- Demo veri yapıları için ayrı tip dosyaları kullanılmalıdır.

## Kotlin Katman Yapısı

- `core`: ortak yardımcılar ve çapraz kesen ihtiyaçlar
- `data`: veri erişimi ve dış kaynak uyarlamaları
- `domain`: iş kuralları ve modelleme
- `feature`: ekran veya kullanım senaryosu odaklı özellikler
- `navigation`: uygulama içi yönlendirme yapısı
- `ui.theme`: tema, renk ve tipografi tanımları

## UI Bileşen Kuralları

- Web tarafında sayfa stilleri CSS Modules ile yazılmalıdır.
- CSS custom properties ortak tasarım değişkenleri için kullanılmalıdır.
- Inline style kullanılmamalıdır.
- Ağır bir UI kütüphanesi eklenmemelidir.
- Ekranlar erişilebilirlik ve yeterli kontrast gözetilerek hazırlanmalıdır.

## Hata ve Loading State Zorunluluğu

- Gerçek veri akışları eklendiğinde her kullanıcı işlemi için loading, empty ve error durumları tanımlanmalıdır.
- Demo aşamasında bile kullanıcıya işlemin prototip olduğu açıkça belirtilmelidir.

## Gizli Bilgi Yönetimi

- Secret key, service role key, parola ve gerçek bağlantı bilgileri Git'e eklenmemelidir.
- `.env` dosyaları commit edilmemelidir.
- Yalnızca gerçek değer içermeyen örnek ortam dosyaları paylaşılmalıdır.

## Örnek Veri Kullanımı

- Tüm örnek kullanıcı, cihaz ve talep kayıtları kurgusal olmalıdır.
- Gerçek kurum personeli, gerçek cihaz listesi veya gerçek seri numarası kullanılmamalıdır.

## Commit Mesajı Standardı

- `docs: repository dokümantasyonunu güncelle`
- `web: demo dashboard iskeletini ekle`
- `android: prototip açılış ekranını düzenle`

Kısa, kapsamı belirgin ve eylem odaklı commit mesajları tercih edilmelidir.

## Definition of Done

- İlgili dosyalar güncellendi veya oluşturuldu
- Kod derlenebilir veya doğrulanabilir durumda
- Lint veya build sonucu kontrol edildi
- Prototip sınırları korunuyor
- Gizli bilgi veya gerçek veri eklenmedi
- Dokümantasyon gerektiği yerde güncellendi
