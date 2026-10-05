# KOUAI — Kulüp Web Sitesi

Kocaeli Üniversitesi Yapay Zeka Kulübü'nün tanıtım sitesi. Saf HTML, CSS ve
JavaScript ile yazıldı; derleme aracı, Node.js kurulumu veya sunucu tarafı kod
gerektirmez. Dosyalara çift tıklayarak açabilir, olduğu gibi de yayına alabilirsin.

---

## Siteyi açmak

**En hızlısı:** `index.html` dosyasına çift tıkla.

**Daha doğrusu (önerilen):** Tarayıcı bazı şeyleri yerel dosyada kısıtlayabildiği
için küçük bir sunucu üzerinden aç. Proje klasöründe terminal açıp:

```bash
python -m http.server 8000
```

Sonra tarayıcıdan `http://localhost:8000` adresine git.

---

## İçeriği güncellemek

Neredeyse her şey tek bir dosyadan yönetiliyor: **`assets/js/data.js`**

Bu dosyayı Not Defteri ya da VS Code ile açıp listelere yeni kayıt eklemen
yeterli — HTML'e dokunmana gerek yok.

| Ne güncellenecek | `data.js` içindeki bölüm |
|---|---|
| E-posta, sosyal medya, adres, başvuru formu | `KULUP` |
| Etkinlikler (yaklaşan ve geçmiş) | `ETKINLIKLER` |
| Yönetim kurulu üyeleri | `YONETIM` |
| Sponsorlar (mevcut ve geçmiş) | `SPONSORLAR` |
| Dönem dönem arşiv kayıtları | `ARSIV` |
| Kulüp projeleri | `PROJELER` |

### Yeni etkinlik eklemek

`ETKINLIKLER` listesinin başına şu bloğu kopyalayıp doldur:

```js
{
  baslik: "Etkinliğin adı",
  tarih: "2026-12-05",          // YYYY-AA-GG
  saat: "18:00 - 20:00",
  yer: "Mühendislik Fakültesi B-204",
  tur: "egitim",                // egitim | seminer | atolye | yarisma | sosyal
  one: true,                    // true ise ana sayfada öne çıkar
  ozet: "Kısa açıklama.",
  etiketler: ["PyTorch", "Ücretsiz"],
  link: "https://...",          // kayıt bağlantısı, yoksa "" bırak
},
```

Site tarihi kendisi okur: geçmiş tarihli etkinlikler otomatik olarak
"Tamamlandı" rozetiyle geçmiş bölümüne düşer, yaklaşanlarda ise kaç gün kaldığı
görünür. Elle bir şey değiştirmene gerek yok.

### Fotoğraf ve logo eklemek

Görselleri `Images/` klasörüne at, sonra `data.js` içinde yolunu yaz:

```js
{ ad: "Ayşe Yılmaz", gorev: "Başkan", foto: "Images/ayse.jpg", ... }
{ ad: "Teknopark Kocaeli", logo: "Images/teknopark.png", ... }
```

`foto` veya `logo` boş bırakılırsa sitede otomatik olarak ismin baş harfleri
gösterilir — yani eksik görsel siteyi bozmaz.

> **Not:** Şu an `data.js` içindeki etkinlik, üye ve sponsor bilgileri örnek
> içeriktir. Yayına almadan önce gerçek bilgilerle değiştirin.

---

## Dosya düzeni

```
KOUAI WEB/
├── index.html           Ana sayfa
├── hakkimizda.html      Biz kimiz, hikâye, ekipler, SSS
├── etkinlikler.html     Etkinlik takvimi ve filtreler
├── arsiv.html           Dönem dönem arşiv
├── ekip.html            Yönetim kurulu
├── sponsorlar.html      Sponsorlar ve sponsorluk paketleri
├── assets/
│   ├── css/style.css    Tüm tasarım (tema renkleri en üstte)
│   ├── img/             Vektör logo dosyaları
│   └── js/
│       ├── data.js      >>> İÇERİK BURADA <<<
│       ├── logo.js      Logonun vektör verisi
│       └── main.js      Site davranışları
├── Images/              Orijinal logo ve fotoğraflar
└── README.md
```

---

## Logo

Kulüp logosu artık siteye gömülü bir **vektör** olarak duruyor. Orijinal
`Images/ai_community_kou_logo.jpeg` görselinin konturları çıkarılarak SVG'ye
çevrildi; çizim birebir aynı, ama artık:

