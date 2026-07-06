# SUPABASE_REMOTE_SETUP

## Bu Asamadaki Gercek Durum

2026-07-06 itibariyla uzak Supabase projesine migration uygulanmamistir.

Neden:

- Yerel `supabase db reset` kapisi Docker engine kapali oldugu icin calistirilamadi
- Yerel seed sonucu runtime olarak dogrulanamadi
- Project ref bilgisi saglanmadi
- CLI login durumu bu asamada kullanilmadi

Bu belge, uzak gelistirme ortami icin izlenecek guvenli sirayi tanimlar.

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

- `db reset` basarili
- Seed basarili
- Gerekli smoke testler calisti

## 2. CLI Login ve Link

Kullanici tarafinda:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

Kurallar:

- Project ref kod icine yazilmaz
- CLI login yoksa islem durdurulur
- Gercek kurum projesi yerine yalnizca gelistirme icin acilmis bos proje kullanilir

## 3. Remote Migration Gonderimi

Yalnizca yerel validation gectikten sonra:

- Uzak migration listesi kontrol edilir
- Projede beklenmeyen tablo veya migration gecmisi varsa otomatik overwrite yapilmaz
- Uygunsa migration push uygulanir

Yerel reset gecmeden uzak migration gondermeyin.

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

## 5. Demo Kullanici Olusturma Sirasi

Sirali akış:

1. Migrationlari uygula
2. Gerekirse departman ve cihaz seed'ini dogrula
3. Dashboard Auth bolumunden demo kullanicilari olustur
4. `handle_new_user()` trigger'i ile `profiles` satirlarini kontrol et
5. SQL Editor ile technician/admin role atamalarini yap
6. Sonra web login ve role testlerini calistir

Demo kullanici ayrintilari icin `docs/DEMO_DATA_SETUP.md` kullanilir.

## 6. Type Generation

Linked proje hazir oldugunda type generation icin ornek akış:

```bash
npx supabase gen types typescript --linked > apps/web/src/types/database.types.ts
```

Bu asamada linked proje bulunmadigi icin type generation uygulanmamistir.

## 7. Secret Key Uyarilari

- Secret key terminale yazdirilmaz
- Service role key istemciye verilmez
- Veritabanı parolasi dosyalara yazilmaz
- `.env.local` Git'e eklenmez

## 8. Yeniden Kurulum Adimlari

Docker engine hazir oldugunda onerilen sira:

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
11. Web auth ve role testlerini calistir
