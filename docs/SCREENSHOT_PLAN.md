# SCREENSHOT PLAN

Bu plan, staj sunumu ve final teslimi için alınacak ekran görüntülerinin kapsamını tanımlar.

## Güvenlik Kuralı

- Gerçek kurum verisi, gerçek kişi bilgisi, gerçek seri numarası, parola, token, secret veya anahtar içeren ekran görüntüsü alınmamalıdır.
- Yalnızca demo kullanıcılar, demo ticket kayıtları ve demo cihaz verileri kullanılmalıdır.
- Login ekranında parola alanı doldurulmuş halde ekran görüntüsü alınmamalıdır.

## Web İçin Final Screenshot Listesi

| Sıra | Ekran | Önerilen Dosya Adı | Not |
| --- | --- | --- | --- |
| 1 | Login ekranı | `01-web-login.png` | Supabase auth giriş akışı |
| 2 | Dashboard | `02-web-dashboard.png` | Genel özet ve sayaç kartları |
| 3 | Talepler listesi | `03-web-ticket-list.png` | Filtreleme ve liste görünümü |
| 4 | Talep detay ekranı | `04-web-ticket-detail.png` | Ticket özeti ve bağlı cihaz alanı |
| 5 | Talep yorum ve durum alanı | `05-web-ticket-comments-status.png` | Atama, durum değişikliği ve yorum akışı |
| 6 | Cihaz listesi | `06-web-device-list.png` | Envanter görünümü |
| 7 | Cihaz detay ekranı | `07-web-device-detail.png` | Teknik bilgiler ve zimmet özeti |
| 8 | Cihaz oluşturma veya düzenleme ekranı | `08-web-device-form.png` | Form yapısı ve validasyon |
| 9 | Bakım kayıtları bölümü | `09-web-maintenance.png` | Bakım geçmişi |
| 10 | QR preview ekranı | `10-web-qr-preview.png` | Güvenli QR önizleme |

## Android İçin Final Screenshot Listesi

| Sıra | Ekran | Önerilen Dosya Adı | Durum |
| --- | --- | --- | --- |
| 1 | Android login | `11-android-login.png` | Alınabilir, runtime doğrulandı |
| 2 | Employee home | `12-android-employee-home.png` | Alınabilir, runtime doğrulandı |
| 3 | Technician home | `13-android-technician-home.png` | Alınabilir, runtime doğrulandı |
| 4 | Admin home | `14-android-admin-home.png` | Alınabilir, runtime doğrulandı |
| 5 | Taleplerim ekranı | `15-android-my-tickets.png` | Henüz ekran görüntüsü alınmadı, temel yapı hazır |
| 6 | Talep detayı ekranı | `16-android-ticket-detail.png` | Henüz ekran görüntüsü alınmadı, temel yapı hazır |
| 7 | Yeni talep oluştur ekranı | `17-android-create-ticket.png` | Henüz ekran görüntüsü alınmadı, temel yapı hazır |
| 8 | Cihazlar ekranı | `18-android-device-list.png` | Henüz ekran görüntüsü alınmadı, temel yapı hazır |
| 9 | Cihaz detayı ekranı | `19-android-device-detail.png` | Henüz ekran görüntüsü alınmadı, temel yapı hazır |
| 10 | QR önizleme ekranı | `20-android-device-qr-preview.png` | Henüz ekran görüntüsü alınmadı, temel yapı hazır |

Android ticket ve device ekranları bu kapanış turunda canlı employee veya technician oturumuyla güvenilir biçimde açılamadığı için, bu ekranlar raporda dürüstçe `henüz ekran görüntüsü alınmadı` veya `temel yapı hazır` notuyla sunulmalıdır.

## Önerilen Sunum Sırası

| Sıra | Ekran |
| --- | --- |
| 1 | Web login |
| 2 | Web dashboard |
| 3 | Web talepler listesi |
| 4 | Web talep detay ve yorum/durum alanı |
| 5 | Web cihaz listesi |
| 6 | Web cihaz detay ve bakım alanı |
| 7 | Web QR preview |
| 8 | Android login |
| 9 | Android role-based home ekranları |
| 10 | Android tarafında temel olarak hazırlanan ticket ve device ekran açıklaması |
| 11 | Test sonuç ekranı |

## Final Teslim Kontrolü

- Ekran görüntülerinde Türkçe karakterlerin doğru göründüğü tekrar kontrol edilmelidir.
- Web tarafında gerçek tamamlanmış MVP akışı öncelikli olarak gösterilmelidir.
- Android tarafında yalnızca gerçekten runtime’da doğrulanan auth ekranları kesin kanıt olarak kullanılmalıdır.
- Android için henüz ekran görüntüsü alınmamış alanlar varsa, sunum veya raporda bunun temel yapı düzeyinde hazırlandığı açıkça belirtilmelidir.
- Görseller `docs/MVP_DEMO_SCENARIO.md` akışıyla uyumlu sırada seçilmelidir.
