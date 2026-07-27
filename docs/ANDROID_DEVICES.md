# ANDROID_DEVICES

## Ozet

Bu dokuman Android tarafindaki cihaz listesi iskeletini ozetler.
Bu fazda yalnizca read-only cihaz listeleme akisi ele alinmistir.

Kapsam:

- `DeviceSummary`, `DeviceType` ve `DeviceStatus` domain modelleri
- `DeviceRepository` ve `SupabaseDeviceRepository`
- `DeviceListScreen`, `DeviceListViewModel`, `DeviceListUiState` ve `DeviceUi`
- Employee, technician ve admin home ekranlarindan `DeviceList` route'una gecis
- RLS'ye guvenen sade cihaz listeleme sorgusu
- Loading, liste, empty ve error ekran durumlari
- Turkce UI etiketleri ve durum badge'leri

Bu fazda sunlar eklenmedi:

- cihaz detay ekrani
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

Notlar:

- `asset_tag` demirbas kodu olarak gosterilir
- `assigned_user_id` cihazi kullanan veya zimmetli gorunen personeli ifade eder
- `tickets.assigned_to` ile karistirilmaz
- Veritabani enum degerleri Ingilizce kalir; Android UI katmani Turkce label gosterir

## Repository Yaklasimi

Repository arayuzu:

```kotlin
suspend fun loadDevices(): Result<List<DeviceSummary>>
```

Davranis:

- publishable key ile normal istemci baglantisi kullanilir
- service role kullanilmaz
- RLS sonucuna guvenilir
- minimum alanlar secilir
- kayitlar once `is_active desc`, sonra `asset_tag asc` ile siralanir
- departman ve kullanici adlari ayri yardimci sorgularla zenginlestirilir
- ham Supabase hatasi yerine kontrollu Turkce hata donulur

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

Bu fazda kart tiklamasi bilincli olarak pasiftir.
UI icinde `Cihaz detayi sonraki asamada eklenecek.` notu gosterilir.

## RLS Yaklasimi

Android istemcisi cihazlar icin sahte ek yetki kontrolu uygulamaz.

Yaklasim:

- `devices` tablosuna normal select istegi atilir
- hangi kayitlarin donecegine `users_can_read_accessible_devices` policy'si karar verir
- employee yalnizca kendi uzerine atanmis aktif cihazlari gorebilir
- technician ve admin policy'nin izin verdigi cihazlari gorebilir

## Bilinen Eksikler

- Device detail route'u henuz yok
- Runtime'da cihaz listesine employee veya technician session ile manuel ilerleme kaniti bu fazda alinmadi
- Filtreleme veya arama eklenmedi

## Sonraki Asama

- Android cihaz detay ekrani iskeleti
