# AUTHENTICATION

## Ozet

Web uygulamasi, Next.js 16 ve `@supabase/ssr` kullanarak SSR tabanli auth akisina gecmistir.

Android tarafinda ise 2026-07-08 tarihi itibariyla Supabase Kotlin client ile auth temeli kurulmustur. Ayrintili Android notlari icin `docs/ANDROID_AUTH.md` dosyasini kullanin.

Bu asamada:

- Browser client
- Server client
- `src/proxy.ts`
- Login/logout server action'lari
- Protected layout
- Profile ve role cozumleme

uygulanmistir.

Android fazinda ek olarak:

- `BuildConfig` uzerinden Android Supabase config okuma
- `Splash -> Login -> role-based home` navigation akisi
- `profiles.role` alanindan employee / technician / admin cozumleme
- `is_active = false` icin `AccessDenied`
- profile satiri yoksa `AuthError`
- logout sonrasi temiz back stack

uygulanmistir.

2026-07-06 tarihinde linked remote Supabase projesi uzerinde gercek browser oturumu ve gercek session tabanli RLS dogrulamalari yapilmistir.

## Browser Client

Konum: `apps/web/src/lib/supabase/client.ts`

Gorevleri:

- Client component ortami icin browser client olusturmak
- Public Supabase URL ve publishable key kullanmak
- Tekrarlanan browser client olusturmayi singleton ile kontrol etmek

Service role veya secret key kullanilmaz.

## Server Client

Konum: `apps/web/src/lib/supabase/server.ts`

Gorevleri:

- Server component
- Server action
- Route benzeri server-side kullanimlar

icin Supabase server client olusturmak.

Cookie okuma `next/headers` uzerinden yapilir. Server component tarafinda cookie yazma mumkun olmadiginda sessizce proxy katmanina birakilir.

## Proxy'nin Gorevi

Konum: `apps/web/src/proxy.ts`

Proxy tam authorization katmani degildir.

Gorevleri:

- Supabase auth cookie'lerini yenilemek
- `dashboard` ve `tickets` gibi protected route'larda oturum yoksa `/login` yonlendirmesi yapmak
- Login ve erisim reddi sayfalarinda session tazeleme zincirini korumak

Rol karari proxy uzerinden verilmez.

## Profile ve Role Cozumleme

Konum: `apps/web/src/lib/auth/server.ts`

Akis:

1. `auth.getUser()` ile dogrulanmis auth kullanicisi okunur.
2. `public.profiles` tablosundan:
   - `id`
   - `full_name`
   - `role`
   - `department_id`
   - `job_title`
   - `is_active`
   okunur.
3. Gerekirse `departments` tablosundan birim adi cozumlenir.
4. Rol her zaman veritabanindaki `profiles.role` alanindan alinir.

Asagidaki kaynaklara guvenilmez:

- Cookie icindeki role bilgisi
- URL parametreleri
- Client localStorage
- Form input'lari
- Client-side metadata yorumlari

## Protected Layout

Konum: `apps/web/src/app/(protected)/layout.tsx`

Kurallar:

1. Kullanici yoksa `/login`
2. Profile satiri yoksa `/auth-error`
3. `is_active = false` ise `/access-denied`
4. `employee` ise `/access-denied`
5. `technician` ve `admin` ise icerik acilir

Bu kontrol `useEffect` redirect ile degil, server-side layout seviyesinde yapilir.

## Login Akisi

Konum:

- `apps/web/src/app/(public)/login/page.tsx`
- `apps/web/src/app/actions/auth.ts`

Ozellikler:

- E-posta normalize edilir
- Bos alan kontrolu vardir
- Loading durumu client form uzerinden gosterilir
- Ham Supabase hata metni kullaniciya verilmez
- Basarili giris sonrasi rol bazli redirect uygulanir

Rol davranisi:

- `technician` -> `/dashboard`
- `admin` -> `/dashboard`
- `employee` -> `/access-denied`
- `is_active = false` -> `/access-denied`
- profile satiri yok -> `/auth-error`

## Logout Akisi

Logout server action ile uygulanir.

Gorevleri:

- Supabase session'i kapatmak
- Cookie temizligini Supabase auth mekanizmasi ile yaptirmak
- Kullaniciyi `/login` sayfasina yonlendirmek

Yalnizca client local state temizligi kullanilmaz.

## Employee Web Erisim Siniri

Bu prototipte employee hesabi auth tarafinda gecerli olsa bile web yonetim paneline alinmaz.

Neden:

