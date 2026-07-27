# TEST PLAN

## Final MVP Özeti

Bu belge, 27 Temmuz 2026 itibarıyla Web ve Android MVP kapsamının gerçek doğrulama durumunu özetler.

- Web MVP ana akışları gerçek veritabanı ve rol kısıtlarıyla doğrulandı.
- Supabase migration, seed ve smoke test zinciri daha önce başarıyla çalıştırıldı.
- Android auth akışı gerçek emülatör üzerinde doğrulandı.
- Android ticket ve device ekranlarının önemli bölümü build güvenli foundation seviyesindedir.
- Gerçek runtime kanıtı alınamayan Android ekranları açıkça `test edilemedi` olarak işaretlenmiştir.

## Komut Doğrulama Özeti

| Alan | Sonuç | Not |
| --- | --- | --- |
| Web `npm run lint` | geçti | 2026-07-27 tarihinde final MVP toparlama fazında yeniden çalıştırıldı |
| Web `npm run build` | geçti | 2026-07-27 tarihinde final MVP toparlama fazında yeniden çalıştırıldı |
| Android `gradlew.bat assembleDebug` | geçti | 2026-07-27 tarihinde final MVP toparlama fazında yeniden çalıştırıldı |
| `docker version` | geçti | Docker engine erişimi daha önce doğrulandı |
| `npx supabase --version` | geçti | Supabase CLI erişimi daha önce doğrulandı |
| `npx supabase db reset` | geçti | Mevcut migration zinciri ve seed daha önce başarıyla uygulandı |
| `apps/web/.env.local` Git takibi | geçti | Dosya Git tarafından izlenmiyor |

## Supabase ve Web Doğrulama Özeti

| Kontrol | Sonuç | Not |
| --- | --- | --- |
| Yerel migration zinciri | geçti | Bootstrap role fix migration dahil zincir tutarlı |
| Yerel seed sonucu | geçti | Departmanlar, demo cihazlar ve yardımcı veriler yüklendi |
| Schema smoke test | geçti | Smoke test düzeyinde şema varlığı doğrulandı |
| RLS smoke test | geçti | Smoke test düzeyinde RLS/policy varlığı doğrulandı |
| Remote profile ve role kontrolü | geçti | Demo employee, technician ve admin profilleri doğrulandı |
| Web login/logout akışı | geçti | Protected route, access denied ve logout yönlendirmeleri doğrulandı |
| Web ticket akışı | geçti | Liste, detay, durum, atama ve yorum akışı doğrulandı |
| Web device akışı | geçti | Liste, detay, create, edit, passive, maintenance ve QR preview doğrulandı |

## Android Auth Doğrulama Özeti

| Senaryo | Sonuç | Not |
| --- | --- | --- |
| Geçersiz giriş | geçti | Türkçe hata gösterildi |
| Employee login | geçti | `EmployeeHomeScreen` açıldı |
| Technician login | geçti | `TechnicianHomeScreen` açıldı |
| Admin login | geçti | `AdminHomeScreen` açıldı |
| Pasif profile | geçti | Kontrollü erişim engeli gösterildi |
| Profile satırı olmayan kullanıcı | geçti | Kontrollü auth hata ekranı gösterildi |
| Logout | geçti | Login ekranına temiz dönüş doğrulandı |
| Logout sonrası geri tuşu | geçti | Protected home ekranına dönülmedi |
| Session restore | test edilemedi | Bu kapanış turunda yeniden güvenilir runtime kanıtı alınamadı |

## Android Ticket Doğrulama Özeti

| Alan | Sonuç | Not |
| --- | --- | --- |
| `MyTicketsScreen` mimarisi ve navigation | geçti | Kod yapısı, route ve repository bağlantıları tamam |
| Ticket detail foundation | geçti | Read-only detail, yorumlar ve navigation bağlandı |
| Ticket create foundation | geçti | Form, validasyon ve repository insert iskeleti bağlandı |
| Technician queue foundation | geçti | Queue ekranı, liste state’leri ve detail geçişi bağlandı |
| Technician status update foundation | geçti | Detail içi aksiyon paneli ve update akışı bağlandı |
| Ticket comment foundation | geçti | Yorum listesi ve yorum ekleme formu bağlandı |
| Employee ticket runtime listesi | test edilemedi | Çalışan employee runtime oturumu ile canlı kanıt alınamadı |
| Employee ticket detail runtime | test edilemedi | Canlı ticket seçimiyle emülatör kanıtı alınamadı |
| Employee ticket create runtime | test edilemedi | Canlı insert akışı emülatörde doğrulanamadı |
| Technician queue runtime | test edilemedi | Technician session ile canlı liste kanıtı alınamadı |
| Technician status update runtime | test edilemedi | Canlı status değişikliği emülatörde doğrulanamadı |
| Ticket comment runtime | test edilemedi | Canlı yorum gönderimi kanıtı alınamadı |

## Android Device Doğrulama Özeti

| Alan | Sonuç | Not |
| --- | --- | --- |
| Device list foundation | geçti | Repository, ViewModel ve screen bağlandı |
| Device detail foundation | geçti | Read-only detail akışı bağlandı |
| Device maintenance foundation | geçti | Maintenance bölümü ve retry/empty state bağlandı |
| Device QR preview foundation | geçti | Güvenli QR payload önizlemesi bağlandı |
| Device list runtime | test edilemedi | Canlı employee/technician session ile ekran kanıtı alınamadı |
| Device detail runtime | test edilemedi | Canlı cihaz seçimiyle ekran doğrulanamadı |
| Device maintenance runtime | test edilemedi | Canlı maintenance listesi emülatörde doğrulanamadı |
| Device QR preview runtime | test edilemedi | Canlı preview ekranı emülatörde doğrulanamadı |

## Smoke Test Notu

`supabase/tests/schema_smoke_test.sql` ve `supabase/tests/rls_smoke_test.sql` gerçek rol davranışını tam uçtan uca doğrulayan testler değildir. Bunlar şema, RLS ve policy varlığını kontrol eden smoke testlerdir.

## Bilinen Açık Noktalar

- Android tarafında employee ticket listesi için canlı runtime kanıtı eksik.
- Android tarafında device ekranları için canlı runtime kanıtı eksik.
- Android session restore senaryosu bu kapanış turunda yeniden kanıtlanamadı.
- Web tarafında ana MVP akışı teslime uygun görünse de ekran görüntüsü toplama adımı ayrıca yapılmalıdır.
