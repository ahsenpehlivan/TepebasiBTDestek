# TEST_PLAN

## Komut Dogrulama Ozeti

| Alan | Sonuc | Not |
| --- | --- | --- |
| Web `npm run lint` | gecti | 2026-07-06 tarihinde yeniden calistirildi |
| Web `npm run build` | gecti | Build `.env.local` ile tamamlandi; icerik raporlanmadi |
| Android `gradlew.bat assembleDebug` | gecti | 2026-07-06 tarihinde yeniden calistirildi |
| `docker version` | gecti | Docker engine erisimi var |
| `npx supabase --version` | gecti | `2.109.0` |
| `npx supabase db reset` | gecti | Yeni migration dahil tum migrationlar ve seed basariyla uygulandi |
| `npx supabase db push` | gecti | Yeni migration remote projeye uygulandi |

## Supabase Dogrulama Durumu

| Kontrol | Durum | Neden |
| --- | --- | --- |
| Yerel migration zinciri | gecti | `20260703000100` -> `20260706000100` arasi migrationlar uygulandi |
| Yerel seed sonucu | gecti | `supabase/seed.sql` reset sonrasinda yuklendi |
| Enum varligi | gecti | Beklenen enumlar mevcut |
| 9 ana tablo | gecti | Beklenen tablolar olustu |
| RLS etkinligi | gecti | Ana tablolarda `relrowsecurity = true` |
| `ticket-attachments` private bucket | gecti | Bucket `public = false` |
| Trigger ve helper functionlar | gecti | `protect_profile_mutation()` dahil beklenen functionlar bulundu |
| Uzak migration push | gecti | `npx supabase db push` basarili tamamlandi |

## Smoke Testleri

Bu SQL dosyalari gercek rol davranisini degil, sema, RLS ve policy varligini kontrol eden smoke testlerdir.

| Test | Sonuc | Neden |
| --- | --- | --- |
| `supabase/tests/schema_smoke_test.sql` | gecti | `BEGIN -> DO -> ROLLBACK` ile hatasiz tamamlandi |
| `supabase/tests/rls_smoke_test.sql` | gecti | `BEGIN -> DO -> ROLLBACK` ile hatasiz tamamlandi |

## Bootstrap Role Assignment Duzeltmesi

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| Yeni migration ile `protect_profile_mutation()` guncellemesi | gecti | `20260706000100_fix_profile_bootstrap_admin_update.sql` local reset ve remote push sirasinda uygulandi |
| Database-owner baglaminda ilk role assignment | gecti | Local `postgres` baglaminda profile `technician` rolu atanabildi |
| Normal authenticated self-escalation | gecti | Local testte `authenticated` baglami profile update zincirinden gecemedi |

## Auth ve Role Testleri

| Kod | Senaryo | Beklenen | Sonuc | Neden |
| --- | --- | --- | --- | --- |
| AUTH-01 | Gecersiz e-posta/parola ile giris | Turkce hata, dashboard acilmaz | test edilemedi | Bu tur yalnizca migration duzeltmesi icindi |
| AUTH-02 | Technician hesabiyla giris | Dashboard acilir | test edilemedi | Demo technician hesabi olusturulmadi |
| AUTH-03 | Admin hesabiyla giris | Dashboard acilir | test edilemedi | Demo admin hesabi olusturulmadi |
| AUTH-04 | Employee hesabiyla giris | Access denied ekrani acilir | test edilemedi | Demo employee hesabi olusturulmadi |

## Hala Manuel Olan Kontroller

| Kontrol | Sonuc | Neden |
| --- | --- | --- |
| Remote SQL Editor uzerinden demo role assignment tekrar denemesi | test edilemedi | Terminalden Dashboard SQL Editor akisi acilamiyor; local database-owner testi basarili tamamlandi |