- siyah kare arka planı yok, sayfaya oturuyor,
- açık temada koyu mor, koyu temada açık mor olarak **kendiliğinden** renk değiştiriyor,
- her boyutta keskin (200 piksellik görselin bulanıklığı yok),
- sayfa açılırken soldan sağa çizilerek beliriyor.

| Dosya | Ne işe yarıyor |
|---|---|
| `assets/js/logo.js` | Vektör verisi. Site logoyu buradan çizer. |
| `assets/img/kouai-mark.svg` | Yalnızca amblem — favicon ve site dışı kullanım için. |
| `assets/img/kouai-lockup.svg` | Amblem + "KOUAI" yazısı. |
| `Images/ai_community_kou_logo.jpeg` | Orijinal. Sosyal medya paylaşım görseli olarak duruyor. |

Sayfaya logo koymak istersen HTML'e şunu yazman yeterli:

```html
<span data-logo="amblem"></span>   <!-- sadece amblem -->
<span data-logo="kilit"></span>    <!-- amblem + KOUAI yazısı -->
```

Rengi, bulunduğu yerin yazı rengini takip eder; CSS'te `color` vermen yeterli.

**Logo değişirse:** yeni görseli `Images/` klasörüne koyup bana (ya da bir
geliştiriciye) söylemen gerekiyor — `logo.js` içindeki vektör verisi orijinal
görselden üretildiği için elle güncellenmiyor.

### Logo animasyonları

| Animasyon | Nerede |
|---|---|
| Soldan sağa çizilerek beliren açılış | Her yerde, sayfa yüklenince bir kez |
| Yüzeyinden geçen ışık parıltısı | Her yerde, birkaç saniyede bir |
| İmleç üstüne gelince parıltı + hafif büyüme | Menüdeki logo |
| Çevresinde dönen düğüm halkası | Ana sayfa hero'sundaki büyük logo |
| Yavaşça nefes alır gibi büyüyüp küçülme | Ana sayfa hero'sundaki büyük logo |

Hepsi, işletim sisteminde "hareketi azalt" açıksa otomatik kapanır ve logo
tam hâliyle sabit durur.

---

## Tema ve renkler

Site açık ve koyu tema ile geliyor. Sağ üstteki ay/güneş düğmesiyle değişiyor,
seçim tarayıcıda hatırlanıyor. Ziyaretçi daha önce seçim yapmadıysa işletim
sisteminin temasına uyum sağlıyor.

- **Açık tema:** beyaz zemin, açık mor / lila vurgular
- **Koyu tema:** derin mor-siyah zemin, kapalı mor vurgular

Renkleri değiştirmek istersen `assets/css/style.css` dosyasının en üstündeki
`:root` bloklarına bak — tüm site oradaki birkaç değişkenden besleniyor, başka
yere dokunman gerekmez.

---

## İletişim formu hakkında

Sitenin arkasında sunucu olmadığı için ana sayfadaki form, doldurulan bilgiyi
ziyaretçinin e-posta uygulamasında hazır bir mesaja dönüştürür ve kulüp adresine
yönlendirir.

Mesajların doğrudan kutuya düşmesini istersen ücretsiz bir form servisi
(Formspree, Getform vb.) bağlayabilirsin: `index.html` içindeki
`<form id="iletisim-formu">` etiketine `action` adresini ekleyip
`assets/js/main.js` dosyasındaki `formuKur` fonksiyonunu kaldırman yeterli.

---

## Yayına alma

Statik site olduğu için herhangi bir ücretsiz servise olduğu gibi yüklenebilir:

- **GitHub Pages** — klasörü bir depoya yükle, Settings → Pages'ten `main`
  dalını seç. Birkaç dakika içinde yayında olur.
- **Netlify / Vercel** — klasörü sürükleyip bırakmak yeterli.
- **Üniversite sunucusu** — dosyaları olduğu gibi FTP ile at.

Yayına almadan önce yapılacaklar:

1. `data.js` içindeki örnek içerikleri gerçek bilgilerle değiştir.
2. `KULUP` bölümündeki e-posta ve sosyal medya adreslerini kontrol et.
3. `basvuruFormu` alanına gerçek başvuru formu bağlantısını yaz.
4. Yönetim kurulu fotoğraflarını `Images/` klasörüne ekle.

---

## Erişilebilirlik ve performans notları

- Klavye ile tam gezinilebilir; "İçeriğe geç" bağlantısı ve görünür odak
  halkaları mevcut.
- İşletim sisteminde "hareketi azalt" açıksa animasyonlar otomatik kapanır.
- Dış bağımlılık yalnızca Google Fonts; internet olmasa bile site sistem
  yazı tipleriyle düzgün görünür.
