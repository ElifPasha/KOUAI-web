/* =====================================================================
   KOUAI — İletişim formunu Supabase'e bağlar.
   main.js'teki mailto davranışını yakalayıp değiştirir; Supabase ayarı
   yapılmamışsa eski e-posta yöntemi aynen çalışmaya devam eder.
   ===================================================================== */
(function () {
  "use strict";
  var cfg = window.KOUAI_SUPABASE || {};
  var hazir = cfg.url && cfg.anonKey && !/PROJE-KODUN|ANON-ANAHTARIN/.test(cfg.url + cfg.anonKey) && window.supabase;
  if (!hazir) return; // main.js'in mailto akışı devrede kalır

  var db = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false } });
  var BEKLEME_MS = 60 * 1000;

  function durumYaz(metin) {
    var d = document.getElementById("form-durum");
    if (!d) return;
    d.textContent = metin;
    d.classList.add("is-visible");
  }

  // main.js'in form dinleyicisinden önce çalışması için belge düzeyinde, capture aşamasında dinle
  document.addEventListener("submit", async function (e) {
    var form = e.target;
    if (!form || form.id !== "iletisim-formu") return;
    e.preventDefault();
    e.stopImmediatePropagation();

    var btn = form.querySelector('button[type="submit"]');
    var v = new FormData(form);

    // Honeypot: gerçek kullanıcı bu alanı görmez
    if ((v.get("website") || "").toString().trim()) {
      durumYaz("Mesajın alındı. Teşekkürler!");
      form.reset();
      return;
    }

    // Basit istemci tarafı bekleme süresi (asıl sınırlama sunucu tarafında olmalı)
    var son = 0;
    try { son = +localStorage.getItem("kouai-son-gonderim") || 0; } catch (err) {}
    if (Date.now() - son < BEKLEME_MS) {
      durumYaz("Çok hızlı gönderiyorsun. Lütfen bir dakika sonra tekrar dene.");
      return;
    }

    var kayit = {
      ad: (v.get("ad") || "").toString().trim(),
      eposta: (v.get("eposta") || "").toString().trim(),
      konu: (v.get("konu") || "Diğer").toString(),
      mesaj: (v.get("mesaj") || "").toString().trim(),
    };

    if (kayit.ad.length < 2 || kayit.mesaj.length < 5 || !form.eposta.validity.valid) {
      durumYaz("Lütfen adını, geçerli bir e-posta adresini ve en az 5 karakterlik bir mesaj yaz.");
      return;
    }

    if (btn) btn.disabled = true;
    // Not: .select() çağırmıyoruz; anon rolü okuma yetkisine sahip değil.
    var sonuc = await db.from("basvurular").insert(kayit);
    if (btn) btn.disabled = false;

    if (sonuc.error) {
      console.error("Başvuru gönderilemedi:", sonuc.error.message);
      durumYaz("Mesajın gönderilemedi. Lütfen biraz sonra tekrar dene ya da bize e-posta ile ulaş.");
      return;
    }
    try { localStorage.setItem("kouai-son-gonderim", String(Date.now())); } catch (err) {}
    durumYaz("Mesajın bize ulaştı. En kısa sürede dönüş yapacağız. Teşekkürler!");
    form.reset();
  }, true);

  // Honeypot alanını forma ekle (ekranda görünmez, klavye ile erişilemez)
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("iletisim-formu");
    if (!form || form.querySelector('[name="website"]')) return;
    var w = document.createElement("div");
    w.setAttribute("aria-hidden", "true");
    w.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden";
    w.innerHTML = '<label>Web sitesi<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(w);
  });
})();
