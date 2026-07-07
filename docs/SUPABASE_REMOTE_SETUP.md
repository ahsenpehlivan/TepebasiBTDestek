# SUPABASE_REMOTE_SETUP

## Bu Asamadaki Gercek Durum

2026-07-06 itibariyla linked uzak Supabase gelistirme projesi dogrulanmistir.

Bu turde gerceklesenler:

- Yerel `npx supabase db reset` ve seed dogrulamasi tamamlandi.
- `schema_smoke_test.sql` ve `rls_smoke_test.sql` smoke test olarak gecti.
- `npx supabase db push` ile yeni migration remote projeye uygulandi.
- Demo profile kayitlari remote projede rol ve department bazinda kontrol edildi.
- Web uygulamasi remote public env ile calistirildi.
- Browser uzerinden login, logout, protected route ve auth hata akislari gercek session ile test edildi.
- Gecici runtime auth kullanicilari sadece test icin oluşturuldu ve test sonunda silindi.

Bu belge, bundan sonraki remote validation tekrarlarinda izlenecek guvenli sirayi tanimlar.

## 1. Yerel Validation Kapisi

Uzak ortama gecmeden once:

```bash
docker version
npx supabase --version
npx supabase stop
npx supabase start
npx supabase db reset
npx supabase status
```

Asagidaki kosullar saglanmadan `link` veya `db push` yapilmaz:

- `db reset` başarılı
- Seed başarılı
- Gerekli smoke testler calisti

## 2. CLI Login ve Link

Kullanici tarafinda:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

2026-07-06 tarihli dogrulamada linked proje hazirdi ve CLI tarafinda remote sorgular calistirildi.

Kurallar:

- Project ref kod icine yazilmaz
- CLI login yoksa işlem durdurulur
- Gercek kurum projesi yerine yalnizca gelistirme icin acilmis bos proje kullanilir

## 3. Remote Migration Gonderimi

Yalnizca yerel validation gectikten sonra:

- Uzak migration listesi kontrol edilir
- Projede beklenmeyen tablo veya migration gecmisi varsa otomatik overwrite yapilmaz
- Uygunsa migration push uygulanir

2026-07-06 tarihli uygulamada bu kapi gecildikten sonra `20260706000100_fix_profile_bootstrap_admin_update.sql` remote projeye push edildi.

## 4. Public Environment Variables

Web istemcisi icin yalnizca su iki public deger kullanilir:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Sunlar istemciye eklenmez:

- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DATABASE_PASSWORD`

`apps/web/.env.local` dosyasinin Git tarafindan izlenmedigi dogrulanmistir.

## 5. Demo Kullanici ve Role Assignment Sirasi

Sirali akis:

1. Migrationlari uygula
2. Gerekirse departman ve cihaz seed'ini dogrula
3. Dashboard Auth bolumunden demo kullanicilari olustur
4. `handle_new_user()` trigger'i ile `profiles` satirlarini kontrol et
5. SQL Editor ile technician/admin role atamalarini yap
6. Ilk demo admin veya technician role assignment asamasinda, `protect_profile_mutation()` icindeki yalnizca database-owner baglamina acik bootstrap istisnasi sayesinde SQL Editor veya migration baglami role assignment yapabilir
7. Sonra web login ve role testlerini calistir

Demo kullanici ayrintilari icin `docs/DEMO_DATA_SETUP.md` kullanilir.

2026-07-06 remote profile kontrolu:

- `employee.demo@example.com` -> `employee`, `IK`
- `technician.demo@example.com` -> `technician`, `BILGI_ISLEM`
- `admin.demo@example.com` -> `admin`, `BILGI_ISLEM`

Normal `authenticated` kullanicilar icin role bypass yoktur. Employee veya technician kendi rolunu yukseltemez.

## 6. Remote Runtime Validation Sirasi

Remote web runtime dogrulamasi icin onerilen sira:

1. Demo profile rol ve department kayitlarini sorgula
2. Web uygulamasini remote public env ile ac
3. Browser uzerinden `login`, `dashboard`, `tickets`, `logout`, `access-denied` ve `auth-error` akislari dogrula
4. Gerekirse yalnizca test icin gecici runtime auth kullanicilari olustur
5. Session bazli RLS sorgularini public publishable key ile calistir
6. Gecici runtime auth kullanicilarini test sonunda sil

## 7. Type Generation

Linked proje hazir olmasina ragmen bu turde type generation uygulanmamistir.

Ornek komut:

```bash
npx supabase gen types typescript --linked > apps/web/src/types/database.types.ts
```

## 8. Secret Key Uyarilari

- Secret key terminale yazdirilmaz
- Service role key istemciye verilmez
- Veritabani parolasi dosyalara yazilmaz
- `.env.local` Git'e eklenmez

## 9. Yeniden Kurulum Adimlari

Tam dogrulama tekrarinda onerilen sira:

1. `docker version`
2. `npx supabase start`
3. `npx supabase db reset`
4. `npx supabase status`
5. `schema_smoke_test.sql`
6. `rls_smoke_test.sql`
7. `npx supabase login`
8. `npx supabase link --project-ref <project-ref>`
9. Migration push
10. Demo auth kullanicilarini olustur
11. Demo role assignment sorgularini uygula
12. Web auth ve role testlerini calistir
13. RLS runtime sorgularini tekrar et
