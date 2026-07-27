# ANDROID_DEVICES

## Ozet

Bu dokuman Android tarafindaki cihaz listesi ve cihaz detay iskeletini ozetler.
Bu fazda read-only cihaz listeleme ve read-only cihaz detay akisi ele alinmistir.

Kapsam:

- `DeviceSummary`, `DeviceType` ve `DeviceStatus` domain modelleri
- `DeviceDetail` modeli
- `DeviceRepository` ve `SupabaseDeviceRepository`
- `DeviceListScreen`, `DeviceListViewModel`, `DeviceListUiState` ve `DeviceUi`
- `DeviceDetailScreen`, `DeviceDetailViewModel` ve `DeviceDetailUiState`
- Employee, technician ve admin home ekranlarindan `DeviceList` route'una gecis
- `DeviceList` kartindan `DeviceDetail/{deviceId}` route'una gecis
- RLS'ye guvenen sade cihaz listeleme sorgusu
- RLS'ye guvenen sade cihaz detay sorgusu
- Loading, liste, empty ve error ekran durumlari
- Turkce UI etiketleri ve durum badge'leri

Bu fazda sunlar eklenmedi:

- cihaz olusturma veya duzenleme
- cihaz pasife alma
- bakim kaydi ekleme
- QR, upload veya realtime

## Device Schema Uyumu

Android listeleme akisi mevcut `devices` semasi ile uyumludur.
Incelenen temel alanlar:

- `id`
- `asset_tag`
- `device_type`
- `brand`
- `model`
- `status`
- `department_id`
- `assigned_user_id`
- `is_active`
- `serial_number`
- `purchase_date`
- `warranty_end_date`
- `notes`

Notlar:

- `asset_tag` demirbas kodu olarak gosterilir
- `assigned_user_id` cihazi kullanan veya zimmetli gorunen personeli ifade eder
- `tickets.assigned_to` ile karistirilmaz
- Veritabani enum degerleri Ingilizce kalir; Android UI katmani Turkce label gosterir
- Web tarafindaki gibi ham `qr_token` Android detay ekraninda gosterilmez
- Seri numarasi detail ekraninda kontrollu maskeli gosterilir

## Repository Yaklasimi

Repository arayuzu:

```kotlin
suspend fun loadDevices(): Result<List<DeviceSummary>>
suspend fun loadDeviceDetail(deviceId: String): Result<DeviceDetail>
```

Davranis:

- publishable key ile normal istemci baglantisi kullanilir
- service role kullanilmaz
- RLS sonucuna guvenilir
- minimum alanlar secilir
- kayitlar once `is_active desc`, sonra `asset_tag asc` ile siralanir
- departman ve kullanici adlari ayri yardimci sorgularla zenginlestirilir
- ham Supabase hatasi yerine kontrollu Turkce hata donulur
- detail sorgusu minimum olarak kimlik, durum, zimmet, tarih ve not alanlarini okur
- cihaz detail erisimi yoksa kontrollu hata donulur; uygulama cokmez

## ViewModel ve UI Akisi

`DeviceListViewModel`:

1. mevcut session state'i kontrol eder
2. authenticated profile yoksa kontrollu hata durumu uretir
3. varsa `loadDevices()` cagrisi yapar
4. sonucu `DeviceListUiState` icine yazar

`DeviceListScreen` durumlari:

- loading
- liste
- empty
- error

Kartta gosterilen alanlar:

- Demirbas Kodu
- Cihaz Turu
- Marka / Model
- Durum badge
- Departman
- Cihazi Kullanan Personel

`DeviceDetailScreen` bolumleri:

- Cihaz Kimligi
- Durum
- Zimmet Bilgisi
- Tarihler
- Notlar

Detay ekraninda:

- QR token gosterilmez
- Seri numarasi maskeli verilir
- not yoksa `Bu cihaz icin not bulunmuyor.` mesaji gosterilir

## RLS Yaklasimi

Android istemcisi cihazlar icin sahte ek yetki kontrolu uygulamaz.

Yaklasim:

- `devices` tablosuna normal select istegi atilir
- hangi kayitlarin donecegine `users_can_read_accessible_devices` policy'si karar verir
- employee yalnizca kendi uzerine atanmis aktif cihazlari gorebilir
- technician ve admin policy'nin izin verdigi cihazlari gorebilir

## Bilinen Eksikler

- Runtime'da cihaz listesi veya cihaz detayina employee ya da technician session ile manuel ilerleme kaniti bu fazda alinmadi
- Filtreleme veya arama eklenmedi
- Bakim kayitlari ve QR akisi Android detail ekranina dahil edilmedi

## Sonraki Asama

- Android cihaz bakim kayitlari goruntuleme iskeleti
