# MVP_DEMO_SCENARIO

## Demo Amacı

Bu senaryo, staj tesliminde mevcut MVP'nin neyi tamamladığını açık ve güvenli biçimde anlatmak için hazırlanmıştır.

Ana odak:

- web yönetim panelinin uçtan uca tamamlanan akışları
- Android tarafında temel olarak hazırlanan akışlar
- Supabase ve RLS güvenlik yaklaşımı

## Final Demo Akışı

1. Web login ekranını göster.
2. Role guard mantığını kısaca açıkla.
3. Dashboard genel özetini göster.
4. Talep listesini aç.
5. Talep detay, yorum ve durum/atama örneğini göster.
6. Cihaz listesini aç.
7. Cihaz detay ve bakım kayıtları bölümünü göster.
8. QR preview ekranını göster.
9. Android login ekranını göster.
10. Android role-based home ekranlarını göster.
11. Android ticket ve device modüllerinin temel olarak hazırlandığını açıkla.

## Demo Giriş Hesapları

Bu hesaplar yalnızca demo ve test amacıyla kullanılır. Gerçek kurum personeli hesabı değildir.

| Rol | E-posta | Şifre | Kullanım Amacı |
| --- | --- | --- | --- |
| Personel | `employee.demo@example.com` | Mentor demosu için doldurulacak | Personel giriş senaryosu ve erişim davranışı |
| Teknik Personel | `technician.demo@example.com` | Mentor demosu için doldurulacak | Web panel, talep kuyruğu ve işlem akışları |
| Yönetici | `admin.demo@example.com` | Mentor demosu için doldurulacak | Yönetici görünümü ve panel erişimi |

Not: Demo parolaları güvenlik nedeniyle repository içinde tutulmaz. Giriş bilgileri mentor demosu öncesinde kontrollü biçimde paylaşılmalıdır.

## Sunumda Kullanılacak Kısa Anlatım

Web tarafında canlı ve anlatılabilir ana akış şudur:

- login
- role guard
- dashboard
- ticket listesi
- ticket detayı, yorum ve durum/atama örneği
- device listesi
- device detayı ve bakım geçmişi
- QR preview

Android tarafında canlı feature demo yerine dürüst ve sade anlatım önerilir:

- kimlik doğrulama temeli tamamlandı
- employee, technician ve admin home ekranları doğrulandı
- ticket modülleri için temel ekran yapısı hazırlandı
- device modülleri için temel ekran yapısı hazırlandı
- maintenance ve QR preview için temel yapı hazırlandı

Sunumda şu not açıkça söylenmelidir:

Android tarafında bazı ticket ve device ekranları build, navigation ve kaynak kod düzeyinde hazır olsa da bu kapanış turunda employee veya technician canlı oturumuyla uçtan uca tekrar doğrulanamamıştır.

## Sunumda Özellikle Vurgulanacak Güvenlik Noktaları

- service role key istemciye verilmedi
- tüm ana tablolarda RLS açık
- QR payload yalnızca güvenli token içeriyor
- employee web paneline alınmıyor
- Android ve web tarafında secret veya parola dokümana yazılmıyor

## Sunumda Tamamlanmış Gibi Anlatılmaması Gerekenler

- QR tarama
- fotoğraf yükleme
- realtime
- push notification
- Android create/edit/passive device işlemleri
- gelişmiş Android runtime kanıtı alınmamış ekranlar

## Gelecek Faz Notu

Gelecek faz fikirleri `docs/FUTURE_PHASES.md` içinde ayrı tutulur. Bu başlıklar mevcut MVP'nin tamamlanmış parçası gibi anlatılmamalıdır.
