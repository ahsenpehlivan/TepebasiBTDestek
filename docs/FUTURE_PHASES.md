# FUTURE_PHASES

Bu belge, mevcut Web MVP ve Android handoff sonrasinda dusunulen gelecek faz fikirlerini toplar.

Bu basliklar:

- mevcut MVP'nin parcasi degildir
- tamamlanmis ozellik gibi yorumlanmamalidir
- yeni faz planlamasi, veri modeli tasarimi ve guvenlik degerlendirmesi gerektirir

## 1. Akilli Cozum Oneri Akisi

### Amac

Personel ticket acmadan once yasadigi sorunu serbest metin olarak yazar. Sistem, onceden onaylanmis kolay cozum adimlarini onerir. Kullanici:

- `Denedim, sorun cozuldu` derse ticket acilmaz
- `Denedim, sorun devam ediyor` derse ticket acilir

Ticket acildiginda, kayitta onerilen cozumun denendigi bilgisi de tutulur.

### Ilk Faz Yaklasimi

Ilk surum ML olmak zorunda degildir. Ilk surum su yapiyla baslamalidir:

- onayli cozum kutuphanesi
- kategori eslestirme
- anahtar kelime eslestirme
- kolay uygulanabilir cozum adimlari

Bu sayede sistem once kural tabanli ve denetlenebilir bir yardim katmani olarak calisir.

### Ornek Cozum Turleri

- cihazi kapatip acma
- internet baglantisini kontrol etme
- yazici kuyrugunu temizleme
- dogru aga bagli oldugunu kontrol etme
- kablo veya guc baglantisini kontrol etme
- basit ayar kontrolu

### Guvenlik ve Kalite Notlari

- Oneriler technician veya admin tarafindan onceden onaylanmis olmalidir.
- Riskli, donanima zarar verebilecek veya uzmanlik gerektiren adimlar kullaniciya gosterilmemelidir.
- Kullanici cevabi loglanmalidir.
- Sorun cozulmezse standart ticket akisi devam etmelidir.
- Ticket kaydina `onerilen cozum denendi ama cozulmedi` benzeri bir bilgi eklenmelidir.

### Uzun Vadeli Genisleme

Ileride bu yapi:

- ML destekli siniflandirma
- semantic search
- embedding tabanli benzer sorun bulma

yaklasimlarina genisletilebilir. Ancak ilk surumun kural tabanli ve onayli cozum kutuphanesi olarak baslamasi daha guvenli ve daha aciklanabilir bir yaklasimdir.

## 2. Istatistiksel Karar Destek Paneli

### Amac

Technician ve admin kullanicilari icin hangi departmanlarda, hangi cihaz turlerinde ve hangi kategorilerde daha cok sorun ciktigini gosteren analiz ekranlari tasarlamaktir.

Bu panel, Bilgi Islem Mudurlugu icin karar destek sistemi niteligindedir.

### Ornek Gostergeler

- en cok ticket acilan departmanlar
- en cok ariza cikaran cihazlar
- en sik sorun cikan cihaz turleri
- en sik ticket kategorileri
- ortalama cozum suresi
- acik, bekleyen ve cozulen ticket sayilari
- bakim kaydi yogunlugu
- cozum onerisiyle ticket acilmadan cozulen sorun sayisi

### Beklenen Deger

- tekrar eden sorun alanlari gorunur hale gelir
- onleyici bakim planlari daha verili yapilabilir
- cihaz yenileme veya dagitim kararlarina veri saglanir
- departman bazli destek yukleri daha net izlenir

### Faz Notu

Bu panel gelecekte ayri bir analiz ve raporlama fazi olarak ele alinmalidir. Mevcut Web MVP demo akisinda gosterilen temel dashboard kartlarindan farkli, daha derin karar destek ekranlari hedefler.