- Web paneli teknik personel ve yoneticiler icin hedeflenmistir
- Employee rolu sonraki mobil/Supabase akislari icin ayrilmistir

Employee girisi sonrasi `access-denied` sayfasi acilir ve logout butonu sunulur.

## Android Role Davranisi

Android tarafinda employee rolu webden farkli olarak mobil baslangic ekranina alinabilir.

Davranis:

- `employee` -> `EmployeeHomeScreen`
- `technician` -> `TechnicianHomeScreen`
- `admin` -> `AdminHomeScreen`
- `is_active = false` -> `AccessDenied`
- profile satiri yok -> `AuthError`
- eksik Android config -> `ConfigError`

Bu ayrim, web yonetim paneli ile personel odakli mobil akislarin farkli amaclarini korumak icindir.

## Runtime Dogrulama Sonuclari

2026-07-06 tarihli gercek browser akisi sonucunda:

- Gecersiz e-posta veya parola ile giris denemesinde Turkce hata goruldu.
- Technician rolu dashboard ve `/tickets` sayfasini acabildi.
- Admin rolu dashboard sayfasini acabildi.
- Employee rolu web paneline alinmadi ve `/access-denied` ekranina yonlendirildi.
- Pasif profile sahip kullanici `/access-denied` ekranina yonlendirildi.
- `profiles` satiri bulunmayan auth kullanicisi `/auth-error` ekraninda kontrollu bicimde durduruldu.
- Logout sonrasi `/dashboard` ve `/tickets` rotalari tekrar `/login` sayfasina yonlendirildi.

Bu testler demo kullanici parolalari repository icinde tutulmadigi icin, remote projede gecici olarak olusturulan ve test sonunda silinen kontrollu runtime kullanicilarla yapildi. Runtime kullanicilar demo roller ve department atamalariyla eslestirildi.

## Runtime RLS Notlari

Gercek session sorgularinda:

- Anonymous `tickets` sorgusu `0` satir dondu.
- Employee local demo session ile kendi 4 ticket kaydini gorebildi.
- Employee local demo session ile technician tarafindan acilan `Demo dahili teknik kontrol kaydi` ticket'ini goremedi.
- Technician local demo session ile 6 demo ticket kaydinin tamamini gorebildi.
- Employee local demo session ile kendi ticket'indaki public yorumu gorebildi.
- Employee local demo session ile ayni ticket'taki internal yorumu goremedi.
- Technician local demo session ile ayni ticket'taki internal yorumu gorebildi.
- Employee kendi `profiles` satirini okuyabildi.
- Employee diger profile kayitlarini okuyamadi.
- Technician demo profile ozetlerini okuyabildi.

Bu local runtime testleri, `20260706000200_restore_public_api_grants.sql` migration'i eklendikten sonra tekrar calistirildi. Boylece local `db reset` sonrasi Data API erisimi tablo grant'lerinde takilmadan dogrudan RLS policy'lerine kadar ulasabildi.

## Ticket Sayfalari Runtime Dogrulamasi

2026-07-06 tarihinde linked remote Supabase projesi ve gercek browser oturumu ile:

- Technician runtime hesabi `/tickets` ekranini acabildi.
- URL query parametreli filtreleme dogrulandi.
- `/tickets/[id]` detay sayfasi gercek demo ticket verisiyle acildi.
- Ticket atama formu sonucunda ilgili ticket'in assignee kaydi guncellendi.
- Ticket durum guncelleme formu sonucunda `resolved -> closed` gecisi veritabaninda dogrulandi.
- Internal yorum formu sonucunda ilgili ticket'in internal comment sayisi kontrollu olarak artti.

## Guvenlik Kararlari

- `@supabase/auth-helpers-nextjs` kullanilmadi
- `middleware.ts` yerine Next.js 16 uyumlu `src/proxy.ts` kullanildi
- Service role key istemciye eklenmedi
- Android tarafinda service role, database password veya secret key kullanilmadi
- `.env.local` repository'e eklenmedi
- `apps/android/secrets.properties` Git'e eklenmedi
- Role guard yalnizca server-side profile sorgusu ile yapildi
- Ilk demo admin veya technician role assignment islemi icin yalnizca database-owner baglaminda calisan kontrollu bootstrap istisnasi eklendi; normal `authenticated` kullanicilar kendi rollerini yukseltemez

## Bilinen Eksikler

- AUTH-12 senaryosu, Next.js build cache etkisini bozmadan eksik env ile ayrik browser instance uretilemedigi icin canli browser'da tamamlanamadi
- Veritabanindan generate edilmis `database.types.ts` bu asamada eklenemedi
