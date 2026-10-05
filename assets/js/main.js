/* =====================================================================
   KOUAI — Site davranışları
   Tema, menü, animasyonlar ve data.js içeriğinin sayfaya basılması.
   ===================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const AYLAR = ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"];
  const AYLAR_UZUN = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const TUR_ADI = {
    egitim: "Eğitim",
    seminer: "Seminer",
    atolye: "Atölye",
    yarisma: "Yarışma",
    sosyal: "Sosyal",
  };
  const KADEME_ADI = {
    ana: "Ana Sponsorlar",
    altin: "Altın Sponsorlar",
    gumus: "Gümüş Sponsorlar",
    destek: "Destekçiler",
  };

  /* --- Küçük yardımcılar ------------------------------------------- */
  const kacis = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const basHarfler = (ad) =>
    String(ad || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0] || "")
      .join("")
      .toLocaleUpperCase("tr-TR");

  const ikon = (yol, boyut) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${boyut || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${yol}</svg>`;

  const IKONLAR = {
    takvim: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    saat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
    konum: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    yukari: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
  };

  /* =================================================================
     1. TEMA
     ================================================================= */
  function temayiKur() {
    const kok = document.documentElement;
    const dugme = $(".theme-toggle");
    if (!dugme) return;

    const uygula = (tema) => {
      kok.setAttribute("data-theme", tema);
      dugme.setAttribute("aria-label", tema === "dark" ? "Açık temaya geç" : "Koyu temaya geç");
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", tema === "dark" ? "#0B0817" : "#FFFFFF");
      try { localStorage.setItem("kouai-tema", tema); } catch (e) {}
    };

    dugme.addEventListener("click", () => {
      uygula(kok.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    // Kullanıcı seçim yapmadıysa sistem temasını takip et
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const dinleyici = (e) => {
      let secili = null;
      try { secili = localStorage.getItem("kouai-tema"); } catch (err) {}
      if (!secili) kok.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", dinleyici);

    uygula(kok.getAttribute("data-theme") || "light");
  }

  /* =================================================================
     2. MENÜ, KAYDIRMA ÇUBUĞU, YUKARI DÖN
     ================================================================= */
  function navigasyonuKur() {
    const header = $(".header");
    const burger = $(".burger");
    const mobil = $(".mobile-nav");
    const ilerleme = $(".scroll-progress");
    const yukari = $(".to-top");

    if (burger && mobil) {
      const kapat = () => {
        burger.setAttribute("aria-expanded", "false");
        mobil.classList.remove("is-open");
      };
      burger.addEventListener("click", () => {
        const acik = burger.getAttribute("aria-expanded") === "true";
        burger.setAttribute("aria-expanded", String(!acik));
        mobil.classList.toggle("is-open", !acik);
      });
      $$("a", mobil).forEach((a) => a.addEventListener("click", kapat));
      document.addEventListener("keydown", (e) => e.key === "Escape" && kapat());
      window.addEventListener("resize", () => window.innerWidth > 860 && kapat());
    }

    let bekliyor = false;
    const guncelle = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 20);
      if (yukari) yukari.classList.toggle("is-visible", y > 600);
      if (ilerleme) {
        const yukseklik = document.documentElement.scrollHeight - window.innerHeight;
        ilerleme.style.transform = `scaleX(${yukseklik > 0 ? Math.min(y / yukseklik, 1) : 0})`;
      }
      bekliyor = false;
    };
    window.addEventListener("scroll", () => {
      if (!bekliyor) { bekliyor = true; requestAnimationFrame(guncelle); }
    }, { passive: true });
    guncelle();

    if (yukari) {
      yukari.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: azHareket ? "auto" : "smooth" })
      );
    }
  }

  /* =================================================================
     3. GÖRÜNÜRLÜK ANİMASYONLARI + SAYAÇLAR
     ================================================================= */
  function animasyonlariKur() {
    const hedefler = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || azHareket) {
      hedefler.forEach((el) => el.classList.add("is-visible"));
      $$("[data-count]").forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
      return;
    }

    const gozlemci = new IntersectionObserver(
      (girdiler) => {
        girdiler.forEach((g) => {
          if (!g.isIntersecting) return;
          g.target.classList.add("is-visible");
          gozlemci.unobserve(g.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    hedefler.forEach((el) => gozlemci.observe(el));

    const sayacGozlemci = new IntersectionObserver(
      (girdiler) => {
        girdiler.forEach((g) => {
          if (!g.isIntersecting) return;
          sayacCalistir(g.target);
          sayacGozlemci.unobserve(g.target);
        });
      },
      { threshold: 0.5 }
    );
    $$("[data-count]").forEach((el) => sayacGozlemci.observe(el));
  }

  function sayacCalistir(el) {
    const hedef = parseFloat(el.dataset.count) || 0;
    const sonek = el.dataset.suffix || "";
    const sure = 1600;
    const baslangic = performance.now();
    const adim = (simdi) => {
      const t = Math.min((simdi - baslangic) / sure, 1);
      const yumusak = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(hedef * yumusak).toLocaleString("tr-TR") + (t === 1 ? sonek : "");
      if (t < 1) requestAnimationFrame(adim);
    };
    requestAnimationFrame(adim);
  }

  /* =================================================================
     4. KART ÜZERİ IŞIK EFEKTİ
     ================================================================= */
  function kartIsigiKur() {
    if (azHareket) return;
    document.addEventListener("mousemove", (e) => {
      const kart = e.target.closest(".card");
      if (!kart) return;
      const r = kart.getBoundingClientRect();
      kart.style.setProperty("--mx", `${e.clientX - r.left}px`);
      kart.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }

  /* =================================================================
     5. SİNİR AĞI ARKA PLANI (hero)
     ================================================================= */
  function sinirAgiKur() {
    const canvas = $("#neural-canvas");
    if (!canvas || azHareket) return;

    const ctx = canvas.getContext("2d");
    let genislik = 0, yukseklik = 0, oran = 1;
    let dugumler = [];
    let cerceve = null;
    const fare = { x: -9999, y: -9999 };

    const renkler = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        cizgi: s.getPropertyValue("--net-line").trim() || "rgba(124,58,237,.25)",
        nokta: s.getPropertyValue("--net-dot").trim() || "rgba(139,92,246,.7)",
      };
    };
    let renk = renkler();

    function olcekle() {
      const r = canvas.getBoundingClientRect();
      oran = Math.min(window.devicePixelRatio || 1, 2);
      genislik = r.width;
      yukseklik = r.height;
      canvas.width = Math.round(genislik * oran);
      canvas.height = Math.round(yukseklik * oran);
      ctx.setTransform(oran, 0, 0, oran, 0, 0);

      const adet = Math.min(Math.round((genislik * yukseklik) / 16000), 90);
      dugumler = Array.from({ length: adet }, () => ({
        x: Math.random() * genislik,
        y: Math.random() * yukseklik,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.7 + 1,
      }));
    }

    function ciz() {
      ctx.clearRect(0, 0, genislik, yukseklik);
      const mesafe = 130;

      for (let i = 0; i < dugumler.length; i++) {
        const a = dugumler[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -20) a.x = genislik + 20;
        if (a.x > genislik + 20) a.x = -20;
        if (a.y < -20) a.y = yukseklik + 20;
        if (a.y > yukseklik + 20) a.y = -20;

        // Fareden hafif kaçış
        const fdx = a.x - fare.x, fdy = a.y - fare.y;
        const fd = Math.hypot(fdx, fdy);
        if (fd < 120 && fd > 0.1) {
          a.x += (fdx / fd) * 0.8;
          a.y += (fdy / fd) * 0.8;
        }

        for (let j = i + 1; j < dugumler.length; j++) {
          const b = dugumler[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > mesafe) continue;
          ctx.globalAlpha = 1 - d / mesafe;
          ctx.strokeStyle = renk.cizgi;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.fillStyle = renk.nokta;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      cerceve = requestAnimationFrame(ciz);
    }

    olcekle();
    ciz();

    let zamanlayici;
    window.addEventListener("resize", () => {
      clearTimeout(zamanlayici);
      zamanlayici = setTimeout(olcekle, 180);
    });
    window.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      fare.x = e.clientX - r.left;
      fare.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener("mouseout", () => { fare.x = -9999; fare.y = -9999; });

    // Sekme arkaplandayken durdur
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(cerceve); cerceve = null; }
      else if (!cerceve) ciz();
    });

    // Tema değişince çizgi rengini tazele
    new MutationObserver(() => { renk = renkler(); }).observe(document.documentElement, {
      attributes: true, attributeFilter: ["data-theme"],
    });
  }

  /* =================================================================
     6. ETKİNLİKLER
     ================================================================= */
  function etkinlikKarti(e) {
    const t = new Date(e.tarih + "T00:00:00");
    const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    const gecmis = t < bugun;
    const gunFark = Math.round((t - bugun) / 86400000);

    let rozet = '<span class="badge badge--past">Tamamlandı</span>';
    if (!gecmis) {
      rozet = gunFark === 0
        ? '<span class="badge badge--live">Bugün</span>'
        : `<span class="badge badge--soon">${gunFark} gün kaldı</span>`;
    }

    const meta = [
      { i: IKONLAR.takvim, t: `${t.getDate()} ${AYLAR_UZUN[t.getMonth()]} ${t.getFullYear()}` },
      e.saat ? { i: IKONLAR.saat, t: e.saat } : null,
      e.yer ? { i: IKONLAR.konum, t: e.yer } : null,
    ].filter(Boolean);

    return `
      <article class="event-card ${gecmis ? "is-past" : ""}" data-tur="${kacis(e.tur)}" data-durum="${gecmis ? "gecmis" : "yaklasan"}" data-reveal>
        <div class="event-date">
          <span class="d">${String(t.getDate()).padStart(2, "0")}</span>
          <span class="m">${AYLAR[t.getMonth()]}</span>
          <span class="y">${t.getFullYear()}</span>
        </div>
        <div>
          ${rozet}
          <h3>${kacis(e.baslik)}</h3>
          <p>${kacis(e.ozet)}</p>
          <div class="event-meta">
            ${meta.map((m) => `<span>${ikon(m.i)}${kacis(m.t)}</span>`).join("")}
          </div>
          <div class="tag-list">
            <span class="tag">${kacis(TUR_ADI[e.tur] || e.tur)}</span>
            ${(e.etiketler || []).map((x) => `<span class="tag">${kacis(x)}</span>`).join("")}
          </div>
          ${e.link ? `<p style="margin-top:16px"><a class="link-arrow" href="${kacis(e.link)}" target="_blank" rel="noopener">Detaylar ve kayıt ${ikon(IKONLAR.ok)}</a></p>` : ""}
        </div>
      </article>`;
  }

  function etkinlikleriBas() {
    if (typeof ETKINLIKLER === "undefined") return;
    const bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    const tarihli = ETKINLIKLER.slice().map((e) => ({ ...e, _t: new Date(e.tarih + "T00:00:00") }));

    // Ana sayfa: öne çıkanlar
    const one = $("#one-cikan-etkinlikler");
    if (one) {
      const secim = tarihli
        .filter((e) => e.one)
        .sort((a, b) => a._t - b._t)
        .slice(0, 3);
      one.innerHTML = secim.length
        ? secim.map(etkinlikKarti).join("")
        : '<p class="empty-state">Yakında yeni etkinlikler duyurulacak.</p>';
    }

    // Etkinlikler sayfası
    const liste = $("#etkinlik-listesi");
    if (!liste) return;

    const yaklasan = tarihli.filter((e) => e._t >= bugun).sort((a, b) => a._t - b._t);
    const gecmisler = tarihli.filter((e) => e._t < bugun).sort((a, b) => b._t - a._t);
    liste.innerHTML = yaklasan.concat(gecmisler).map(etkinlikKarti).join("");

    const sayac = $("#etkinlik-sayac");
    if (sayac) sayac.textContent = `${yaklasan.length} yaklaşan · ${gecmisler.length} geçmiş etkinlik`;

    // Filtreler
    const butonlar = $$(".filter-btn", $("#etkinlik-filtreleri"));
    const bos = $("#etkinlik-bos");
    const filtrele = (deger) => {
      let gorunen = 0;
      $$(".event-card", liste).forEach((kart) => {
        const uyar =
          deger === "tumu" ||
          kart.dataset.tur === deger ||
          kart.dataset.durum === deger;
        kart.style.display = uyar ? "" : "none";
        if (uyar) gorunen++;
      });
      if (bos) bos.style.display = gorunen ? "none" : "";
    };
    butonlar.forEach((b) => {
      b.addEventListener("click", () => {
        butonlar.forEach((x) => {
          x.classList.toggle("is-active", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        filtrele(b.dataset.filtre);
      });
    });
  }

  /* =================================================================
     7. YÖNETİM KURULU
     ================================================================= */
  function yonetimiBas() {
    const kap = $("#yonetim-listesi");
    if (!kap || typeof YONETIM === "undefined") return;

    const sosyal = (u) => {
      const parcalar = [];
      if (u.linkedin) parcalar.push(`<a href="${kacis(u.linkedin)}" target="_blank" rel="noopener" aria-label="${kacis(u.ad)} LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.4 8.75 22 11 22 14v7h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21h-4V9Z"/></svg></a>`);
      if (u.github) parcalar.push(`<a href="${kacis(u.github)}" target="_blank" rel="noopener" aria-label="${kacis(u.ad)} GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.8c.85 0 1.7.12 2.5.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg></a>`);
      if (u.eposta) parcalar.push(`<a href="mailto:${kacis(u.eposta)}" aria-label="${kacis(u.ad)} e-posta">${ikon('<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/>')}</a>`);
      return parcalar.length ? `<div class="member__social">${parcalar.join("")}</div>` : "";
    };

    kap.innerHTML = YONETIM.map((u, i) => `
      <article class="member" data-reveal style="--delay:${i * 55}ms">
        <div class="member__avatar">
          ${u.foto ? `<img src="${kacis(u.foto)}" alt="${kacis(u.ad)}" loading="lazy">` : kacis(basHarfler(u.ad))}
        </div>
        <h3>${kacis(u.ad)}</h3>
        <p class="role">${kacis(u.gorev)}</p>
        <p class="dept">${kacis(u.bolum)}</p>
        ${sosyal(u)}
      </article>`).join("");
  }

  /* =================================================================
     8. SPONSORLAR
     ================================================================= */
  function sponsorKarti(s, i) {
    const ic = s.logo
      ? `<img src="${kacis(s.logo)}" alt="${kacis(s.ad)} logosu" loading="lazy">`
      : kacis(basHarfler(s.ad));
    const govde = `
      <div class="sponsor-card__logo">${ic}</div>
      <strong>${kacis(s.ad)}</strong>
      <span class="year">${kacis(s.yil)}</span>`;
    return s.site
      ? `<a class="sponsor-card" href="${kacis(s.site)}" target="_blank" rel="noopener" data-reveal style="--delay:${i * 45}ms">${govde}</a>`
      : `<div class="sponsor-card" data-reveal style="--delay:${i * 45}ms">${govde}</div>`;
  }

  function kademeBloklari(liste) {
    return ["ana", "altin", "gumus", "destek"]
      .map((k) => {
        const grup = liste.filter((s) => s.kademe === k);
        if (!grup.length) return "";
        return `
          <section class="sponsor-tier">
            <div class="tier-head">
              <h3>${KADEME_ADI[k]}</h3>
              <span class="count">${grup.length}</span>
            </div>
            <div class="grid grid-4">${grup.map(sponsorKarti).join("")}</div>
          </section>`;
      })
      .join("");
  }

  function sponsorlariBas() {
    if (typeof SPONSORLAR === "undefined") return;

    const aktif = $("#sponsor-aktif");
    if (aktif) aktif.innerHTML = kademeBloklari(SPONSORLAR.filter((s) => s.aktif));

    const gecmis = $("#sponsor-gecmis");
    if (gecmis) {
      const liste = SPONSORLAR.filter((s) => !s.aktif);
      gecmis.innerHTML = liste.length
        ? `<div class="grid grid-4">${liste.map(sponsorKarti).join("")}</div>`
        : '<p class="empty-state">Henüz arşive düşen sponsorluk kaydı yok.</p>';
    }

    // Ana sayfadaki kayan şerit
    const serit = $("#sponsor-serit");
    if (serit) {
      const adlar = SPONSORLAR.filter((s) => s.aktif).map((s) => s.ad);
      const parca = adlar.map((a) => `<span class="marquee__item">${kacis(a)}</span>`).join("");
      serit.innerHTML = parca + parca; // kesintisiz döngü için iki kopya
    }
  }

  /* =================================================================
     9. ARŞİV
     ================================================================= */
  function arsiviBas() {
    const kap = $("#arsiv-listesi");
    if (!kap || typeof ARSIV === "undefined") return;

    kap.innerHTML = ARSIV.map((d, i) => `
      <div class="acc-item" data-reveal style="--delay:${i * 60}ms">
        <button class="acc-btn" type="button" aria-expanded="${i === 0}" aria-controls="arsiv-panel-${i}">
          <div>
            <h3>${kacis(d.donem)} Dönemi</h3>
            <div class="meta">
              <span>${d.sayilar.etkinlik} etkinlik</span>
              <span>${d.sayilar.katilimci.toLocaleString("tr-TR")} katılımcı</span>
              <span>${d.sayilar.proje} proje</span>
            </div>
          </div>
          <span class="chev">${ikon(IKONLAR.chevron)}</span>
        </button>
        <div class="acc-panel ${i === 0 ? "is-open" : ""}" id="arsiv-panel-${i}">
          <div><div class="inner">
            <p style="color:var(--muted);margin-bottom:18px">${kacis(d.ozet)}</p>
            <div class="timeline">
              ${d.kayitlar.map((k) => `
                <div class="timeline__item">
                  <h3>${kacis(k.ad)}</h3>
                  <p>${kacis(k.not)}</p>
                </div>`).join("")}
            </div>
          </div></div>
        </div>
      </div>`).join("");

    $$(".acc-btn", kap).forEach((btn) => {
      btn.addEventListener("click", () => {
        const acik = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!acik));
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-open", !acik);
      });
    });
  }

  /* =================================================================
     10. PROJELER
     ================================================================= */
  function projeleriBas() {
    const kap = $("#proje-listesi");
    if (!kap || typeof PROJELER === "undefined") return;

    kap.innerHTML = PROJELER.map((p, i) => `
      <article class="card card--feature" data-reveal style="--delay:${i * 70}ms">
        <span class="num">${String(i + 1).padStart(2, "0")} / ${kacis(p.durum)}</span>
        <h3>${kacis(p.ad)}</h3>
        <p>${kacis(p.ozet)}</p>
        <div class="tag-list">${(p.etiketler || []).map((t) => `<span class="tag">${kacis(t)}</span>`).join("")}</div>
      </article>`).join("");
  }

  /* =================================================================
     10b. LOGO — vektör amblemi çizer ve animasyonlarını kurar
     -----------------------------------------------------------------
     [data-logo="amblem"]  → yalnızca amblem (menü, alt bilgi)
     [data-logo="kilit"]   → amblem + KOUAI kelime markası
     [data-logo-orbit]     → çevresinde dönen düğüm halkası (hero)
     ================================================================= */
  function logolariBas() {
    if (typeof KOUAI_LOGO === "undefined") return;
    var sayac = 0;

    $$("[data-logo]").forEach((el) => {
      const tip = el.dataset.logo === "kilit" ? KOUAI_LOGO.kilit : KOUAI_LOGO.amblem;
      const id = "kl" + (sayac++);
      const yorunge = el.hasAttribute("data-logo-orbit");

      // Amblemin çevresinde dönen düğümler (yalnızca istenirse)
      let orbit = "";
      if (yorunge && !azHareket) {
        const cx = tip.w / 2, cy = tip.h / 2;
        const r = Math.max(tip.w, tip.h) * 0.62;
        let noktalar = "";
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          noktalar += `<circle cx="${(cx + Math.cos(a) * r).toFixed(2)}" cy="${(cy + Math.sin(a) * r * 0.78).toFixed(2)}" r="${(1.6 + (i % 3) * 0.5).toFixed(2)}"/>`;
        }
        orbit = `<g class="kl__orbit" fill="currentColor" style="transform-origin:${cx}px ${cy}px">${noktalar}</g>`;
      }

      // Yörünge halkası varsa görüş alanını genişlet, yoksa amblemi tam doldur
      const p = yorunge ? 0.30 : 0;
      const vb = `${(-tip.w * p).toFixed(2)} ${(-tip.h * p * 0.9).toFixed(2)} ${(tip.w * (1 + 2 * p)).toFixed(2)} ${(tip.h * (1 + 1.8 * p)).toFixed(2)}`;

      el.innerHTML = `
        <svg class="kl" viewBox="${vb}" style="--kw:${tip.w}" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="${id}-c"><path clip-rule="evenodd" d="${tip.d}"/></clipPath>
            <linearGradient id="${id}-g" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" stop-color="currentColor" stop-opacity="1"/>
              <stop offset="1" stop-color="currentColor" stop-opacity="0.86"/>
            </linearGradient>
            <linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#fff" stop-opacity="0"/>
              <stop offset="0.5" stop-color="#fff" stop-opacity="0.9"/>
              <stop offset="1" stop-color="#fff" stop-opacity="0"/>
            </linearGradient>
          </defs>
          ${orbit}
          <g clip-path="url(#${id}-c)">
            <rect class="kl__fill" x="0" y="0" width="${tip.w}" height="${tip.h}" fill="url(#${id}-g)"/>
            <rect class="kl__sheen" x="0" y="0" width="${(tip.w * 0.34).toFixed(2)}" height="${tip.h}" fill="url(#${id}-s)"/>
          </g>
        </svg>`;
    });
  }

  /* =================================================================
     11. KULÜP BİLGİLERİ (iletişim / sosyal bağlantılar)
     ================================================================= */
  function kulupBilgileriniBas() {
    if (typeof KULUP === "undefined") return;

    $$("[data-kulup]").forEach((el) => {
      const deger = KULUP[el.dataset.kulup];
      if (!deger) return;
      if (el.tagName === "A") {
        el.setAttribute("href", el.dataset.kulup === "eposta" ? `mailto:${deger}` : deger);
        if (!el.textContent.trim()) el.textContent = deger;
      } else {
        el.textContent = deger;
      }
    });

    const yil = $("#yil");
    if (yil) yil.textContent = new Date().getFullYear();
  }

  /* =================================================================
     12. İLETİŞİM FORMU  (sunucu yok → e-posta istemcisine aktarır)
     ================================================================= */
  function formuKur() {
    const form = $("#iletisim-formu");
    if (!form) return;
    const durum = $("#form-durum");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const veri = new FormData(form);
      const ad = (veri.get("ad") || "").toString().trim();
      const eposta = (veri.get("eposta") || "").toString().trim();
      const konu = (veri.get("konu") || "Genel").toString();
      const mesaj = (veri.get("mesaj") || "").toString().trim();

      const govde = `Ad Soyad: ${ad}\nE-posta: ${eposta}\nKonu: ${konu}\n\n${mesaj}`;
      const hedef = (typeof KULUP !== "undefined" && KULUP.eposta) || "";
      window.location.href =
        `mailto:${hedef}?subject=${encodeURIComponent("[Web] " + konu + " — " + ad)}&body=${encodeURIComponent(govde)}`;

      if (durum) {
        durum.textContent = "E-posta uygulaman açılıyor. Açılmazsa mesajını doğrudan " + hedef + " adresine gönderebilirsin.";
        durum.classList.add("is-visible");
      }
      form.reset();
    });
  }

  /* =================================================================
     Başlat
     ================================================================= */
  function baslat() {
    temayiKur();
    logolariBas();
    navigasyonuKur();
    kulupBilgileriniBas();
    etkinlikleriBas();
    yonetimiBas();
    sponsorlariBas();
    arsiviBas();
    projeleriBas();
    formuKur();
    kartIsigiKur();
    sinirAgiKur();
    animasyonlariKur(); // içerik basıldıktan sonra çalışmalı
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
})();
