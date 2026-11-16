/* yogunluk-saatleri — Yoğunluk Saatleri — gün sekmeli saatlik doluluk sütunları, «şu an» işareti (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Gün sekmeleri (açılışta bugün) ve seçili günün saatlik yoğunluk sütun grafiği: sütun yüksekliği doluluk yüzdesi, üç ton (sakin · orta · yoğun), bugünse geçerli saatin sütununda «şu an» etiketi; altında en sakin / en yoğun saat özeti ve gün notu. Kayıt alanları: `gun` (1–7 ISO) · `saatler` (açılış saatinden başlayan 0–100 dizisi). JS yokken tüm günlerin küçük grafikleri başlıklı olarak alt alta.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-yogunluk-saatleri";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: yogunluk-saatleri --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const AC = Math.max(0, Math.min(23, Math.round(Number(pick(des.acilis)) || 0)));
    const deg = (i) => {
      const v = R[i] ? ilk(R[i], ["saatler", "yogunluk", "hours"]) : "";
      const a = Array.isArray(v) ? v : String(pick(v) || "").split(",").filter((z) => z.trim() !== "");
      return a.slice(0, 24).map((n) => { const z = Number(typeof n === "number" ? n : String(n).trim()); return Number.isFinite(z) ? Math.max(0, Math.min(100, Math.round(z))) : 0; });
    };
    const yuz = (v) => { try { return new Intl.NumberFormat(dil || undefined, { style: "percent" }).format(v / 100); } catch (e) { return v + "%"; } };
    const st = (h) => `${String((AC + h) % 24).padStart(2, "0")}:00`;
    const SA = metinAl(des, ["sakinAd"]);
    const YA = metinAl(des, ["yogunAd"]);
    const SM = metinAl(des, ["simdiAd"]);
    const id = (t, j) => `${P}-{{id}}-${t}${j}`;
    const G = A.map((k, i) => { const iso = Number(x(i, ["gun", "day"])); return { k, V: deg(i), iso: Number.isInteger(iso) && iso >= 1 && iso <= 7 ? iso : 0 }; });
    const cok = G.length > 1;
    const sekme = cok ? `<div class="${P}-gunler" role="tablist" aria-label="${esc(metinAl(des, ["gunAd"]) || B.baslik)}">${G.map((g, j) => `<button type="button" role="tab" class="${P}-gsek" id="${id("t", j)}" aria-controls="${id("p", j)}" aria-selected="${j === 0}"${j ? ' tabindex="-1"' : ""} data-ygun="${j}" data-iso="${g.iso || ""}">${esc(g.k.baslik)}</button>`).join("")}</div>` : "";
    const panel = (g, j) => {
      const V = g.V;
      let mn = -1;
      let mx = -1;
      V.forEach((v, h) => { if (mn === -1 || v < V[mn]) mn = h; if (mx === -1 || v > V[mx]) mx = h; });
      const ozet = V.length ? [SA ? `<span class="${P}-oz">${ikonH("airline_seat_recline_normal", `${P}-ozik`)}${esc(SA)} <bdi dir="ltr">${st(mn)}</bdi></span>` : "", YA ? `<span class="${P}-oz">${ikonH("groups", `${P}-ozik`)}${esc(YA)} <bdi dir="ltr">${st(mx)}</bdi></span>` : ""].join("") : "";
      const sutun = V.map((v, h) => `<li class="${P}-sutun${v >= 70 ? ` ${P}-sutun--cok` : v >= 40 ? ` ${P}-sutun--orta` : ""}" data-saat="${(AC + h) % 24}" style="--fb-h: ${v}%"><span class="${P}-cubuk"></span><span class="${P}-saat" aria-hidden="true"><bdi dir="ltr">${String((AC + h) % 24).padStart(2, "0")}</bdi></span><span class="${P}-gizli"><bdi dir="ltr">${st(h)}</bdi> ${esc(yuz(v))}</span></li>`).join("");
      return `<div class="${P}-gun"${cok ? ` role="tabpanel" id="${id("p", j)}" aria-labelledby="${id("t", j)}" tabindex="0"` : ""} data-iso="${g.iso || ""}"><h3 class="${P}-gbas">${esc(g.k.baslik)}</h3>${V.length ? `<div class="${P}-grafik"><ol class="${P}-sutunlar" role="list">${sutun}</ol></div>` : ""}${ozet || g.k.metin ? `<div class="${P}-alt">${ozet}${g.k.metin ? `<p class="${P}-gnot">${satirlar(g.k.metin)}</p>` : ""}</div>` : ""}${SM && V.length ? `<span class="${P}-simdi" data-simdi hidden>${esc(SM)}</span>` : ""}</div>`;
    };
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div><div class="${P}-pano">${sekme}<div class="${P}-paneller">${G.map(panel).join("")}</div></div>${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
