import { useState, useRef, useEffect, useCallback } from "react";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const PRODUITS = [
  { nom: "iPhone 15 Pro Max", emoji: "📱", prix: "950 000" },
  { nom: "iPhone 15 Pro", emoji: "📱", prix: "850 000" },
  { nom: "iPhone 15", emoji: "📱", prix: "700 000" },
  { nom: "iPhone 14 Pro Max", emoji: "📱", prix: "750 000" },
  { nom: "iPhone 14 Pro", emoji: "📱", prix: "650 000" },
  { nom: "iPhone 14", emoji: "📱", prix: "550 000" },
  { nom: "iPhone 13", emoji: "📱", prix: "400 000" },
  { nom: "MacBook Air M2", emoji: "💻", prix: "900 000" },
  { nom: "MacBook Pro M3", emoji: "💻", prix: "1 400 000" },
  { nom: "AirPods Pro 2", emoji: "🎧", prix: "180 000" },
  { nom: "iPad Air", emoji: "📲", prix: "450 000" },
  { nom: "Personnalisé", emoji: "📦", prix: "" },
];

const THEMES = {
  blue: { bg: ["#0500CC", "#1400FF", "#3355FF"], text: "#FFFFFF", accent: "#FFFFFF", light: false },
  dark: { bg: ["#0A0A0F", "#13131A", "#1C1C2E"], text: "#FFFFFF", accent: "#6680FF", light: false },
  gradient: { bg: ["#1400FF", "#7700CC", "#CC0000"], text: "#FFFFFF", accent: "#FFFFFF", light: false },
  white: { bg: ["#F0F0F5", "#FFFFFF", "#E8E8F5"], text: "#0A0A0F", accent: "#1400FF", light: true },
  gold: { bg: ["#1A1200", "#2A1E00", "#3D2D00"], text: "#FFD700", accent: "#FFD700", light: false },
};

const TYPES = [
  { id: "promo", label: "Promo produit", icon: "📱", badge: "DISPONIBLE", badgeColor: "#00E676" },
  { id: "arrivage", label: "Nouvelle arrivée", icon: "📦", badge: "NOUVEAU", badgeColor: "#FF9F0A" },
  { id: "conseil", label: "Conseil tech", icon: "💡", badge: "CONSEIL", badgeColor: "#6680FF" },
  { id: "offre", label: "Offre spéciale", icon: "🔥", badge: "OFFRE LIMITÉE", badgeColor: "#FF453A" },
  { id: "tabaski", label: "Tabaski / Fête", icon: "🎉", badge: "SPÉCIAL FÊTE", badgeColor: "#FF9F0A" },
];

const BADGES_DISPO = ["✅ AUTHENTIQUE", "🚚 LIVRAISON", "💳 WAVE/OM", "📞 WHATSAPP", "🔥 PROMO", "⭐ NEUF", "🛡 GARANTI"];
const FORMATS = [
  { id: "story", label: "Story", ratio: "9:16", w: 1080, h: 1920, display: 400 },
  { id: "carre", label: "Carré", ratio: "1:1", w: 1080, h: 1080, display: 500 },
  { id: "paysage", label: "Paysage", ratio: "16:9", w: 1920, h: 1080, display: 600 },
];

// ─── LOGO SVG ANGY ────────────────────────────────────────────────────────────
const AngyLogoSVG = ({ width = 160, dark = false }) => (
  <svg width={width} viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="18" width="14" height="68" fill="#1400FF"/>
    <rect x="8" y="72" width="62" height="14" fill="#1400FF"/>
    {[["A",55],["N",100],["G",145],["Y",190]].map(([l,cx])=>(
      <g key={l}>
        <circle cx={cx} cy="52" r="24" fill={dark?"#FFFFFF":"#0A0A0F"} stroke={dark?"#FFFFFF":"#0A0A0F"} strokeWidth="2"/>
        <text x={cx} y="60" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" fill={dark?"#0A0A0F":"#FFFFFF"}>{l}</text>
      </g>
    ))}
    <text x="228" y="63" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="36" fill={dark?"#FFFFFF":"#0A0A0F"}>Company</text>
    <rect x="412" y="18" width="14" height="42" fill="#CC0000"/>
    <rect x="354" y="18" width="72" height="14" fill="#CC0000"/>
  </svg>
);

