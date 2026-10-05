/* =====================================================================
   KOUAI — İÇERİK DOSYASI
   ---------------------------------------------------------------------
   Sitedeki etkinlik, ekip, sponsor ve arşiv içerikleri BURADAN
   güncellenir. Kod bilmene gerek yok; aşağıdaki listelere yeni kayıt
   ekleyip dosyayı kaydetmen yeterli.

   ÖNEMLİ: Her kaydın sonunda virgül (,) olmalı; metinleri tırnak
   içinde yaz. Türkçe karakter serbest.
   ===================================================================== */

/* ---------------------------------------------------------------------
   KULÜP BİLGİLERİ  —  iletişim, sosyal medya, sayılar
   --------------------------------------------------------------------- */
const KULUP = {
  ad: "Kocaeli Üniversitesi Yapay Zeka Kulübü",
  kisaAd: "KOUAI",
  kurulus: 2021,
  eposta: "kouyapayzeka@gmail.com",
  instagram: "https://www.instagram.com/kouyapayzeka",
  linkedin: "https://www.linkedin.com/company/kouyapayzeka",
  x: "https://x.com/kouyapayzeka",
  github: "https://github.com/kouyapayzeka",
  youtube: "https://www.youtube.com/@kouyapayzeka",
  // Üyelik başvuru formu bağlantısı (Google Forms vb.).
  // Boş bırakırsan "Üye Ol" butonları sitedeki iletişim formuna gider.
  basvuruFormu: "",
  adres: "Kocaeli Üniversitesi Umuttepe Yerleşkesi, Teknoloji Fakültesi, 41001 İzmit / Kocaeli",

  // Ana sayfadaki büyük sayılar
  istatistikler: [
    { sayi: 450, sonek: "+", etiket: "Aktif üye" },
    { sayi: 60,  sonek: "+", etiket: "Düzenlenen etkinlik" },
    { sayi: 18,  sonek: "",  etiket: "Kulüp projesi" },
    { sayi: 25,  sonek: "+", etiket: "Kurumsal iş birliği" },
  ],
};

/* ---------------------------------------------------------------------
   ETKİNLİKLER
   ---------------------------------------------------------------------
   tarih  : "YYYY-AA-GG" biçiminde. Site tarihi otomatik okur ve
            etkinliği "Yaklaşan" ya da "Geçmiş" olarak kendisi ayırır.
   tur    : "egitim" | "seminer" | "atolye" | "yarisma" | "sosyal"
   one    : true yazarsan ana sayfada öne çıkarılır.
   --------------------------------------------------------------------- */
