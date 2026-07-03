# TEST_PLAN

## Web Build Testi

- `apps/web` dizininde `npm run build` çalıştırılır
- Derleme hatası olmadan üretim paketi oluşturduğu doğrulanır

## Web Lint Testi

- `apps/web` dizininde `npm run lint` çalıştırılır
- TypeScript ve Next.js lint kurallarına uyum kontrol edilir

## Android Debug Build Testi

- `apps/android` dizininde `gradlew.bat assembleDebug` çalıştırılır
- Debug APK üretimi doğrulanır

## Android Temel Ekran Testi

- Uygulama emülatörde veya cihazda açılır
- Açılış ekranında uygulama adı, prototip bilgisi ve geliştirme notu görüntülenir
- Çökme veya yerleşim bozulması olmadığı kontrol edilir

## Responsive Görünüm Testi

- Web ana sayfası, login ve dashboard ekranları dar ve geniş görünümde kontrol edilir
- Kartların ve tablonun taşma yapmadığı doğrulanır

## Sonraki Aşamalar İçin Ayrılmış Test Bölümleri

### Auth Testleri

- Giriş, çıkış ve oturum koruması senaryoları eklenecek

### RLS Testleri

- Rol bazlı veri erişim izinleri doğrulanacak

### CRUD Testleri

- Talep ve cihaz kayıtları için oluşturma, listeleme, güncelleme ve silme akışları test edilecek

### QR Testleri

- QR kod ile cihaz görüntüleme ve doğrulama senaryoları eklenecek
