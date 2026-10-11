/* =====================================================================
   KOUAI — Etkinlik, sponsor ve yönetim kurulu verisini Supabase'den okur
   (admin panelinden girilenler). main.js çalışmadan önce data.js'teki
   listeleri yerinde değiştirir. Bağlantı kurulamazsa data.js'teki liste
   olduğu gibi kalır; site bozulmaz.
   ===================================================================== */
(function () {
  "use strict";
  var cfg = window.KOUAI_SUPABASE || {};
  if (!(cfg.url && cfg.anonKey && !/PROJE-KODUN|ANON-ANAHTARIN/.test(cfg.url + cfg.anonKey) && window.supabase)) return;

  var st = document.createElement("style");
  st.textContent = ".event-img{width:100%;max-height:220px;object-fit:cover;border-radius:12px;margin-bottom:14px;border:1px solid var(--border)}";
  document.head.appendChild(st);

  var db = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false } });

  function cek(tablo, siralama, hedef, esle) {
    var q = db.from(tablo).select("*");
    siralama.forEach(function (s) { q = q.order(s[0], { ascending: s[1] }); });
    return Promise.resolve(q).then(function (r) {
      if (r.error || !Array.isArray(r.data)) return;
      hedef.splice.apply(hedef, [0, hedef.length].concat(r.data.map(esle)));
    }).catch(function () {});
  }

  var isler = [];
  if (typeof ETKINLIKLER !== "undefined") {
    isler.push(cek("etkinlikler", [["tarih", false]], ETKINLIKLER, function (e) {
      return {
        baslik: e.baslik, tarih: e.tarih, saat: e.saat || "", yer: e.yer || "",
        tur: e.tur, one: !!e.one, ozet: e.ozet || "", etiketler: e.etiketler || [],
        link: e.link || "", gorsel: e.gorsel || ""
      };
    }));
  }
  if (typeof SPONSORLAR !== "undefined") {
    isler.push(cek("sponsorlar", [["sira", true], ["created_at", true]], SPONSORLAR, function (s) {
      return { ad: s.ad, kademe: s.kademe, yil: s.yil || "", aktif: !!s.aktif, logo: s.logo || "", site: s.site || "" };
    }));
  }
  if (typeof YONETIM !== "undefined") {
    isler.push(cek("yonetim", [["sira", true], ["created_at", true]], YONETIM, function (u) {
      return { ad: u.ad, gorev: u.gorev, bolum: u.bolum || "", foto: u.foto || "", linkedin: u.linkedin || "", github: u.github || "", eposta: "" };
    }));
  }

  if (typeof PROJELER !== "undefined") {
    isler.push(cek("projeler", [["sira", true], ["created_at", true]], PROJELER, function (p) {
      return { ad: p.ad, ozet: p.ozet || "", etiketler: p.etiketler || [], durum: p.durum };
    }));
  }
  if (typeof ARSIV !== "undefined") {
    isler.push(cek("arsiv", [["sira", true], ["created_at", true]], ARSIV, function (a) {
      return {
        donem: a.donem, ozet: a.ozet || "",
        sayilar: { etkinlik: a.etkinlik_sayisi, katilimci: a.katilimci_sayisi, proje: a.proje_sayisi },
        kayitlar: Array.isArray(a.kayitlar) ? a.kayitlar : []
      };
    }));
  }

  // main.js en fazla 4 sn bekler; yavaş bağlantıda site yine açılır
  var zaman = new Promise(function (res) { setTimeout(res, 4000); });
  window.KOUAI_ICERIK_HAZIR = Promise.race([Promise.all(isler), zaman]);
})();