const ETKINLIKLER = [
  {
    baslik: "Yapay Zeka Kariyer Zirvesi '26",
    tarih: "2026-11-14",
    saat: "10:00 - 17:00",
    yer: "Prof. Dr. Baki Komsuoğlu Kongre Merkezi",
    tur: "seminer",
    one: true,
    ozet: "Sektörün önde gelen isimleri, yapay zeka alanında kariyer yolculuklarını ve 2026 iş gücü beklentilerini anlatıyor. Gün sonunda birebir mentorluk masaları kuruluyor.",
    etiketler: ["Kariyer", "Panel", "Networking"],
    link: "",
  },
  {
    baslik: "Derin Öğrenme Bootcamp — Sonbahar Dönemi",
    tarih: "2026-10-18",
    saat: "13:00 - 16:30",
    yer: "Mühendislik Fakültesi B-204 Laboratuvarı",
    tur: "egitim",
    one: true,
    ozet: "Altı hafta süren, PyTorch ile sıfırdan sinir ağı eğitimi. Konvolüsyonel ağlardan transformer mimarilerine kadar uygulamalı ilerliyoruz; katılımcılar kendi modellerini eğitip sunuyor.",
    etiketler: ["PyTorch", "Bootcamp", "Uygulamalı"],
    link: "",
  },
  {
    baslik: "Prompt Mühendisliği Atölyesi",
    tarih: "2026-10-02",
    saat: "18:00 - 20:00",
    yer: "Çevrim içi (Zoom)",
    tur: "atolye",
    one: true,
    ozet: "Büyük dil modellerinden tutarlı çıktı almanın yöntemleri: bağlam tasarımı, değerlendirme döngüleri ve üretim ortamında karşılaşılan tipik hatalar.",
    etiketler: ["LLM", "Online", "Ücretsiz"],
    link: "",
  },
  {
    baslik: "KOUAI Hackathon 2026",
    tarih: "2026-05-09",
    saat: "09:00 - 21:00",
    yer: "Teknopark Kocaeli",
    tur: "yarisma",
    one: false,
    ozet: "12 saatlik veri maratonu. 38 takım, belediyenin açık ulaşım verisi üzerinde yoğunluk tahmini modelleri geliştirdi; ilk üç takım Teknopark'ta staj hakkı kazandı.",
    etiketler: ["Hackathon", "Açık Veri", "Ödüllü"],
    link: "",
  },
  {
    baslik: "Bilgisayarlı Görü ile Nesne Takibi",
    tarih: "2026-04-11",
    saat: "15:00 - 18:00",
    yer: "Mühendislik Fakültesi Konferans Salonu",
    tur: "egitim",
    one: false,
    ozet: "YOLO ailesi modelleriyle gerçek zamanlı nesne tespiti ve takibi. Katılımcılar kendi web kameralarıyla çalışan bir takip uygulaması geliştirdi.",
    etiketler: ["YOLO", "OpenCV", "Uygulamalı"],
    link: "",
  },
  {
    baslik: "Yapay Zeka Etiği Söyleşisi",
    tarih: "2026-03-20",
    saat: "17:00 - 19:00",
    yer: "İİBF Amfi 3",
    tur: "seminer",
    one: false,
    ozet: "Algoritmik önyargı, veri mahremiyeti ve Avrupa Birliği Yapay Zeka Yasası'nın Türkiye'deki yansımaları hukuk ve mühendislik perspektifiyle tartışıldı.",
    etiketler: ["Etik", "Regülasyon", "Panel"],
    link: "",
  },
  {
    baslik: "Kod & Kahve Buluşması",
    tarih: "2026-03-06",
    saat: "16:00 - 19:00",
    yer: "Umuttepe Öğrenci Merkezi",
    tur: "sosyal",
    one: false,
    ozet: "Dönemin ilk tanışma buluşması. Yeni üyeler proje ekiplerine dağıldı, kısa demo turlarında altı öğrenci projesi sergilendi.",
    etiketler: ["Tanışma", "Demo"],
    link: "",
  },
  {
    baslik: "Doğal Dil İşleme Kış Okulu",
    tarih: "2025-12-13",
    saat: "10:00 - 16:00",
    yer: "Mühendislik Fakültesi B-204 Laboratuvarı",
    tur: "egitim",
    one: false,
    ozet: "Türkçe metinlerde duygu analizi, varlık ismi tanıma ve vektör temsilleri. İki günlük program sonunda ortak bir Türkçe veri kümesi yayımlandı.",
    etiketler: ["NLP", "Türkçe", "Kış Okulu"],
    link: "",
  },
  {
    baslik: "TEKNOFEST Hazırlık Kampı",
    tarih: "2025-11-08",
    saat: "09:00 - 18:00",
    yer: "Teknopark Kocaeli",
    tur: "yarisma",
    one: false,
    ozet: "TEKNOFEST Yapay Zeka kategorisine başvuran takımlara yönelik hızlandırma kampı. Kulüpten çıkan iki takım finalde yarışma hakkı elde etti.",
    etiketler: ["TEKNOFEST", "Kamp", "Mentorluk"],
    link: "",
  },
];

/* ---------------------------------------------------------------------
   YÖNETİM KURULU
   ---------------------------------------------------------------------
   foto : Images klasörüne fotoğraf koyup "Images/ad.jpg" yazabilirsin.
          Boş bırakırsan isim baş harfleri gösterilir.
   --------------------------------------------------------------------- */
