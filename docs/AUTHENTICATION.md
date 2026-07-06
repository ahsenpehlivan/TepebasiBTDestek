# AUTHENTICATION

## Ozet

Web uygulamasi, Next.js 16 ve `@supabase/ssr` kullanarak SSR tabanli auth akisina gecmistir.

Bu asamada:

- Browser client
- Server client
- `src/proxy.ts`
- Login/logout server action'lari
- Protected layout
- Profile ve role cozumleme

uygulanmistir.

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

## Guvenlik Kararlari

- `@supabase/auth-helpers-nextjs` kullanilmadi
- `middleware.ts` yerine Next.js 16 uyumlu `src/proxy.ts` kullanildi
- Service role key istemciye eklenmedi
- `.env.local` repository'e eklenmedi
- Role guard yalnizca server-side profile sorgusu ile yapildi

## Bilinen Eksikler

- Yerel Supabase runtime dogrulamasi Docker engine kapali oldugu icin tamamlanmadi
- Demo auth kullanicilari henuz olusturulmadi
- Gercek runtime auth testleri henuz tamamlanmadi
- Veritabanindan generate edilmis `database.types.ts` bu asamada eklenemedi