// ─── DESSIN CANVAS ────────────────────────────────────────────────────────────
function drawVisual(canvas, config) {
  const { produit, prix, specs, accroche, emoji, theme: themeKey, type, badges, format } = config;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const T = THEMES[themeKey];
  const typeObj = TYPES.find(t => t.id === type) || TYPES[0];

  // BG
  const grad = ctx.createLinearGradient(0, 0, W, H);
  T.bg.forEach((c, i) => grad.addColorStop(i / (T.bg.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // CERCLES DÉCO
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = T.light ? "#000000" : "#FFFFFF";
  ctx.beginPath(); ctx.arc(W * 0.88, H * 0.12, W * 0.42, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(W * 0.08, H * 0.88, W * 0.28, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // LOGO ANGY (texte dessiné)
  const lx = W * 0.06, ly = H * 0.04;
  const lSize = W * 0.04;

  // Crochets logo
  ctx.fillStyle = "#1400FF";
  ctx.fillRect(lx, ly, lSize * 0.35, lSize * 1.8);
  ctx.fillRect(lx, ly + lSize * 1.45, lSize * 1.5, lSize * 0.35);
  ctx.fillStyle = "#CC0000";
  ctx.fillRect(lx + W * 0.28, ly, lSize * 1.8, lSize * 0.35);
  ctx.fillRect(lx + W * 0.28 + lSize * 1.45, ly, lSize * 0.35, lSize * 1.1);

  // Lettres ANGY
  ["A","N","G","Y"].forEach((l, i) => {
    const cx = lx + lSize * 0.6 + i * lSize * 1.35;
    const cy = ly + lSize * 0.9;
    ctx.fillStyle = T.light ? "#0A0A0F" : "#FFFFFF";
    ctx.beginPath(); ctx.arc(cx, cy, lSize * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = T.light ? "#FFFFFF" : "#0A0A0F";
    ctx.font = `900 ${lSize * 0.6}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(l, cx, cy + lSize * 0.22);
  });

  // "Company"
  ctx.fillStyle = T.light ? "#0A0A0F" : "#FFFFFF";
  ctx.font = `900 ${lSize * 0.85}px Arial`;
  ctx.textAlign = "left";
  ctx.fillText("Company", lx + lSize * 6.2, ly + lSize * 1.15);

  // BADGE TYPE
  const tbY = H * 0.13;
  const tbH = H * 0.05;
  const tbText = (typeObj.icon + " " + typeObj.badge);
  ctx.font = `bold ${tbH * 0.48}px Arial`;
  const tbW = Math.min(ctx.measureText(tbText).width + tbH * 1.5, W * 0.55);
  const tbX = W * 0.06;
  ctx.fillStyle = typeObj.badgeColor + "25";
  ctx.strokeStyle = typeObj.badgeColor;
  ctx.lineWidth = 2;
  roundRect(ctx, tbX, tbY, tbW, tbH, tbH / 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = typeObj.badgeColor;
  ctx.textAlign = "center";
  ctx.fillText(tbText, tbX + tbW / 2, tbY + tbH * 0.68);

  // EMOJI PRODUIT
  const emojiSize = format === "story" ? W * 0.52 : format === "carre" ? W * 0.38 : W * 0.28;
  ctx.font = `${emojiSize}px serif`;
  ctx.textAlign = "center";
  ctx.fillText(emoji, W / 2, H * 0.43);

  // NOM PRODUIT
  ctx.fillStyle = T.text;
  const prodSize = W * 0.075;
  ctx.font = `900 ${prodSize}px Arial`;
  ctx.textAlign = "center";
  wrapText(ctx, produit, W / 2, H * 0.54, W * 0.88, prodSize * 1.3);

  // SPECS
  if (specs) {
    ctx.fillStyle = T.light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";
    ctx.font = `${W * 0.036}px Arial`;
    ctx.fillText(specs, W / 2, H * 0.61);
  }

  // SÉPARATEUR
  ctx.fillStyle = T.light ? "rgba(20,0,255,0.18)" : "rgba(255,255,255,0.14)";
  ctx.fillRect(W * 0.28, H * 0.63, W * 0.44, 1.5);

  // PRIX
  ctx.fillStyle = themeKey === "gold" ? "#FFD700" : T.accent;
  ctx.font = `900 ${W * 0.11}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(prix + " FCFA", W / 2, H * 0.72);

  // ACCROCHE
  ctx.fillStyle = T.light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)";
  ctx.font = `${W * 0.035}px Arial`;
  ctx.fillText(accroche, W / 2, H * 0.77);

  // BADGES
  if (badges.length > 0) {
    ctx.font = `bold ${W * 0.028}px Arial`;
    const bH = H * 0.043;
    const totalW = badges.reduce((s, b) => s + ctx.measureText(b).width + bH * 1.3, 0) + (badges.length - 1) * W * 0.015;
    let bX = Math.max((W - totalW) / 2, W * 0.04);
    const bY = H * 0.82;
    badges.forEach(b => {
      const bW = ctx.measureText(b).width + bH * 1.3;
      ctx.fillStyle = T.light ? "rgba(20,0,255,0.08)" : "rgba(255,255,255,0.08)";
      ctx.strokeStyle = T.light ? "rgba(20,0,255,0.25)" : "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.2;
      roundRect(ctx, bX, bY, bW, bH, bH / 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = T.light ? "#1400FF" : "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(b, bX + bW / 2, bY + bH * 0.68);
      bX += bW + W * 0.015;
    });
  }

  // BANDE BAS
  ctx.fillStyle = T.light ? "rgba(20,0,255,0.07)" : "rgba(0,0,0,0.25)";
  ctx.fillRect(0, H * 0.91, W, H * 0.09);

  // LIGNE ROUGE BAS
  ctx.fillStyle = "#CC0000";
  ctx.fillRect(0, H * 0.91, W * 0.04, H * 0.09);

  ctx.fillStyle = T.light ? "#1400FF" : "#FFFFFF";
  ctx.font = `bold ${W * 0.032}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText("📞 +221 71 053 89 17  ·  angy-company.vercel.app", W / 2, H * 0.965);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  words.forEach(w => {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line !== "") {
      lines.push(line.trim()); line = w + " ";
    } else line = test;
  });
  lines.push(line.trim());
  const startY = y - (lines.length - 1) * lineH / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineH));
}

// ─── GÉNÉRATION LÉGENDE IA ─────────────────────────────────────────────────
async function genererLegendIA(produit, prix, type, specs) {
  const prompts = {
    promo: `Tu es le community manager d'ANGY COMPANY, une boutique tech à Dakar. Écris une légende courte et accrocheuse pour Facebook/Instagram pour vendre le ${produit} à ${prix} FCFA${specs ? ` (${specs})` : ""}. Inclus des emojis, une accroche, le prix, le contact WhatsApp +221 71 053 89 17, et 5 hashtags pertinents pour Dakar. Style direct, sénégalais, authentique. Maximum 150 mots.`,
    arrivage: `Tu es le community manager d'ANGY COMPANY à Dakar. Écris une légende excitante pour annoncer l'arrivée du ${produit} à ${prix} FCFA${specs ? ` (${specs})` : ""}. Crée de l'urgence, ajoute des emojis, le contact +221 71 053 89 17 et 5 hashtags. Maximum 120 mots.`,
    conseil: `Tu es expert tech chez ANGY COMPANY à Dakar. Écris un post conseil sur le ${produit} pour éduquer et convaincre. Mentionne le prix ${prix} FCFA, le contact +221 71 053 89 17. Style professionnel mais accessible. 5 hashtags. Maximum 150 mots.`,
    offre: `Tu es le community manager d'ANGY COMPANY à Dakar. Écris une légende urgente pour une offre limitée sur le ${produit} à ${prix} FCFA. Crée de l'urgence maximum, emojis, contact +221 71 053 89 17, 5 hashtags. Maximum 100 mots.`,
    tabaski: `Tu es le community manager d'ANGY COMPANY à Dakar. Écris une légende festive pour la Tabaski offrant le ${produit} à ${prix} FCFA comme cadeau parfait. Ambiance fête, emojis, contact +221 71 053 89 17, 5 hashtags. Maximum 120 mots.`,
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompts[type] || prompts.promo }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ─── GÉNÉRATION SCRIPT TIKTOK ─────────────────────────────────────────────
async function genererScriptTikTok(produit, prix, type) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Tu es community manager d'ANGY COMPANY à Dakar. Écris un script TikTok de 30-45 secondes pour vendre le ${produit} à ${prix} FCFA. 
Format : 
- ACCROCHE (0-3s) : phrase choc pour stopper le scroll
- PROBLÈME (3-8s) : problème que résout le produit  
- SOLUTION (8-20s) : présentation du produit
- PREUVE (20-30s) : pourquoi ANGY Company est fiable
- APPEL À L'ACTION (30-45s) : comment acheter

Style naturel, sénégalais, pas trop formel. Comme si tu parlais à un ami.`
      }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("creer");
  const [type, setType] = useState("promo");
  const [produitIdx, setProduitIdx] = useState(0);
  const [customProduit, setCustomProduit] = useState("");
  const [prix, setPrix] = useState("850 000");
  const [specs, setSpecs] = useState("");
  const [accroche, setAccroche] = useState("Disponible maintenant à Dakar !");
  const [emoji, setEmoji] = useState("📱");
  const [theme, setTheme] = useState("dark");
  const [format, setFormat] = useState("story");
  const [badges, setBadges] = useState(["✅ AUTHENTIQUE", "📞 WHATSAPP"]);
  const [legende, setLegende] = useState("");
  const [script, setScript] = useState("");
  const [loadingLeg, setLoadingLeg] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);
  const [planning, setPlanning] = useState(() => JSON.parse(localStorage.getItem("angy_planning") || "[]"));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("angy_hist") || "[]"));
  const [planDate, setPlanDate] = useState(new Date().toISOString().split("T")[0]);
  const [planHeure, setPlanHeure] = useState("18:00");
  const [planReseau, setPlanReseau] = useState("Facebook");
  const [planNote, setPlanNote] = useState("");
  const [toast, setToast] = useState(null);
  const canvasRef = useRef();

  const produit = produitIdx === 11 ? customProduit : PRODUITS[produitIdx].nom;
  const fmt = FORMATS.find(f => f.id === format);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Dessiner le canvas
  const dessiner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = fmt.w;
    canvas.height = fmt.h;
    drawVisual(canvas, { produit, prix, specs, accroche, emoji, theme, type, badges, format });
  }, [produit, prix, specs, accroche, emoji, theme, type, badges, format, fmt]);

  useEffect(() => { dessiner(); }, [dessiner]);

  // Mise à jour auto accroche et emoji
  useEffect(() => {
    const accroches = {
      promo: "Disponible maintenant à Dakar !",
      arrivage: "🔥 Nouvelle arrivée — stocks limités !",
      conseil: "Le meilleur choix pour votre budget",
      offre: "⚡ Offre spéciale — durée limitée !",
      tabaski: "Le cadeau parfait pour la fête ! 🎉",
    };
    setAccroche(accroches[type]);
  }, [type]);

  useEffect(() => {
    const p = PRODUITS[produitIdx];
    if (!p) return;
    if (p.prix) setPrix(p.prix);
    if (p.emoji) setEmoji(p.emoji);
  }, [produitIdx]);

  // Télécharger
  const telecharger = () => {
    dessiner();
    setTimeout(() => {
      const canvas = canvasRef.current;
      const a = document.createElement("a");
      a.download = `ANGY_${produit.replace(/ /g, "_")}_${format}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      // Sauvegarder dans historique
      const item = { id: Date.now(), thumb: canvas.toDataURL("image/png", 0.5), label: `${produit} — ${prix} FCFA`, date: new Date().toLocaleDateString("fr-FR") };
      const newHist = [item, ...history].slice(0, 24);
      setHistory(newHist);
      localStorage.setItem("angy_hist", JSON.stringify(newHist));
      showToast("✅ Visuel téléchargé !");
    }, 100);
  };

  // Générer légende IA
  const genLegende = async () => {
    setLoadingLeg(true);
    setLegende("");
    try {
      const text = await genererLegendIA(produit, prix, type, specs);
      setLegende(text);
    } catch (e) { setLegende("Erreur — vérifiez votre connexion"); }
    setLoadingLeg(false);
  };

  // Générer script TikTok IA
  const genScript = async () => {
    setLoadingScript(true);
    setScript("");
    try {
      const text = await genererScriptTikTok(produit, prix, type);
      setScript(text);
    } catch (e) { setScript("Erreur — vérifiez votre connexion"); }
    setLoadingScript(false);
  };

  // Planning
  const ajouterPlanning = () => {
    if (!planDate) return showToast("Choisissez une date !");
    const item = { id: Date.now(), reseau: planReseau, date: planDate, heure: planHeure, type, produit, prix, note: planNote };
    const newP = [...planning, item].sort((a, b) => new Date(a.date + "T" + a.heure) - new Date(b.date + "T" + b.heure));
    setPlanning(newP);
    localStorage.setItem("angy_planning", JSON.stringify(newP));
    setPlanNote("");
    showToast("✅ Ajouté au planning !");
  };

  const supprimerPlanning = (id) => {
    const newP = planning.filter(p => p.id !== id);
    setPlanning(newP);
    localStorage.setItem("angy_planning", JSON.stringify(newP));
  };

  const toggleBadge = (b) => {
    setBadges(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  const s = {
    app: { minHeight: "100vh", background: "#0A0A0F", color: "#F0F0F5", fontFamily: "'SF Pro Display','Segoe UI',system-ui,sans-serif" },
    header: { background: "rgba(10,10,15,0.97)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    tabs: { display: "flex", gap: 6 },
    tab: (active) => ({ padding: "8px 18px", borderRadius: 10, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all 0.15s", borderColor: active ? "#1400FF" : "rgba(255,255,255,0.1)", background: active ? "#1400FF" : "transparent", color: active ? "#fff" : "#888899" }),
    container: { maxWidth: 1300, margin: "0 auto", padding: "24px" },
    grid: { display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 },
    panel: { background: "#13131A", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 14 },
    ptitle: { fontSize: 11, fontWeight: 700, color: "#888899", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 },
    field: { marginBottom: 12 },
    label: { display: "block", fontSize: 11, fontWeight: 600, color: "#888899", marginBottom: 5 },
    input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "9px 12px", color: "#F0F0F5", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    select: { width: "100%", background: "#1C1C28", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "9px 12px", color: "#F0F0F5", fontSize: 13, fontFamily: "inherit", outline: "none", cursor: "pointer" },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    btn: (color = "#1400FF") => ({ width: "100%", padding: "12px", borderRadius: 11, background: color, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }),
    btnSec: { width: "100%", padding: "11px", borderRadius: 11, background: "rgba(255,255,255,0.05)", color: "#F0F0F5", border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 },
  };

  return (
    <div style={s.app}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <AngyLogoSVG width={130} dark={false}/>
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }}/>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Marketing Studio</div>
            <div style={{ fontSize: 11, color: "#888899" }}>Générateur de visuels & planificateur</div>
          </div>
        </div>
        <div style={s.tabs}>
          {[["creer","✨ Créer"],["planifier","📅 Planifier"],["historique","🗂 Historique"]].map(([id,label]) => (
            <button key={id} style={s.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </header>

      <div style={s.container}>

        {/* ═══ TAB CRÉER ═══ */}
        {tab === "creer" && (
          <div style={s.grid}>
            {/* PANNEAU GAUCHE */}
            <div>
              {/* TYPE */}
              <div style={s.panel}>
                <div style={s.ptitle}>Type de publication</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {TYPES.map(t => (
                    <button key={t.id} onClick={() => setType(t.id)}
                      style={{ padding: "10px 8px", borderRadius: 10, border: `1px solid ${type === t.id ? "#1400FF" : "rgba(255,255,255,0.08)"}`, background: type === t.id ? "rgba(20,0,255,0.15)" : "transparent", color: type === t.id ? "#6680FF" : "#888899", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700, textAlign: "center", transition: "all 0.15s" }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTENU */}
              <div style={s.panel}>
                <div style={s.ptitle}>Contenu</div>
                <div style={s.field}>
                  <label style={s.label}>Produit</label>
                  <select style={s.select} value={produitIdx} onChange={e => setProduitIdx(Number(e.target.value))}>
                    {PRODUITS.map((p, i) => <option key={i} value={i}>{p.emoji} {p.nom}</option>)}
                  </select>
                </div>
                {produitIdx === 11 && (
                  <div style={s.field}>
                    <label style={s.label}>Nom personnalisé</label>
                    <input style={s.input} value={customProduit} onChange={e => setCustomProduit(e.target.value)} placeholder="Ex: Samsung Galaxy S24"/>
                  </div>
                )}
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Prix (FCFA)</label>
                    <input style={s.input} value={prix} onChange={e => setPrix(e.target.value)} placeholder="850 000"/>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Emoji</label>
                    <input style={{...s.input, textAlign:"center", fontSize: 22}} value={emoji} onChange={e => setEmoji(e.target.value)}/>
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Couleur / Stockage</label>
                  <input style={s.input} value={specs} onChange={e => setSpecs(e.target.value)} placeholder="Ex: 256GB Noir Titane"/>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Accroche</label>
                  <input style={s.input} value={accroche} onChange={e => setAccroche(e.target.value)}/>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Badges</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {BADGES_DISPO.map(b => (
                      <button key={b} onClick={() => toggleBadge(b)}
                        style={{ padding: "4px 10px", borderRadius: 99, border: `1px solid ${badges.includes(b) ? "#FF9F0A" : "rgba(255,255,255,0.1)"}`, background: badges.includes(b) ? "rgba(255,159,10,0.12)" : "transparent", color: badges.includes(b) ? "#FF9F0A" : "#888899", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STYLE */}
              <div style={s.panel}>
                <div style={s.ptitle}>Style</div>
                {/* FORMAT */}
                <div style={s.field}>
                  <label style={s.label}>Format</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {FORMATS.map(f => (
                      <button key={f.id} onClick={() => setFormat(f.id)}
                        style={{ flex: 1, padding: "9px 6px", borderRadius: 9, border: `1px solid ${format === f.id ? "#00E676" : "rgba(255,255,255,0.1)"}`, background: format === f.id ? "rgba(0,230,118,0.1)" : "transparent", color: format === f.id ? "#00E676" : "#888899", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", textAlign: "center" }}>
                        {f.label}<br/><span style={{ fontWeight: 400, fontSize: 10 }}>{f.ratio}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* THÈME */}
                <div style={s.field}>
                  <label style={s.label}>Thème couleur</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(THEMES).map(([k, t]) => (
                      <button key={k} onClick={() => setTheme(k)}
                        style={{ width: 36, height: 36, borderRadius: 9, border: `2px solid ${theme === k ? "#FFFFFF" : "transparent"}`, background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[t.bg.length-1]})`, cursor: "pointer" }}
                        title={k}/>
                    ))}
                  </div>
                </div>
                <button style={s.btn()} onClick={dessiner}>🎨 Actualiser le visuel</button>
              </div>

              {/* IA */}
              <div style={s.panel}>
                <div style={s.ptitle}>🤖 Génération IA</div>
                <button style={s.btn("#7700CC")} onClick={genLegende} disabled={loadingLeg}>
                  {loadingLeg ? "⏳ Génération..." : "✍️ Générer la légende (IA)"}
                </button>
                <button style={{...s.btnSec, marginTop: 8}} onClick={genScript} disabled={loadingScript}>
                  {loadingScript ? "⏳ Génération..." : "🎬 Script TikTok (IA)"}
                </button>
              </div>
            </div>

            {/* PANNEAU DROIT */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Aperçu</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={telecharger} style={{ background: "#1400FF", color: "#fff", border: "none", padding: "9px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                    ⬇️ Télécharger PNG
                  </button>
                </div>
              </div>

              {/* CANVAS */}
              <div style={{ display: "flex", justifyContent: "center", background: "repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 24, marginBottom: 16 }}>
                <canvas ref={canvasRef} style={{ borderRadius: 10, maxWidth: "100%", maxHeight: 560, objectFit: "contain" }}/>
              </div>

              {/* LÉGENDE */}
              {legende && (
                <div style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#888899", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>📝 Légende générée par IA</div>
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: "#F0F0F5", whiteSpace: "pre-wrap" }}>{legende}</div>
                  <button onClick={() => { navigator.clipboard.writeText(legende); showToast("✅ Légende copiée !"); }}
                    style={{ marginTop: 10, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0F0F5", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    📋 Copier
                  </button>
                </div>
              )}

              {/* SCRIPT TIKTOK */}
              {script && (
                <div style={{ background: "#13131A", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#888899", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>🎬 Script TikTok</div>
                  <div style={{ fontSize: 13, lineHeight: 1.8, color: "#F0F0F5", whiteSpace: "pre-wrap" }}>{script}</div>
                  <button onClick={() => { navigator.clipboard.writeText(script); showToast("✅ Script copié !"); }}
                    style={{ marginTop: 10, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#F0F0F5", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    📋 Copier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB PLANIFIER ═══ */}
        {tab === "planifier" && (
          <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 20 }}>
            <div>
              <div style={s.panel}>
                <div style={s.ptitle}>Ajouter une publication</div>
                <div style={s.field}>
                  <label style={s.label}>Réseau social</label>
                  <select style={s.select} value={planReseau} onChange={e => setPlanReseau(e.target.value)}>
                    {["📘 Facebook","📸 Instagram","🎵 TikTok","💬 WhatsApp Status","👻 Snapchat"].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Date</label>
                    <input type="date" style={s.input} value={planDate} onChange={e => setPlanDate(e.target.value)}/>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Heure</label>
                    <select style={s.select} value={planHeure} onChange={e => setPlanHeure(e.target.value)}>
                      {["07:00","09:00","12:00","18:00","20:00","21:00"].map(h => <option key={h} value={h}>{h}{h==="18:00"?" ⭐":""}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Produit & note</label>
                  <input style={s.input} value={planNote} onChange={e => setPlanNote(e.target.value)} placeholder={`${produit} — ${prix} FCFA`}/>
                </div>
                <button style={s.btn()} onClick={ajouterPlanning}>➕ Ajouter au planning</button>
              </div>

              {/* CONSEILS HORAIRES */}
              <div style={s.panel}>
                <div style={s.ptitle}>⏰ Meilleurs horaires — Dakar</div>
                {[
                  ["🌅","7h–9h","Réveil — fort trafic matinal","rgba(20,0,255,0.1)","rgba(20,0,255,0.3)"],
                  ["☀️","12h–13h","Pause déjeuner — pic d'engagement","rgba(0,230,118,0.1)","rgba(0,230,118,0.3)"],
                  ["🌆","18h–21h ⭐","Meilleur créneau de la journée !","rgba(255,159,10,0.12)","rgba(255,159,10,0.4)"],
                  ["🌙","21h–23h","TikTok & WhatsApp très actifs","rgba(204,0,0,0.1)","rgba(204,0,0,0.3)"],
                ].map(([icon,h,desc,bg,border]) => (
                  <div key={h} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{h}</div>
                      <div style={{ fontSize: 12, color: "#888899", marginTop: 2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.panel}>
              <div style={s.ptitle}>Planning ({planning.length} publication{planning.length !== 1 ? "s" : ""})</div>
              {planning.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#888899", fontSize: 14 }}>Aucune publication planifiée</div>
              ) : planning.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ fontSize: 26 }}>{item.reseau.split(" ")[0]}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.note || item.produit}</div>
                      <div style={{ fontSize: 12, color: "#888899", marginTop: 2 }}>{item.reseau} · {new Date(item.date).toLocaleDateString("fr-FR")} à {item.heure}</div>
                    </div>
                  </div>
                  <button onClick={() => supprimerPlanning(item.id)}
                    style={{ background: "rgba(255,69,58,0.1)", border: "1px solid rgba(255,69,58,0.3)", color: "#FF453A", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB HISTORIQUE ═══ */}
        {tab === "historique" && (
          <div style={s.panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={s.ptitle}>Visuels générés ({history.length})</div>
              {history.length > 0 && (
                <button onClick={() => { setHistory([]); localStorage.removeItem("angy_hist"); showToast("Historique effacé"); }}
                  style={{ background: "rgba(255,69,58,0.1)", border: "1px solid rgba(255,69,58,0.3)", color: "#FF453A", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  🗑 Tout effacer
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#888899", fontSize: 14 }}>
                Aucun visuel généré.<br/>Allez dans "Créer" et téléchargez votre premier visuel !
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                {history.map(item => (
                  <div key={item.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}>
                    <img src={item.thumb} alt={item.label} style={{ width: "100%", display: "block" }}/>
                    <div style={{ padding: "8px 10px", background: "#13131A" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#F0F0F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: "#888899", marginTop: 2 }}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1C1C28", border: "1px solid rgba(255,255,255,0.12)", color: "#F0F0F5", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