const YONETIM = [
  {
    ad: "Devran Öztem",
    gorev: "Kulüp Başkanı",
    bolum: "Biyomedikal Mühendisliği",
    foto: "Images/devran.png",
    linkedin: "https://www.linkedin.com/in/devran-oztem/",
    github: "",
    eposta: "",
  },
  {
    ad: "Elif Güngören",
    gorev: "Başkan Yardımcısı",
    bolum: "Bilişim Sistemleri Mühendisliği",
    foto: "Images/elifg.png",
    linkedin: "https://www.linkedin.com/in/elif-g%C3%BCng%C3%B6ren-1212a91a9/",
    github: "",
    eposta: "",
  },
  {
    ad: "Elif Hasbek",
    gorev: "Yazman",
    bolum: "Bilişim Sistemleri Mühendisliği",
    foto: "Images/elif.jpg",
    linkedin: "https://www.linkedin.com/in/elif-hasbek-490111341/",
    github: "",
    eposta: "",
  },
  {
    ad: "Enes Kaymak",
    gorev: "Sayman",
    bolum: "Biyomedikal Mühendisliği",
    foto: "Images/enes.png",
    linkedin: "https://www.linkedin.com/in/enes-kaymak-223668381/",
    github: "",
    eposta: "",
  },
  {
    ad: "Meryem Demir",
    gorev: "Eğitim Koordinatörü",
    bolum: "Bilişim Sistemleri Mühendisliği",
    foto: "Images/meryem.jpg",
    linkedin: "https://www.linkedin.com/in/meryem-demir-216014330/",
    github: "",
    eposta: "",
  },
  {
    ad: "Talha Akbaş",
    gorev: "Etkinlik Koordinatörü",
    bolum: "Bilişim Sistemleri Mühendisliği",
    foto: "Images/talha.png",
    linkedin: "https://www.linkedin.com/in/talha-akba%C5%9F-2a34252ba/",
    github: "",
    eposta: "",
  },
  {
    ad: "Nisa Nur Çap",
    gorev: "Sponsorluk Koordinatörü",
    bolum: "Bilişim Sistemleri Mühendisliği",
    foto: "Images/nisa.jpg",
    linkedin: "https://www.linkedin.com/in/nisanur-%C3%A7ap-55017420b/",
    github: "",
    eposta: "",
  },
  {
    ad: "Sena Temizkan",
    gorev: "Sponsorluk Koordinatörü",
    bolum: "Bilgisayar Programcılığı",
    foto: "Images/sena.png",
    linkedin: "https://www.linkedin.com/in/sena-melek-temizkan-362236441/",
    github: "",
    eposta: "",
  },
  {
    ad: "Melike Bulut",
    gorev: "Tasarım ve Medya Koordinatörü",
    bolum: "Bilişim Sistemleri Mühendisliği",
    foto: "Images/melike.jpg",
    linkedin: "https://www.linkedin.com/in/melike-bulut-23223b204/",
    github: "",
    eposta: "",
  },
];

/* ---------------------------------------------------------------------
   SPONSORLAR
   ---------------------------------------------------------------------
   kademe : "ana" | "altin" | "gumus" | "destek"
   aktif  : true  -> "Mevcut sponsorlarımız" bölümünde
            false -> "Geçmiş sponsorlarımız" bölümünde
   logo   : "Images/sponsor-adi.png" verebilirsin; boşsa baş harf çıkar.
   --------------------------------------------------------------------- */
const SPONSORLAR = [
  { ad: "Teknopark Kocaeli", kademe: "ana",    yil: "2024 — 2026", aktif: true,  logo: "", site: "" },
  { ad: "Ford Otosan",       kademe: "ana",    yil: "2025 — 2026", aktif: true,  logo: "", site: "" },
  { ad: "Arçelik Ar-Ge",     kademe: "altin",  yil: "2026",        aktif: true,  logo: "", site: "" },
  { ad: "Tüpraş",            kademe: "altin",  yil: "2026",        aktif: true,  logo: "", site: "" },
  { ad: "Kocaeli Büyükşehir Belediyesi", kademe: "gumus", yil: "2026", aktif: true, logo: "", site: "" },
  { ad: "BTK Akademi",       kademe: "gumus",  yil: "2026",        aktif: true,  logo: "", site: "" },
  { ad: "Sabancı DX",        kademe: "destek", yil: "2026",        aktif: true,  logo: "", site: "" },
  { ad: "Kariyer.net",       kademe: "destek", yil: "2026",        aktif: true,  logo: "", site: "" },

  { ad: "Turkcell",          kademe: "ana",    yil: "2024",        aktif: false, logo: "", site: "" },
  { ad: "Vodafone",          kademe: "altin",  yil: "2023",        aktif: false, logo: "", site: "" },
  { ad: "Hepsiburada Tech",  kademe: "altin",  yil: "2023",        aktif: false, logo: "", site: "" },
  { ad: "Getir",             kademe: "gumus",  yil: "2023",        aktif: false, logo: "", site: "" },
  { ad: "Yemeksepeti",       kademe: "gumus",  yil: "2022",        aktif: false, logo: "", site: "" },
  { ad: "Udemy Türkiye",     kademe: "destek", yil: "2022",        aktif: false, logo: "", site: "" },
  { ad: "Patika.dev",        kademe: "destek", yil: "2022",        aktif: false, logo: "", site: "" },
  { ad: "Techcareer.net",    kademe: "destek", yil: "2021",        aktif: false, logo: "", site: "" },
  { ad: "Just English",      kademe: "destek", yil: "2021",        aktif: false, logo: "", site: "" }
];

