# ANDROID_DEVICES

## Özet

Android cihaz katmanı foundation seviyesinde hazırlanmıştır. Cihaz listesi, cihaz detay, bakım geçmişi ve QR preview ekranları build ve navigation düzeyinde bağlıdır.

## Kapsam

- `DeviceList`
- `DeviceDetail`
- `DeviceMaintenanceRecord`
- `DeviceQrPreview`

## Tamamlanan Foundation Akışları

- employee / technician / admin home ekranlarından `DeviceList` geçişi
- `DeviceList -> DeviceDetail`
- `DeviceDetail` içinde bakım kayıtları bölümü
- `DeviceDetail -> DeviceQrPreview`

## Schema Uyumu

İncelenen temel alanlar:

- `asset_tag`
- `device_type`
- `brand`
- `model`
- `serial_number`
- `status`
- `department_id`
- `assigned_user_id`
- `purchase_date`
- `warranty_end_date`
- `notes`
- `is_active`
- `qr_token`

## Repository Yaklaşımı

Hazır fonksiyonlar:

```kotlin
suspend fun loadDevices(): Result<List<DeviceSummary>>
suspend fun loadDeviceDetail(deviceId: String): Result<DeviceDetail>
suspend fun loadMaintenanceRecords(deviceId: String): Result<List<DeviceMaintenanceRecord>>
```

Kurallar:

- service role kullanılmaz
- RLS sonucuna güvenilir
- `qr_token` yalnızca read-only preview için kullanılır
- bakım kayıtları newest-first okunur
- ham Supabase hata mesajı kullanıcıya gösterilmez

## Güvenli QR Yaklaşımı

Android QR preview ekranı yalnızca:

```text
TBT-DEVICE:<qr_token>
```

payload'ını gösterir.

Gösterilmeyenler:

- seri numarası
- IP adresi
- MAC adresi
- personel adı
- e-posta
- telefon

Bu yaklaşım web ile aynıdır.

## Foundation Seviyesinde Kalan Noktalar

Canlı runtime kanıtı eksik olan alanlar:

- device list canlı employee/technician görüntüleme
- device detail canlı ilerleyişi
- maintenance history canlı listeleme
- QR preview canlı ilerleyişi

## Bilinen Eksikler

- create/edit/passive Android tarafında yok
- QR tarama yok
- gerçek QR görseli yok
- kamera izni yok
- photo upload yok
- realtime yok

Bu alanlar bilinçli olarak sonraki fazlara bırakılmıştır.