/* ---------------------------------------------------------------------
   ARŞİV  —  dönem dönem yapılanlar
   --------------------------------------------------------------------- */
const ARSIV = [
  {
    donem: "2025 — 2026",
    ozet: "Kulüp tarihinin en yoğun dönemi: iki bootcamp, bir hackathon ve ilk kez düzenlenen kariyer zirvesi.",
    sayilar: { etkinlik: 21, katilimci: 1400, proje: 7 },
    kayitlar: [
      { ad: "Yapay Zeka Kariyer Zirvesi '26", not: "420 katılımcı, 12 konuşmacı, 8 kurumsal stant." },
      { ad: "Derin Öğrenme Bootcamp", not: "6 hafta, 64 mezun, 18 bitirme projesi." },
      { ad: "KOUAI Hackathon 2026", not: "38 takım; açık ulaşım verisiyle yoğunluk tahmini." },
      { ad: "Prompt Mühendisliği Atölyesi", not: "Çevrim içi, 310 kayıt." },
      { ad: "Yapay Zeka Etiği Söyleşisi", not: "Hukuk Fakültesi ile ortak program." },
    ],
  },
  {
    donem: "2024 — 2025",
    ozet: "Sanayi iş birliklerinin kurulduğu dönem. Teknopark Kocaeli ile kalıcı mentorluk programı başladı.",
    sayilar: { etkinlik: 17, katilimci: 980, proje: 5 },
    kayitlar: [
      { ad: "TEKNOFEST Hazırlık Kampı", not: "İki takım finale kaldı." },
      { ad: "Doğal Dil İşleme Kış Okulu", not: "Türkçe duygu analizi veri kümesi yayımlandı." },
      { ad: "Makine Öğrenmesi 101 Serisi", not: "8 haftalık temel eğitim, 210 katılımcı." },
      { ad: "Teknopark Mentorluk Programı", not: "15 öğrenci, 9 mentor eşleşmesi." },
    ],
  },
  {
    donem: "2023 — 2024",
    ozet: "Kulübün eğitim müfredatının oturduğu, Python ve veri bilimi serilerinin standartlaştığı yıl.",
    sayilar: { etkinlik: 14, katilimci: 720, proje: 4 },
    kayitlar: [
      { ad: "Veri Bilimine Giriş Serisi", not: "Pandas, NumPy ve görselleştirme; 6 oturum." },
      { ad: "Kaggle Çalışma Grubu", not: "Haftalık buluşmalar, 3 yarışma katılımı." },
      { ad: "Bahar Şenliği Yapay Zeka Standı", not: "Canlı görüntü işleme demoları." },
    ],
  },
  {
    donem: "2021 — 2023",
    ozet: "Kuruluş yılları. Küçük bir çalışma grubundan üniversite genelinde tanınan bir topluluğa dönüştük.",
    sayilar: { etkinlik: 11, katilimci: 430, proje: 2 },
    kayitlar: [
      { ad: "Kuruluş ve İlk Genel Kurul", not: "24 kurucu üye ile yola çıkıldı." },
      { ad: "Python Başlangıç Kampı", not: "Kulübün ilk açık eğitimi." },
      { ad: "İlk Teknik Gezi", not: "Kocaeli'deki üretim tesislerine saha ziyareti." },
    ],
  },
];

/* ---------------------------------------------------------------------
   PROJELER  —  ana sayfada ve arşivde gösterilir
   --------------------------------------------------------------------- */
const PROJELER = [
  {
    ad: "Kampüs Asistanı",
    ozet: "Üniversitenin yönetmelik ve duyuru metinleri üzerinde çalışan, öğrenci sorularını kaynak göstererek yanıtlayan Türkçe soru-cevap asistanı.",
    etiketler: ["LLM", "RAG", "Türkçe"],
    durum: "Geliştiriliyor",
  },
  {
    ad: "Umuttepe Yoğunluk Tahmini",
    ozet: "Kampüs ring seferlerinin yoğunluğunu saatlik olarak tahmin eden zaman serisi modeli. Datathon çıktısından üretime taşındı.",
    etiketler: ["Zaman Serisi", "Açık Veri"],
    durum: "Yayında",
  },
  {
    ad: "İşaret Dili Çevirici",
    ozet: "Web kamerası görüntüsünden Türk İşaret Dili harflerini gerçek zamanlı tanıyan bilgisayarlı görü uygulaması.",
    etiketler: ["Bilgisayarlı Görü", "Erişilebilirlik"],
    durum: "Geliştiriliyor",
  },
];
