import { useState, useRef, useEffect, useCallback } from "react";

// ─── LOGO SVG PIXEL-PERFECT ───────────────────────────────────────────────────
const AngyLogo = ({ width = 180, light = false }) => {
  const tc = light ? "#0A0A0F" : "#FFFFFF";
  // Mesures exactes basées sur l'image originale
  // Cercles : rayon 24px, collés (centre à centre = 48px)
  const R = 24;           // rayon cercle
  const D = R * 2;        // diamètre = écart centre à centre pour cercles collés
  const logoH = 100;      // hauteur totale viewBox
  const cy = 54;          // centre vertical des cercles (milieu de la hauteur)

  // Crochet bleu : commence à x=5, barre verticale montant depuis haut des cercles
  // La barre horizontale bleue est en bas et fait ~70% de la hauteur du crochet
  const bvX = 5;          // x barre verticale bleue
  const bvEp = 12;        // épaisseur trait
  const bvTop = cy - R - 4;  // commence au dessus du cercle A
  const bvBot = cy + R + 12; // descend sous le cercle
  const bhBot = bvBot;    // barre horizontale au bas de la barre verticale
  const bhLen = 55;       // longueur barre horizontale bleue

  // Espace entre crochet bleu et premier cercle A
  const gapBleu = 14;
  const cxA = bvX + bvEp + gapBleu + R; // centre cercle A

  // Centres des 4 cercles collés
  const cxN = cxA + D;
  const cxG = cxN + D;
  const cxY = cxG + D;

  // "Company" après Y avec espace
  const gapComp = 12;
  const compX = cxY + R + gapComp;
  const compFont = 36;

  // Crochet rouge : commence après "Company"
  // "Company" en Arial Black 36px ≈ largeur 170px
  const compW = 170;
  const gapRouge = 12;
  const rvX = compX + compW + gapRouge; // x barre verticale rouge (à droite)
  const rvEp = 12;        // épaisseur trait rouge
  const rhTop = bvTop;    // même hauteur que le haut du crochet bleu
  const rhLen = 60;       // longueur barre horizontale rouge
  const rvH = (cy + R + 4) - rhTop; // hauteur barre verticale rouge

  const viewW = rvX + rvEp + 4;

  return (
    <svg width={width} height={Math.round(logoH*(width/viewW))} viewBox={`0 0 ${viewW} ${logoH}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* CROCHET BLEU BAS-GAUCHE */}
      <rect x={bvX} y={bvTop} width={bvEp} height={bvBot-bvTop} fill="#1400FF"/>
      <rect x={bvX} y={bhBot-bvEp} width={bhLen} height={bvEp} fill="#1400FF"/>
      {/* CERCLES ANGY COLLÉS */}
      {[[cxA,"A"],[cxN,"N"],[cxG,"G"],[cxY,"Y"]].map(([cx,l])=>(
        <g key={l}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={tc} strokeWidth="2.5"/>
          <text x={cx} y={cy+9} textAnchor="middle" fontFamily="Arial Black,Arial,sans-serif" fontWeight="900" fontSize="22" fill={tc}>{l}</text>
        </g>
      ))}
      {/* COMPANY */}
      <text x={compX} y={cy+11} fontFamily="Arial Black,Arial,sans-serif" fontWeight="900" fontSize={compFont} fill={tc}>Company</text>
      {/* CROCHET ROUGE HAUT-DROIT */}
      <rect x={rvX-rhLen+rvEp} y={rhTop} width={rhLen} height={rvEp} fill="#CC0000"/>
      <rect x={rvX} y={rhTop} width={rvEp} height={rvH} fill="#CC0000"/>
    </svg>
  );
};

// ─── LOGO CANVAS PIXEL-PERFECT ───────────────────────────────────────────────
function drawLogo(ctx, x, y, targetW, light=false) {
  const tc = light ? "#0A0A0F" : "#FFFFFF";
  const R=24, Diam=R*2, logoH=100, cy=54;
  const bvX=5, bvEp=12;
  const bvTop=cy-R-4, bvBot=cy+R+12;
  const bhLen=55;
  const cxA=bvX+bvEp+14+R;
  const cxN=cxA+Diam, cxG=cxN+Diam, cxY=cxG+Diam;
  const compX=cxY+R+12;
  const compW=170, gapRouge=12;
  const rvX=compX+compW+gapRouge;
  const rvEp=12, rhLen=60;
  const rhTop=bvTop;
  const rvH=(cy+R+4)-rhTop;
  const viewW=rvX+rvEp+4;
  const sc=targetW/viewW;

  ctx.save();
  ctx.translate(x,y);
  ctx.scale(sc,sc);

  // Crochet bleu
  ctx.fillStyle="#1400FF";
  ctx.fillRect(bvX, bvTop, bvEp, bvBot-bvTop);
  ctx.fillRect(bvX, bvBot-bvEp, bhLen, bvEp);

  // Cercles ANGY
  [[cxA,"A"],[cxN,"N"],[cxG,"G"],[cxY,"Y"]].forEach(([cx,l])=>{
    ctx.strokeStyle=tc; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle=tc; ctx.font="900 22px Arial Black,Arial";
    ctx.textAlign="center"; ctx.fillText(l,cx,cy+9);
  });

  // Company
  ctx.fillStyle=tc; ctx.font="900 36px Arial Black,Arial";
  ctx.textAlign="left"; ctx.fillText("Company",compX,cy+11);

  // Crochet rouge
  ctx.fillStyle="#CC0000";
  ctx.fillRect(rvX-rhLen+rvEp, rhTop, rhLen, rvEp);
  ctx.fillRect(rvX, rhTop, rvEp, rvH);

  ctx.restore();
}

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const PRODUITS = [
  {nom:"iPhone 15 Pro Max",emoji:"📱",prix:"950 000"},
  {nom:"iPhone 15 Pro",    emoji:"📱",prix:"850 000"},
  {nom:"iPhone 15",        emoji:"📱",prix:"700 000"},
  {nom:"iPhone 14 Pro Max",emoji:"📱",prix:"750 000"},
  {nom:"iPhone 14 Pro",    emoji:"📱",prix:"650 000"},
  {nom:"iPhone 14",        emoji:"📱",prix:"550 000"},
  {nom:"iPhone 13",        emoji:"📱",prix:"400 000"},
  {nom:"MacBook Air M2",   emoji:"💻",prix:"900 000"},
  {nom:"MacBook Pro M3",   emoji:"💻",prix:"1 400 000"},
  {nom:"AirPods Pro 2",    emoji:"🎧",prix:"180 000"},
  {nom:"iPad Air",         emoji:"📲",prix:"450 000"},
  {nom:"Personnalisé",     emoji:"📦",prix:""},
];

const TYPES = [
  {id:"promo",    label:"Promo produit",    icon:"🔥", titre:"SPECIAL PROMO",    couleurTitre:"#FFD700", ombre:"#FF4400"},
  {id:"arrivage", label:"Nouvelle arrivée", icon:"📦", titre:"NOUVELLE ARRIVÉE", couleurTitre:"#00E676", ombre:"#006600"},
  {id:"conseil",  label:"Conseil tech",     icon:"💡", titre:"CONSEIL TECH",     couleurTitre:"#6680FF", ombre:"#0000AA"},
  {id:"offre",    label:"Offre spéciale",   icon:"⚡", titre:"OFFRE LIMITÉE",    couleurTitre:"#FF453A", ombre:"#880000"},
  {id:"tabaski",  label:"Tabaski / Fête",   icon:"🎉", titre:"SPÉCIAL FÊTE",     couleurTitre:"#FFD700", ombre:"#AA6600"},
];

const FORMATS = [
  {id:"story",   label:"Story",   ratio:"9:16", w:1080, h:1920},
  {id:"carre",   label:"Carré",   ratio:"1:1",  w:1080, h:1080},
  {id:"paysage", label:"Paysage", ratio:"16:9", w:1920, h:1080},
];

const POINTS_DEFAUT = [
  "✅ Authentiques & certifiés",
  "🚚 Livraison disponible",
  "💳 Paiement Wave / Orange Money",
  "🛡️ Qualité garantie",
];

// ─── DESSIN CANVAS ────────────────────────────────────────────────────────────
function rr(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function drawVisual(canvas, cfg) {
  const {produit,prix,specs,points,type,format,contact,localisation,instagram,facebook,tiktok,photo} = cfg;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const typeObj = TYPES.find(t=>t.id===type)||TYPES[0];

  // ── FOND NOIR DÉGRADÉ
  const bgGrad = ctx.createRadialGradient(W*0.6, H*0.25, 0, W*0.5, H*0.5, W*0.9);
  bgGrad.addColorStop(0, "#2A1A0A");
  bgGrad.addColorStop(0.4, "#1A1010");
  bgGrad.addColorStop(1, "#050505");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0,0,W,H);

  // ── PHOTO PRODUIT EN ARRIÈRE-PLAN (si disponible)
  if(photo) {
    // Zone droite de l'affiche — photo grande en semi-transparent
    const photoW = W*0.52;
    const photoH = H*0.55;
    const photoX = W*0.48;
    const photoY = H*0.18;
    ctx.save();
    // Clip arrondi pour la photo
    rr(ctx, photoX, photoY, photoW, photoH, W*0.03);
    ctx.clip();
    // Calculer ratio pour couvrir la zone
    const scaleX = photoW / photo.width;
    const scaleY = photoH / photo.height;
    const scale = Math.max(scaleX, scaleY);
    const dw = photo.width * scale;
    const dh = photo.height * scale;
    const dx = photoX + (photoW - dw) / 2;
    const dy = photoY + (photoH - dh) / 2;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(photo, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
    ctx.restore();
    // Dégradé sur la photo pour fondre avec le fond
    const fadeGrad = ctx.createLinearGradient(photoX, 0, photoX+photoW, 0);
    fadeGrad.addColorStop(0, "#0A0505");
    fadeGrad.addColorStop(0.3, "transparent");
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(photoX, photoY, photoW*0.4, photoH);
    // Ombre bas de la photo
    const fadeBot = ctx.createLinearGradient(0, photoY+photoH*0.7, 0, photoY+photoH);
    fadeBot.addColorStop(0, "transparent");
    fadeBot.addColorStop(1, "#0A0505");
    ctx.fillStyle = fadeBot;
    ctx.fillRect(photoX, photoY+photoH*0.7, photoW, photoH*0.3);
  } else {
    // Cercle lumineux fond sans photo
    const glowGrad = ctx.createRadialGradient(W*0.75, H*0.35, 0, W*0.75, H*0.35, W*0.55);
    glowGrad.addColorStop(0, "rgba(200,60,0,0.22)");
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0,0,W,H);
    // Emoji produit grand en arrière-plan
    const emojiSize = W*0.32;
    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.12;
    ctx.fillText("📱", W*0.72, H*0.65);
    ctx.globalAlpha = 1;
  }

  // Lueur bleue gauche
  const glowGrad2 = ctx.createRadialGradient(W*0.15, H*0.8, 0, W*0.15, H*0.8, W*0.4);
  glowGrad2.addColorStop(0, "rgba(0,80,200,0.15)");
  glowGrad2.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad2;
  ctx.fillRect(0,0,W,H);

  const pad = W*0.06;

  // ── LOGO EN HAUT À GAUCHE
  const logoW = W*0.38;
  drawLogo(ctx, pad, H*0.025, logoW, false);

  // ── LOGO APPLE EN HAUT À DROITE
  const appleSize = W*0.12;
  ctx.fillStyle = "#CC0000";
  ctx.font = `${appleSize}px serif`;
  ctx.textAlign = "right";
  ctx.fillText("", W-pad, H*0.08);

  // ── TITRE PRINCIPAL STYLE VRAI LOGO
  const titreY = H*0.17;
  const titreFontSize = W*0.095;
  ctx.textAlign = "center";
  // Ombre du titre
  ctx.fillStyle = typeObj.ombre;
  ctx.font = `900 ${titreFontSize}px Arial Black,Arial`;
  const titreWords = typeObj.titre.split(" ");
  if(titreWords.length >= 2) {
    const ligne1 = titreWords.slice(0, Math.ceil(titreWords.length/2)).join(" ");
    const ligne2 = titreWords.slice(Math.ceil(titreWords.length/2)).join(" ");
    // Ombre offset
    ctx.fillText(ligne1, W/2+4, titreY+4);
    ctx.fillText(ligne2, W/2+4, titreY+titreFontSize*1.2+4);
    // Texte principal
    ctx.fillStyle = typeObj.couleurTitre;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = titreFontSize*0.06;
    ctx.strokeText(ligne1, W/2, titreY);
    ctx.fillText(ligne1, W/2, titreY);
    ctx.strokeText(ligne2, W/2, titreY+titreFontSize*1.2);
    ctx.fillText(ligne2, W/2, titreY+titreFontSize*1.2);
  } else {
    ctx.fillText(typeObj.titre, W/2+4, titreY+4);
    ctx.fillStyle = typeObj.couleurTitre;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = titreFontSize*0.06;
    ctx.strokeText(typeObj.titre, W/2, titreY);
    ctx.fillText(typeObj.titre, W/2, titreY);
  }

  // ── SOUS-TITRE "CHEZ ANGY COMPANY"
  const sousTitreY = H*0.32;
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 ${W*0.048}px Arial Black,Arial`;
  ctx.fillText("CHEZ ANGY COMPANY 📱", pad, sousTitreY);

  // ── NOM PRODUIT + PRIX
  const prodY = H*0.37;
  ctx.fillStyle = typeObj.couleurTitre;
  ctx.font = `900 ${W*0.065}px Arial Black,Arial`;
  ctx.fillText(produit, pad, prodY);
  if(specs) {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = `${W*0.032}px Arial`;
    ctx.fillText(specs, pad, prodY+W*0.04);
  }
  // Badge prix
  const prixY = prodY + W*0.055;
  ctx.fillStyle = "#FFD700";
  ctx.font = `900 ${W*0.072}px Arial Black,Arial`;
  ctx.fillText(prix+" FCFA", pad, prixY+W*0.06);

  // ── POINTS EN 2 COLONNES
  const col1X = pad;
  const col2X = W*0.52;
  const pointsY = H*0.5;
  const ptSize = W*0.033;
  ctx.font = `700 ${ptSize}px Arial`;
  const col1 = points.slice(0, Math.ceil(points.length/2));
  const col2 = points.slice(Math.ceil(points.length/2));
  col1.forEach((pt, i) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(pt, col1X, pointsY + i*(ptSize*1.9));
  });
  col2.forEach((pt, i) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText(pt, col2X, pointsY + i*(ptSize*1.9));
  });

  // ── EMOJI PRODUIT GRAND (centré en bas à droite)
  const emojiSize = W*0.28;
  ctx.font = `${emojiSize}px serif`;
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.18;
  ctx.fillText("📱", W*0.75, H*0.78);
  ctx.globalAlpha = 1;

  // ── LIGNE SÉPARATRICE
  const sepY = H*0.74;
  const sepGrad = ctx.createLinearGradient(pad, sepY, W-pad, sepY);
  sepGrad.addColorStop(0, "transparent");
  sepGrad.addColorStop(0.2, "#1400FF");
  sepGrad.addColorStop(0.8, "#CC0000");
  sepGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = sepGrad;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(pad,sepY); ctx.lineTo(W-pad,sepY); ctx.stroke();

  // ── INFOS CONTACT EN BAS (2 colonnes)
  const ctY = H*0.77;
  const ctSize = W*0.028;
  ctx.font = `700 ${ctSize}px Arial`;
  ctx.textAlign = "left";

  // Colonne gauche
  const contactInfos = [
    `📞  ${contact}`,
    `📍  ${localisation}`,
    `✉️  angycompany25@gmail.com`,
  ];
  contactInfos.forEach((c,i) => {
    ctx.fillStyle = i===0 ? "#FFD700" : "rgba(255,255,255,0.85)";
    ctx.fillText(c, pad, ctY + i*(ctSize*1.85));
  });

  // Colonne droite — réseaux sociaux
  const reseaux = [
    `👻  ${tiktok||"angy_company"}`,
    `📸  ${instagram||"angy_company"}`,
    `👥  ${facebook||"Angy Company"}`,
    `🎵  angycompany`,
  ];
  reseaux.forEach((r,i) => {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(r, W*0.52, ctY + i*(ctSize*1.85));
  });

  // ── SLOGAN BAS
  const sloganY = H*0.94;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = `${W*0.026}px Arial`;
  ctx.fillText("Chez Angy Company, chaque client compte. Votre satisfaction, notre priorité.", W/2, sloganY);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = `700 ${W*0.024}px Arial`;
  ctx.fillText("angy-company.vercel.app", W/2, sloganY+W*0.032);
}

// ─── IA ──────────────────────────────────────────────────────────────────────
async function callIA(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
  });
  const d = await r.json();
  return d.content?.[0]?.text||"";
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("creer");
  const [type, setType] = useState("promo");
  const [produitIdx, setProduitIdx] = useState(0);
  const [customProduit, setCustomProduit] = useState("");
  const [prix, setPrix] = useState("850 000");
  const [specs, setSpecs] = useState("256GB — Noir Titane");
  const [format, setFormat] = useState("story");
  const [points, setPoints] = useState([...POINTS_DEFAUT]);
  const [contact, setContact] = useState("+221 78 116 32 86 / +221 71 053 89 17");
  const [localisation, setLocalisation] = useState("Malika — Parcelles Assainies");
  const [instagram, setInstagram] = useState("angy_company");
  const [facebook, setFacebook] = useState("Angy Company");
  const [tiktok, setTiktok] = useState("angycompany");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoInputRef = useRef();
  const [legende, setLegende] = useState("");
  const [loadingL, setLoadingL] = useState(false);
  const [planning, setPlanning] = useState(()=>JSON.parse(localStorage.getItem("angy_plan")||"[]"));
  const [history, setHistory] = useState(()=>JSON.parse(localStorage.getItem("angy_hist")||"[]"));
  const [planDate, setPlanDate] = useState(new Date().toISOString().split("T")[0]);
  const [planHeure, setPlanHeure] = useState("18:00");
  const [planReseau, setPlanReseau] = useState("📘 Facebook");
  const [planNote, setPlanNote] = useState("");
  // Animation
  const [animRunning, setAnimRunning] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);
  const [enregistrement, setEnregistrement] = useState(false);
  const [animStyle, setAnimStyle] = useState("slide"); // slide, pulse, zoom
  const animCanvasRef = useRef();
  const animFrameRef = useRef();
  const recorderRef = useRef();
  const chunksRef = useRef([]);
  const [toast, setToast] = useState(null);
  const canvasRef = useRef();
  const showToast = m => { setToast(m); setTimeout(()=>setToast(null),2500); };

  const produit = produitIdx===11 ? customProduit : PRODUITS[produitIdx].nom;
  const fmt = FORMATS.find(f=>f.id===format);

  const D = dark ? {
    bg:"#08080F", card:"#101018", border:"rgba(255,255,255,0.07)",
    text:"#F0F0F8", muted:"#7788AA", input:"rgba(255,255,255,0.05)",
    inputBorder:"rgba(255,255,255,0.1)", sel:"#181828",
  } : {
    bg:"#F0F0F8", card:"#FFFFFF", border:"rgba(0,0,0,0.08)",
    text:"#0A0A1A", muted:"#556680", input:"rgba(0,0,30,0.04)",
    inputBorder:"rgba(0,0,0,0.12)", sel:"#F0F0FF",
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    const img = new Image();
    img.onload = () => setPhoto(img);
    img.src = url;
  };

  const supprimerPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if(photoInputRef.current) photoInputRef.current.value = "";
  };

  const dessiner = useCallback(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = fmt.w; canvas.height = fmt.h;
    drawVisual(canvas,{produit,prix,specs,points,type,format,contact,localisation,instagram,facebook,tiktok,photo});
  },[produit,prix,specs,points,type,format,contact,localisation,instagram,facebook,tiktok,fmt,photo]);

  useEffect(()=>{ dessiner(); },[dessiner]);
  useEffect(()=>{
    const p=PRODUITS[produitIdx];
    if(p&&p.prix) setPrix(p.prix);
  },[produitIdx]);

  const telecharger=()=>{
    dessiner();
    setTimeout(()=>{
      const canvas=canvasRef.current;
      const a=document.createElement("a");
      a.download=`ANGY_${produit.replace(/ /g,"_")}_${format}.png`;
      a.href=canvas.toDataURL("image/png"); a.click();
      const item={id:Date.now(),thumb:canvas.toDataURL("image/png",0.4),label:`${produit} — ${prix}`,date:new Date().toLocaleDateString("fr-FR")};
      const h=[item,...history].slice(0,24);
      setHistory(h); localStorage.setItem("angy_hist",JSON.stringify(h));
      showToast("✅ Visuel téléchargé !");
    },100);
  };

  const genLegende=async()=>{
    setLoadingL(true); setLegende("");
    try{
      const t=await callIA(`Tu es community manager d'ANGY COMPANY à Dakar. Écris une légende ${type==="promo"?"pour vendre":type==="arrivage"?"pour annoncer l'arrivée de":type==="offre"?"urgente pour une offre sur":type==="tabaski"?"festive Tabaski pour":"conseil sur"} le ${produit} à ${prix} FCFA${specs?` (${specs})`:""}.
Inclus: accroche percutante, description, contact ${contact}, hashtags Dakar. Style sénégalais naturel. Max 120 mots.`);
      setLegende(t);
    }catch{ setLegende("Erreur connexion"); }
    setLoadingL(false);
  };

  // ─── ANIMATION ──────────────────────────────────────────────────────────────
  const drawAnimFrame = useCallback((canvas, t, style) => {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = W * 0.06;

    // Fond
    const bgGrad = ctx.createRadialGradient(W*0.6, H*0.25, 0, W*0.5, H*0.5, W*0.9);
    bgGrad.addColorStop(0, "#2A1A0A");
    bgGrad.addColorStop(0.5, "#1A1010");
    bgGrad.addColorStop(1, "#050505");
    ctx.fillStyle = bgGrad; ctx.fillRect(0,0,W,H);

    // Lueur animée
    const glowAlpha = 0.15 + Math.sin(t*3)*0.07;
    const glow = ctx.createRadialGradient(W*0.7,H*0.3,0,W*0.7,H*0.3,W*0.6);
    glow.addColorStop(0,`rgba(200,60,0,${glowAlpha})`);
    glow.addColorStop(1,"transparent");
    ctx.fillStyle=glow; ctx.fillRect(0,0,W,H);

    const typeObj = TYPES.find(x=>x.id===type)||TYPES[0];

    // LOGO — slide depuis gauche
    const logoProgress = style==="slide" ? Math.min(1, t*2.5) : 1;
    const logoEase = 1 - Math.pow(1-logoProgress, 3);
    const logoX = -W*0.4 + W*0.4*logoEase + pad;
    ctx.save(); ctx.globalAlpha = logoEase;
    drawLogo(ctx, logoX, H*0.028, W*0.38, false);
    ctx.restore();

    // TITRE — fade + scale
    const titreProgress = style==="zoom"
      ? Math.min(1, Math.max(0, (t-0.1)*3))
      : Math.min(1, Math.max(0, (t-0.15)*2.5));
    const titreScale = style==="zoom" ? 0.5 + 0.5*titreProgress : 1;
    const titreAlpha = titreProgress;
    const titreFontSize = W*0.095;
    const titreY = H*0.2;
    ctx.save();
    ctx.globalAlpha = titreAlpha;
    ctx.translate(W/2, titreY);
    ctx.scale(titreScale, titreScale);
    ctx.translate(-W/2, -titreY);
    const titreWords = typeObj.titre.split(" ");
    const l1 = titreWords.slice(0,Math.ceil(titreWords.length/2)).join(" ");
    const l2 = titreWords.slice(Math.ceil(titreWords.length/2)).join(" ");
    ctx.font=`900 ${titreFontSize}px Arial Black,Arial`;
    ctx.textAlign="center";
    ctx.fillStyle=typeObj.ombre;
    ctx.fillText(l1,W/2+5,titreY+5);
    ctx.fillText(l2,W/2+5,titreY+titreFontSize*1.2+5);
    ctx.strokeStyle="#000"; ctx.lineWidth=titreFontSize*0.07;
    ctx.fillStyle=typeObj.couleurTitre;
    ctx.strokeText(l1,W/2,titreY); ctx.fillText(l1,W/2,titreY);
    ctx.strokeText(l2,W/2,titreY+titreFontSize*1.2); ctx.fillText(l2,W/2,titreY+titreFontSize*1.2);
    ctx.restore();

    // PRODUIT — slide depuis droite
    const prodProgress = Math.min(1, Math.max(0,(t-0.25)*2.5));
    const prodEase = 1-Math.pow(1-prodProgress,3);
    const prodOffX = style==="slide" ? W*(1-prodEase)*0.3 : 0;
    ctx.save(); ctx.globalAlpha = prodEase;
    ctx.translate(prodOffX,0);
    ctx.fillStyle=typeObj.couleurTitre;
    ctx.font=`900 ${W*0.065}px Arial Black,Arial`;
    ctx.textAlign="left";
    ctx.fillText(produit, pad, H*0.41);
    if(specs){
      ctx.fillStyle="rgba(255,255,255,0.6)";
      ctx.font=`${W*0.03}px Arial`;
      ctx.fillText(specs, pad, H*0.41+W*0.04);
    }
    ctx.restore();

    // PRIX — pulse animé
    const prixProgress = Math.min(1, Math.max(0,(t-0.35)*2.5));
    const prixPulse = style==="pulse"
      ? 1 + Math.sin(t*8)*0.04*(prixProgress)
      : 1;
    ctx.save();
    ctx.globalAlpha = prixProgress;
    ctx.translate(pad + W*0.2, H*0.5);
    ctx.scale(prixPulse, prixPulse);
    ctx.translate(-(pad + W*0.2), -H*0.5);
    // Halo derrière le prix
    if(prixProgress>0.5){
      const halo=ctx.createRadialGradient(pad+W*0.25,H*0.5,0,pad+W*0.25,H*0.5,W*0.25);
      halo.addColorStop(0,`rgba(255,215,0,${0.12*prixProgress})`);
      halo.addColorStop(1,"transparent");
      ctx.fillStyle=halo; ctx.fillRect(0,H*0.44,W*0.55,H*0.14);
    }
    ctx.fillStyle="#FFD700";
    ctx.font=`900 ${W*0.072}px Arial Black,Arial`;
    ctx.textAlign="left";
    ctx.fillText(prix+" FCFA", pad, H*0.52);
    ctx.restore();

    // POINTS — apparaissent un par un
    points.slice(0,6).forEach((pt,i)=>{
      const ptDelay = 0.45 + i*0.08;
      const ptProgress = Math.min(1,Math.max(0,(t-ptDelay)*4));
      const ptAlpha = ptProgress;
      const ptOffX = style==="slide" ? W*0.08*(1-ptProgress) : 0;
      const col = i%2===0 ? pad : W*0.52;
      const row = Math.floor(i/2);
      ctx.save();
      ctx.globalAlpha = ptAlpha;
      ctx.fillStyle = "#FFFFFF";
      ctx.font=`600 ${W*0.03}px Arial`;
      ctx.textAlign="left";
      ctx.fillText(pt, col+ptOffX, H*0.58+row*W*0.055);
      ctx.restore();
    });

    // CONTACT — fade in à la fin
    const ctProgress = Math.min(1,Math.max(0,(t-0.75)*3));
    ctx.save();
    ctx.globalAlpha=ctProgress;
    // Ligne séparatrice
    const sepY=H*0.74;
    const sepGrad=ctx.createLinearGradient(pad,sepY,W-pad,sepY);
    sepGrad.addColorStop(0,"transparent");
    sepGrad.addColorStop(0.2,"#1400FF");
    sepGrad.addColorStop(0.8,"#CC0000");
    sepGrad.addColorStop(1,"transparent");
    ctx.strokeStyle=sepGrad; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(pad,sepY); ctx.lineTo(W-pad,sepY); ctx.stroke();
    ctx.fillStyle="rgba(255,215,0,0.9)";
    ctx.font=`700 ${W*0.028}px Arial`; ctx.textAlign="left";
    ctx.fillText(`📞 ${contact}`, pad, H*0.78);
    ctx.fillStyle="rgba(255,255,255,0.7)";
    ctx.font=`${W*0.026}px Arial`;
    ctx.fillText(`📍 ${localisation}`, pad, H*0.78+W*0.036);
    // Réseaux sociaux
    [`📸 ${instagram}`,`👥 ${facebook}`,`🎵 ${tiktok}`].forEach((r,i)=>{
      ctx.fillStyle="rgba(255,255,255,0.75)";
      ctx.fillText(r, W*0.52, H*0.78+i*W*0.036);
    });
    // Slogan
    ctx.fillStyle="rgba(255,255,255,0.35)";
    ctx.font=`${W*0.024}px Arial`; ctx.textAlign="center";
    ctx.fillText("angy-company.vercel.app · Votre satisfaction, notre priorité.", W/2, H*0.94);
    ctx.restore();

    // PARTICULES (style pulse)
    if(style==="pulse" && t>0.5){
      for(let i=0;i<8;i++){
        const angle=(i/8)*Math.PI*2+t*2;
        const dist=W*0.08+Math.sin(t*3+i)*W*0.02;
        const px=W/2+Math.cos(angle)*dist;
        const py=H*0.52+Math.sin(angle)*dist*0.3;
        ctx.fillStyle=`rgba(255,215,0,${0.4*Math.sin(t*4+i)})`;
        ctx.beginPath(); ctx.arc(px,py,W*0.006,0,Math.PI*2); ctx.fill();
      }
    }
  }, [produit,prix,specs,points,type,contact,localisation,instagram,facebook,tiktok]);

  const lancerAnimation = useCallback(() => {
    const canvas = animCanvasRef.current;
    if(!canvas || animRunning) return;
    const fmt = FORMATS.find(f=>f.id===format);
    canvas.width = Math.round(fmt.w/2);
    canvas.height = Math.round(fmt.h/2);
    setAnimRunning(true);
    setAnimProgress(0);
    const duration = 3.5; // secondes
    const fps = 30;
    let frame = 0;
    const totalFrames = duration*fps;
    const tick = () => {
      const t = Math.min(frame/totalFrames, 1);
      drawAnimFrame(canvas, t, animStyle);
      setAnimProgress(Math.round(t*100));
      frame++;
      if(frame<=totalFrames) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setAnimRunning(false);
        setAnimProgress(100);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [animRunning, format, animStyle, drawAnimFrame]);

  const arreterAnimation = () => {
    if(animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setAnimRunning(false);
  };

  const exporterVideo = useCallback(() => {
    const canvas = animCanvasRef.current;
    if(!canvas || enregistrement) return;
    const fmt = FORMATS.find(f=>f.id===format);
    canvas.width = Math.round(fmt.w/2);
    canvas.height = Math.round(fmt.h/2);
    const stream = canvas.captureStream(30);
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, {mimeType:"video/webm;codecs=vp9"});
    recorder.ondataavailable = e => { if(e.data.size>0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {type:"video/webm"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href=url; a.download=`ANGY_${produit.replace(/ /g,"_")}_video.webm`;
      a.click(); URL.revokeObjectURL(url);
      setEnregistrement(false);
      showToast("✅ Vidéo téléchargée !");
    };
    recorderRef.current = recorder;
    recorder.start();
    setEnregistrement(true);
    const duration=3.5, fps=30, totalFrames=duration*fps;
    let frame=0;
    const tick=()=>{
      const t=Math.min(frame/totalFrames,1);
      drawAnimFrame(canvas,t,animStyle);
      frame++;
      if(frame<=totalFrames) requestAnimationFrame(tick);
      else recorder.stop();
    };
    requestAnimationFrame(tick);
  },[enregistrement,format,produit,animStyle,drawAnimFrame]);

  useEffect(()=>{
    return ()=>{ if(animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  },[]);

  const css = {
    panel:{background:D.card,border:`1px solid ${D.border}`,borderRadius:16,padding:18,marginBottom:12},
    ptitle:{fontSize:11,fontWeight:700,color:D.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12},
    label:{display:"block",fontSize:11,fontWeight:600,color:D.muted,marginBottom:5},
    input:{width:"100%",background:D.input,border:`1px solid ${D.inputBorder}`,borderRadius:9,padding:"8px 11px",color:D.text,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"},
    sel:{width:"100%",background:D.sel,border:`1px solid ${D.inputBorder}`,borderRadius:9,padding:"8px 11px",color:D.text,fontSize:13,fontFamily:"inherit",outline:"none",cursor:"pointer"},
    row:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},
    btn:(c="#1400FF")=>({width:"100%",padding:"12px",borderRadius:11,background:c,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}),
    btnSec:{width:"100%",padding:"10px",borderRadius:11,background:D.input,color:D.text,border:`1px solid ${D.border}`,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:8},
    tab:(a)=>({padding:"8px 16px",borderRadius:10,border:"1px solid",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",borderColor:a?"#1400FF":D.border,background:a?"#1400FF":"transparent",color:a?"#fff":D.muted}),
  };

  return (
    <div style={{minHeight:"100vh",background:D.bg,color:D.text,fontFamily:"'SF Pro Display','Segoe UI',system-ui,sans-serif",transition:"all 0.2s"}}>

      {/* HEADER */}
      <header style={{background:dark?"rgba(8,8,15,0.97)":"rgba(240,240,248,0.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${D.border}`,padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,gap:12}}>
        <AngyLogo width={150} light={!dark}/>
        <div style={{display:"flex",gap:6,overflowX:"auto"}}>
          {[["creer","✨ Créer"],["animer","🎬 Animer"],["scripts","🎤 Scripts"],["calendrier","📅 Calendrier"],["stats","📊 Stats"],["planifier","🗓 Planifier"],["historique","🗂 Historique"]].map(([id,lbl])=>(
            <button key={id} style={css.tab(tab===id)} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>
        <button onClick={()=>setDark(d=>!d)} style={{background:D.input,border:`1px solid ${D.border}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:17,flexShrink:0}}>
          {dark?"☀️":"🌙"}
        </button>
      </header>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"18px 14px"}}>

        {/* ══ CRÉER ══ */}
        {tab==="creer"&&(
          <div style={{display:"grid",gridTemplateColumns:"clamp(280px,28%,360px) 1fr",gap:16,alignItems:"start"}}>

            {/* GAUCHE */}
            <div>
              {/* TYPE */}
              <div style={css.panel}>
                <div style={css.ptitle}>Type de visuel</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  {TYPES.map(t=>(
                    <button key={t.id} onClick={()=>setType(t.id)} style={{padding:"9px 6px",borderRadius:10,border:`1px solid ${type===t.id?"#1400FF":D.border}`,background:type===t.id?"rgba(20,0,255,0.12)":"transparent",color:type===t.id?"#6680FF":D.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,textAlign:"center",transition:"all 0.15s"}}>
                      <div style={{fontSize:20,marginBottom:3}}>{t.icon}</div>{t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRODUIT */}
              <div style={css.panel}>
                <div style={css.ptitle}>Produit & prix</div>
                <div style={{marginBottom:10}}>
                  <label style={css.label}>Produit</label>
                  <select style={css.sel} value={produitIdx} onChange={e=>setProduitIdx(Number(e.target.value))}>
                    {PRODUITS.map((p,i)=><option key={i} value={i}>{p.emoji} {p.nom}</option>)}
                  </select>
                </div>
                {produitIdx===11&&(
                  <div style={{marginBottom:10}}>
                    <label style={css.label}>Nom personnalisé</label>
                    <input style={css.input} value={customProduit} onChange={e=>setCustomProduit(e.target.value)} placeholder="Ex: Samsung Galaxy S24"/>
                  </div>
                )}
                <div style={css.row}>
                  <div>
                    <label style={css.label}>Prix (FCFA)</label>
                    <input style={css.input} value={prix} onChange={e=>setPrix(e.target.value)}/>
                  </div>
                  <div>
                    <label style={css.label}>Format</label>
                    <select style={css.sel} value={format} onChange={e=>setFormat(e.target.value)}>
                      {FORMATS.map(f=><option key={f.id} value={f.id}>{f.label} {f.ratio}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginTop:10}}>
                  <label style={css.label}>Couleur / Stockage</label>
                  <input style={css.input} value={specs} onChange={e=>setSpecs(e.target.value)} placeholder="Ex: 256GB Noir Titane"/>
                </div>
              </div>

              {/* PHOTO */}
              <div style={css.panel}>
                <div style={css.ptitle}>📸 Photo du produit</div>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
                {!photoPreview ? (
                  <button onClick={()=>photoInputRef.current.click()}
                    style={{width:"100%",padding:"20px",borderRadius:12,border:`2px dashed ${D.border}`,background:"transparent",color:D.muted,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,textAlign:"center",transition:"all 0.15s"}}>
                    <div style={{fontSize:32,marginBottom:8}}>📸</div>
                    Appuyez pour ajouter une photo<br/>
                    <span style={{fontSize:11,fontWeight:400}}>JPG, PNG — votre iPhone, MacBook...</span>
                  </button>
                ) : (
                  <div>
                    <img src={photoPreview} alt="Produit" style={{width:"100%",borderRadius:12,objectFit:"cover",maxHeight:180,border:`1px solid ${D.border}`}}/>
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button onClick={()=>photoInputRef.current.click()} style={{flex:1,padding:"8px",borderRadius:9,background:D.input,border:`1px solid ${D.border}`,color:D.text,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
                        🔄 Changer
                      </button>
                      <button onClick={supprimerPhoto} style={{flex:1,padding:"8px",borderRadius:9,background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.3)",color:"#FF453A",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>
                        🗑 Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* POINTS */}
              <div style={css.panel}>
                <div style={css.ptitle}>Points clés (2 colonnes)</div>
                {points.map((pt,i)=>(
                  <div key={i} style={{display:"flex",gap:6,marginBottom:7,alignItems:"center"}}>
                    <input style={{...css.input,flex:1}} value={pt} onChange={e=>{const p=[...points];p[i]=e.target.value;setPoints(p);}}/>
                    <button onClick={()=>setPoints(points.filter((_,j)=>j!==i))} style={{background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.3)",color:"#FF453A",borderRadius:8,padding:"6px 9px",cursor:"pointer",fontSize:13,fontFamily:"inherit",flexShrink:0}}>✕</button>
                  </div>
                ))}
                <button onClick={()=>setPoints([...points,"✅ Nouveau point"])} style={{...css.btnSec,marginTop:4}}>+ Ajouter un point</button>
              </div>

              {/* CONTACT */}
              <div style={css.panel}>
                <div style={css.ptitle}>Coordonnées</div>
                {[["Téléphone(s)",contact,setContact],["Localisation",localisation,setLocalisation],["Instagram",instagram,setInstagram],["Facebook",facebook,setFacebook],["TikTok / Snap",tiktok,setTiktok]].map(([lbl,val,set])=>(
                  <div key={lbl} style={{marginBottom:9}}>
                    <label style={css.label}>{lbl}</label>
                    <input style={css.input} value={val} onChange={e=>set(e.target.value)}/>
                  </div>
                ))}
              </div>

              {/* IA */}
              <div style={css.panel}>
                <div style={css.ptitle}>🤖 IA — Légende automatique</div>
                <button style={css.btn("#7700CC")} onClick={genLegende} disabled={loadingL}>
                  {loadingL?"⏳ Génération...":"✍️ Générer la légende"}
                </button>
              </div>
            </div>

            {/* DROITE */}
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
                <div style={{fontWeight:800,fontSize:18}}>Aperçu</div>
                <button onClick={telecharger} style={{background:"linear-gradient(135deg,#1400FF,#7700CC)",color:"#fff",border:"none",padding:"10px 22px",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:14,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(20,0,255,0.3)"}}>
                  ⬇️ Télécharger PNG
                </button>
              </div>

              <div style={{display:"flex",justifyContent:"center",background:dark?"repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%,transparent 0% 50%) 0 0/20px 20px":"repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%,transparent 0% 50%) 0 0/20px 20px",borderRadius:16,border:`1px solid ${D.border}`,padding:22,marginBottom:14}}>
                <canvas ref={canvasRef} style={{borderRadius:12,maxWidth:"100%",maxHeight:580,objectFit:"contain",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}/>
              </div>

              {legende&&(
                <div style={{...css.panel,borderLeft:"3px solid #7700CC"}}>
                  <div style={{...css.ptitle,color:"#9955FF"}}>✍️ Légende générée</div>
                  <div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{legende}</div>
                  <button onClick={()=>{navigator.clipboard.writeText(legende);showToast("✅ Légende copiée !");}} style={{marginTop:10,padding:"7px 14px",borderRadius:8,background:D.input,border:`1px solid ${D.border}`,color:D.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    📋 Copier
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ ANIMER ══ */}
        {tab==="animer"&&(
          <div style={{display:"grid",gridTemplateColumns:"clamp(280px,28%,340px) 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div style={css.panel}>
                <div style={css.ptitle}>🎬 Style d'animation</div>
                {[
                  {id:"slide",label:"Slide",desc:"Éléments glissent depuis les côtés",icon:"➡️"},
                  {id:"pulse",label:"Pulse",desc:"Prix pulsant avec particules dorées",icon:"💫"},
                  {id:"zoom",label:"Zoom",desc:"Titre apparaît en zoom depuis le centre",icon:"🔍"},
                ].map(s=>(
                  <button key={s.id} onClick={()=>setAnimStyle(s.id)}
                    style={{width:"100%",padding:"12px 14px",borderRadius:11,border:`1px solid ${animStyle===s.id?"#1400FF":D.border}`,background:animStyle===s.id?"rgba(20,0,255,0.1)":"transparent",color:animStyle===s.id?"#6680FF":D.text,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:8,transition:"all 0.15s"}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:22}}>{s.icon}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{s.label}</div>
                        <div style={{fontSize:11,color:D.muted,marginTop:2}}>{s.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div style={css.panel}>
                <div style={css.ptitle}>Format</div>
                <select style={css.sel} value={format} onChange={e=>setFormat(e.target.value)}>
                  {FORMATS.map(f=><option key={f.id} value={f.id}>{f.label} {f.ratio}</option>)}
                </select>
              </div>

              <div style={css.panel}>
                <div style={css.ptitle}>⚠️ Compatibilité</div>
                <div style={{fontSize:12,color:D.muted,lineHeight:1.7}}>
                  La vidéo est exportée en format <strong style={{color:D.text}}>WebM</strong> — compatible avec :<br/>
                  ✅ Chrome, Firefox<br/>
                  ✅ Android<br/>
                  ⚠️ iOS Safari — ouvrir dans Chrome<br/><br/>
                  Pour convertir en MP4 :<br/>
                  → Importez dans <strong style={{color:D.text}}>CapCut</strong> et exportez en MP4
                </div>
              </div>
            </div>

            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
                <div style={{fontWeight:800,fontSize:18}}>Aperçu animé</div>
                <div style={{display:"flex",gap:8}}>
                  {animRunning
                    ?<button onClick={arreterAnimation} style={{background:"rgba(255,69,58,0.15)",border:"1px solid #FF453A",color:"#FF453A",padding:"9px 18px",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>⏹ Arrêter</button>
                    :<button onClick={lancerAnimation} style={{background:"rgba(20,0,255,0.15)",border:"1px solid #1400FF",color:"#6680FF",padding:"9px 18px",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>▶️ Prévisualiser</button>
                  }
                  <button onClick={exporterVideo} disabled={enregistrement}
                    style={{background:"linear-gradient(135deg,#CC0000,#FF4400)",color:"#fff",border:"none",padding:"9px 18px",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit",opacity:enregistrement?0.7:1}}>
                    {enregistrement?"⏳ Export...":"⬇️ Exporter WebM"}
                  </button>
                </div>
              </div>

              {/* Barre de progression */}
              {(animRunning||animProgress>0)&&(
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:D.muted,marginBottom:6}}>
                    <span>{animRunning?"Animation en cours...":"Terminé ✅"}</span>
                    <span>{animProgress}%</span>
                  </div>
                  <div style={{height:4,background:D.border,borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${animProgress}%`,background:"linear-gradient(90deg,#1400FF,#CC0000)",borderRadius:99,transition:"width 0.1s"}}/>
                  </div>
                </div>
              )}

              <div style={{display:"flex",justifyContent:"center",background:dark?"repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%,transparent 0% 50%) 0 0/20px 20px":"repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%,transparent 0% 50%) 0 0/20px 20px",borderRadius:16,border:`1px solid ${D.border}`,padding:22}}>
                <canvas ref={animCanvasRef} style={{borderRadius:12,maxWidth:"100%",maxHeight:560,objectFit:"contain",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}/>
              </div>

              <div style={{...css.panel,marginTop:14,borderLeft:"3px solid #FFD700"}}>
                <div style={{...css.ptitle,color:"#FFD700"}}>💡 Workflow recommandé</div>
                <div style={{fontSize:13,lineHeight:1.8,color:D.text}}>
                  1️⃣ Prévisualisez l'animation<br/>
                  2️⃣ Exportez en WebM<br/>
                  3️⃣ Importez dans <strong>CapCut</strong><br/>
                  4️⃣ Ajoutez musique + effets<br/>
                  5️⃣ Exportez en MP4 → publiez sur TikTok ! 🚀
                </div>
              </div>
            </div>
          </div>
        )}


        {tab==="planifier"&&(
          <div style={{display:"grid",gridTemplateColumns:"clamp(280px,33%,400px) 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div style={css.panel}>
                <div style={css.ptitle}>Programmer une publication</div>
                <div style={{marginBottom:10}}>
                  <label style={css.label}>Réseau social</label>
                  <select style={css.sel} value={planReseau} onChange={e=>setPlanReseau(e.target.value)}>
                    {["📘 Facebook","📸 Instagram","🎵 TikTok","💬 WhatsApp Status","👻 Snapchat"].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div style={css.row}>
                  <div>
                    <label style={css.label}>Date</label>
                    <input type="date" style={css.input} value={planDate} onChange={e=>setPlanDate(e.target.value)}/>
                  </div>
                  <div>
                    <label style={css.label}>Heure</label>
                    <select style={css.sel} value={planHeure} onChange={e=>setPlanHeure(e.target.value)}>
                      {["07:00","09:00","12:00","18:00","20:00","21:00"].map(h=><option key={h} value={h}>{h}{h==="18:00"?" ⭐":""}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginTop:10,marginBottom:10}}>
                  <label style={css.label}>Note</label>
                  <input style={css.input} value={planNote} onChange={e=>setPlanNote(e.target.value)} placeholder={`${produit} — ${prix} FCFA`}/>
                </div>
                <button style={css.btn()} onClick={()=>{
                  if(!planDate) return showToast("Choisissez une date !");
                  const item={id:Date.now(),reseau:planReseau,date:planDate,heure:planHeure,note:planNote||`${produit} — ${prix} FCFA`};
                  const p=[...planning,item].sort((a,b)=>new Date(a.date+"T"+a.heure)-new Date(b.date+"T"+b.heure));
                  setPlanning(p); localStorage.setItem("angy_plan",JSON.stringify(p));
                  setPlanNote(""); showToast("✅ Ajouté !");
                }}>➕ Ajouter au planning</button>
              </div>
              <div style={css.panel}>
                <div style={css.ptitle}>⏰ Meilleurs horaires — Dakar</div>
                {[["🌅","7h–9h","Fort trafic matinal","rgba(20,0,255,0.1)","rgba(20,0,255,0.3)"],
                  ["☀️","12h–13h","Pic déjeuner","rgba(0,200,100,0.1)","rgba(0,200,100,0.3)"],
                  ["🌆","18h–21h ⭐","Meilleur créneau !","rgba(255,159,10,0.12)","rgba(255,159,10,0.4)"],
                  ["🌙","21h–23h","TikTok très actif","rgba(150,0,200,0.1)","rgba(150,0,200,0.3)"],
                ].map(([ic,h,d,bg,bo])=>(
                  <div key={h} style={{background:bg,border:`1px solid ${bo}`,borderRadius:10,padding:"10px 12px",marginBottom:7,display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:20}}>{ic}</span>
                    <div><div style={{fontWeight:700,fontSize:12}}>{h}</div><div style={{fontSize:11,color:D.muted}}>{d}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={css.panel}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={css.ptitle}>Planning ({planning.length})</div>
                {planning.length>0&&<button onClick={()=>{setPlanning([]);localStorage.removeItem("angy_plan");}} style={{background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.3)",color:"#FF453A",padding:"4px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Effacer</button>}
              </div>
              {planning.length===0
                ?<div style={{textAlign:"center",padding:"3rem",color:D.muted,fontSize:14}}>Aucune publication planifiée</div>
                :planning.map(item=>(
                  <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:D.input,border:`1px solid ${D.border}`,borderRadius:11,marginBottom:9}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <span style={{fontSize:24}}>{item.reseau.split(" ")[0]}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{item.note}</div>
                        <div style={{fontSize:11,color:D.muted,marginTop:2}}>{item.reseau} · {new Date(item.date).toLocaleDateString("fr-FR")} à {item.heure}</div>
                      </div>
                    </div>
                    <button onClick={()=>{const p=planning.filter(x=>x.id!==item.id);setPlanning(p);localStorage.setItem("angy_plan",JSON.stringify(p));}} style={{background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.3)",color:"#FF453A",padding:"4px 9px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>✕</button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ══ HISTORIQUE ══ */}
        {tab==="historique"&&(
          <div style={css.panel}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={css.ptitle}>Visuels générés ({history.length})</div>
              {history.length>0&&<button onClick={()=>{setHistory([]);localStorage.removeItem("angy_hist");showToast("Effacé");}} style={{background:"rgba(255,69,58,0.1)",border:"1px solid rgba(255,69,58,0.3)",color:"#FF453A",padding:"5px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>🗑 Effacer</button>}
            </div>
            {history.length===0
              ?<div style={{textAlign:"center",padding:"4rem",color:D.muted}}>
                <div style={{fontSize:48,marginBottom:10}}>🎨</div>
                <div style={{fontSize:15,fontWeight:600}}>Aucun visuel encore</div>
                <div style={{fontSize:13,marginTop:5}}>Créez votre premier visuel dans "Créer" !</div>
              </div>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
                {history.map(item=>(
                  <div key={item.id} style={{borderRadius:12,overflow:"hidden",border:`1px solid ${D.border}`,cursor:"pointer",transition:"transform 0.15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    <img src={item.thumb} alt={item.label} style={{width:"100%",display:"block"}}/>
                    <div style={{padding:"7px 9px",background:D.card}}>
                      <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</div>
                      <div style={{fontSize:10,color:D.muted,marginTop:2}}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

        {/* ══ SCRIPTS TIKTOK ══ */}
        {tab==="scripts"&&(()=>{
          const [scriptType, setScriptType] = useState("unboxing");
          const [scriptProduit, setScriptProduit] = useState(produit);
          const [scriptPrix, setScriptPrix] = useState(prix);
          const [scriptResult, setScriptResult] = useState("");
          const [scriptLoading, setScriptLoading] = useState(false);
          const [legendeReseau, setLegendeReseau] = useState("tiktok");
          const [legendeResult, setLegendeResult] = useState("");
          const [legendeLoading, setLegendeLoading] = useState(false);

          const SCRIPT_TYPES = [
            {id:"unboxing", label:"📦 Unboxing", desc:"Déballer un iPhone en vidéo"},
            {id:"comparaison", label:"⚖️ Comparaison", desc:"Comparer 2 modèles"},
            {id:"conseil", label:"💡 Conseil", desc:"Éduquer sur les iPhone"},
            {id:"temoignage", label:"⭐ Témoignage", desc:"Client satisfait"},
            {id:"promo", label:"🔥 Promo flash", desc:"Offre limitée urgente"},
            {id:"authentification", label:"🛡️ Authentification", desc:"Vrai vs faux iPhone"},
          ];

          const RESEAUX = [
            {id:"tiktok", label:"🎵 TikTok", hashtags:"#iPhone #Dakar #Tech #ANGY #iPhoneSenegal #TechDakar #AngyCompany"},
            {id:"instagram", label:"📸 Instagram", hashtags:"#iPhone #Dakar #TechSenegal #ANGY #iPhoneDakar #AngyCompany #Senegal"},
            {id:"facebook", label:"📘 Facebook", hashtags:"#ANGY #iPhone #Dakar #TechSenegal"},
            {id:"snapchat", label:"👻 Snapchat", hashtags:"#iPhone #Dakar #ANGY"},
          ];

          const genScript = async() => {
            setScriptLoading(true); setScriptResult("");
            const prompts = {
              unboxing: `Écris un script TikTok de 30-45 secondes pour un unboxing de ${scriptProduit} à ${scriptPrix} FCFA vendu chez ANGY COMPANY à Dakar. Structure: ACCROCHE (0-3s) · PRÉSENTATION (3-15s) · DÉBALLAGE (15-30s) · PRIX ET CONTACT (30-45s). Style naturel sénégalais, enthousiaste. Contact: +221 78 116 32 86`,
              comparaison: `Écris un script TikTok 30-45s pour comparer le ${scriptProduit} avec un modèle moins cher. Structure: ACCROCHE · DIFFÉRENCES CLÉS · LEQUEL CHOISIR · PRIX CHEZ ANGY. Style direct et éducatif. Contact: +221 78 116 32 86`,
              conseil: `Écris un script TikTok 30-45s donnant 3 conseils pour bien choisir son iPhone, en mentionnant ANGY COMPANY Dakar comme vendeur de confiance. Contact: +221 78 116 32 86`,
              temoignage: `Écris un script TikTok 30s simulant un témoignage de client satisfait d'ANGY COMPANY Dakar qui a acheté un ${scriptProduit}. Style authentique sénégalais. Contact: +221 78 116 32 86`,
              promo: `Écris un script TikTok URGENT de 20-30s pour annoncer une promo flash sur ${scriptProduit} à ${scriptPrix} FCFA chez ANGY COMPANY Dakar. Crée maximum d'urgence. Contact: +221 78 116 32 86`,
              authentification: `Écris un script TikTok éducatif 30-45s expliquant comment reconnaître un vrai iPhone d'une contrefaçon, en positionnant ANGY COMPANY comme vendeur certifié à Dakar. Contact: +221 78 116 32 86`,
            };
            try { setScriptResult(await callIA(prompts[scriptType]||prompts.unboxing)); }
            catch { setScriptResult("Erreur — vérifiez votre connexion"); }
            setScriptLoading(false);
          };

          const genLegende = async() => {
            setLegendeLoading(true); setLegendeResult("");
            const reseau = RESEAUX.find(r=>r.id===legendeReseau);
            try {
              setLegendeResult(await callIA(`Écris une légende optimisée pour ${reseau.label} pour vendre le ${scriptProduit} à ${scriptPrix} FCFA chez ANGY COMPANY Dakar. Contact: +221 78 116 32 86. Site: angy-company-site.vercel.app. Inclus ces hashtags: ${reseau.hashtags}. Style sénégalais naturel. Max 100 mots.`));
            } catch { setLegendeResult("Erreur — vérifiez votre connexion"); }
            setLegendeLoading(false);
          };

          return (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* SCRIPTS */}
              <div>
                <div style={css.panel}>
                  <div style={css.ptitle}>🎤 Générateur de scripts TikTok</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                    {SCRIPT_TYPES.map(s=>(
                      <button key={s.id} onClick={()=>setScriptType(s.id)} style={{padding:"10px 8px",borderRadius:10,border:`1px solid ${scriptType===s.id?"#1400FF":D.border}`,background:scriptType===s.id?"rgba(20,0,255,0.12)":"transparent",color:scriptType===s.id?"#6680FF":D.muted,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,textAlign:"center",transition:"all 0.15s"}}>
                        <div style={{fontSize:18,marginBottom:3}}>{s.label.split(" ")[0]}</div>
                        {s.label.split(" ").slice(1).join(" ")}<br/>
                        <span style={{fontSize:10,fontWeight:400}}>{s.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={css.label}>Produit</label>
                    <input style={css.input} value={scriptProduit} onChange={e=>setScriptProduit(e.target.value)}/>
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={css.label}>Prix (FCFA)</label>
                    <input style={css.input} value={scriptPrix} onChange={e=>setScriptPrix(e.target.value)}/>
                  </div>
                  <button style={css.btn("#CC0000")} onClick={genScript} disabled={scriptLoading}>
                    {scriptLoading?"⏳ Génération...":"🎬 Générer le script"}
                  </button>
                  {scriptResult&&(
                    <div style={{marginTop:14,background:D.input,borderRadius:12,padding:14,border:`1px solid ${D.border}`}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#CC0000",marginBottom:8,textTransform:"uppercase"}}>📝 Script prêt à filmer</div>
                      <div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:D.text}}>{scriptResult}</div>
                      <button onClick={()=>{navigator.clipboard.writeText(scriptResult);showToast("✅ Script copié !");}} style={{marginTop:10,padding:"7px 14px",borderRadius:8,background:D.input,border:`1px solid ${D.border}`,color:D.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📋 Copier</button>
                    </div>
                  )}
                </div>
              </div>

              {/* LÉGENDES */}
              <div>
                <div style={css.panel}>
                  <div style={css.ptitle}>📝 Légendes optimisées par réseau</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                    {RESEAUX.map(r=>(
                      <button key={r.id} onClick={()=>setLegendeReseau(r.id)} style={{padding:"8px 12px",borderRadius:10,border:`1px solid ${legendeReseau===r.id?"#1400FF":D.border}`,background:legendeReseau===r.id?"rgba(20,0,255,0.12)":"transparent",color:legendeReseau===r.id?"#6680FF":D.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,transition:"all 0.15s"}}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <button style={css.btn("#7700CC")} onClick={genLegende} disabled={legendeLoading}>
                    {legendeLoading?"⏳ Génération...":"✍️ Générer la légende"}
                  </button>
                  {legendeResult&&(
                    <div style={{marginTop:14,background:D.input,borderRadius:12,padding:14,border:`1px solid ${D.border}`}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#7700CC",marginBottom:8,textTransform:"uppercase"}}>
                        ✍️ Légende {RESEAUX.find(r=>r.id===legendeReseau)?.label}
                      </div>
                      <div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:D.text}}>{legendeResult}</div>
                      <button onClick={()=>{navigator.clipboard.writeText(legendeResult);showToast("✅ Légende copiée !");}} style={{marginTop:10,padding:"7px 14px",borderRadius:8,background:D.input,border:`1px solid ${D.border}`,color:D.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📋 Copier</button>
                    </div>
                  )}
                </div>

                {/* HASHTAGS */}
                <div style={css.panel}>
                  <div style={css.ptitle}>🏷️ Hashtags optimisés</div>
                  {RESEAUX.map(r=>(
                    <div key={r.id} style={{marginBottom:12,padding:"10px 12px",background:D.input,borderRadius:10,border:`1px solid ${D.border}`}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>{r.label}</div>
                      <div style={{fontSize:11,color:D.muted,lineHeight:1.8}}>{r.hashtags}</div>
                      <button onClick={()=>{navigator.clipboard.writeText(r.hashtags);showToast("✅ Hashtags copiés !");}} style={{marginTop:6,padding:"4px 10px",borderRadius:7,background:"transparent",border:`1px solid ${D.border}`,color:D.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>📋 Copier</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ CALENDRIER 30 JOURS ══ */}
        {tab==="calendrier"&&(()=>{
          const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
          const CONTENU_PAR_JOUR = [
            {jour:"Lundi",   icon:"📦", type:"Unboxing",      reseau:"TikTok",    desc:"Déballez un iPhone du stock"},
            {jour:"Mardi",   icon:"⚖️", type:"Comparaison",   reseau:"Instagram", desc:"Comparez 2 modèles iPhone"},
            {jour:"Mercredi",icon:"💬", type:"Témoignage",    reseau:"Facebook",  desc:"Partagez un avis client"},
            {jour:"Jeudi",   icon:"💡", type:"Conseil tech",  reseau:"TikTok",    desc:"3 conseils pour choisir"},
            {jour:"Vendredi",icon:"💰", type:"Prix du jour",  reseau:"Facebook",  desc:"Publiez les dispo du jour"},
            {jour:"Samedi",  icon:"🔥", type:"Promo flash",   reseau:"Instagram", desc:"Offre spéciale weekend"},
            {jour:"Dimanche",icon:"📸", type:"Story du jour", reseau:"WhatsApp",  desc:"Votre journée de vendeur"},
          ];

          const semaines = Array.from({length:4},(_,s)=>
            CONTENU_PAR_JOUR.map((c,j)=>({
              ...c,
              jour:`J${s*7+j+1} — ${c.jour}`,
              semaine: s+1,
            }))
          ).flat();

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontWeight:800,fontSize:20}}>📅 Calendrier de contenu — 30 jours</div>
                  <div style={{fontSize:13,color:D.muted,marginTop:4}}>Plan de publication complet pour exploser sur les réseaux</div>
                </div>
              </div>
              {[1,2,3,4].map(sem=>(
                <div key={sem} style={{...css.panel,marginBottom:16}}>
                  <div style={{...css.ptitle,color:"#1400FF"}}>Semaine {sem} — Objectif : {sem===1?"Lancer":sem===2?"Accélérer":sem===3?"Engager":"Convertir"}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
                    {semaines.filter(j=>j.semaine===sem).map((j,i)=>(
                      <div key={i} style={{background:D.input,borderRadius:12,padding:"10px 8px",border:`1px solid ${D.border}`,textAlign:"center"}}>
                        <div style={{fontSize:20,marginBottom:4}}>{j.icon}</div>
                        <div style={{fontSize:10,fontWeight:700,color:D.muted,marginBottom:4}}>{j.jour}</div>
                        <div style={{fontSize:11,fontWeight:700,color:D.text,marginBottom:3}}>{j.type}</div>
                        <div style={{fontSize:10,color:"#1400FF",fontWeight:600,marginBottom:4}}>{j.reseau}</div>
                        <div style={{fontSize:10,color:D.muted,lineHeight:1.4}}>{j.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* CONSEILS */}
              <div style={css.panel}>
                <div style={css.ptitle}>💡 Règles d'or pour exploser</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[
                    ["🕐","Publiez aux bons horaires","7h · 12h · 18h-21h à Dakar"],
                    ["👤","Montrez votre visage","Les gens achètent à des personnes"],
                    ["💬","Répondez à TOUS les commentaires","L'algorithme adore ça"],
                    ["🔄","Recyclez votre contenu","1 vidéo TikTok = 1 Reel = 1 Facebook"],
                    ["📈","Soyez régulier","1 post/jour minimum"],
                    ["🎯","Utilisez les tendances","Sons TikTok populaires du moment"],
                  ].map(([icon,titre,desc])=>(
                    <div key={titre} style={{background:D.input,borderRadius:10,padding:"12px 14px",border:`1px solid ${D.border}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                      <span style={{fontSize:22,flexShrink:0}}>{icon}</span>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{titre}</div>
                        <div style={{fontSize:11,color:D.muted,marginTop:3}}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ══ STATS ══ */}
        {tab==="stats"&&(()=>{
          const [stats, setStats] = useState(()=>JSON.parse(localStorage.getItem("angy_stats")||JSON.stringify({
            semaines:[],
            facebook:0, instagram:0, tiktok:0, snapchat:0,
            ventesParSemaine:0, messagesParJour:0,
          })));

          const sauvegarder=(newStats)=>{
            setStats(newStats);
            localStorage.setItem("angy_stats",JSON.stringify(newStats));
            showToast("✅ Stats sauvegardées !");
          };

          const ajouterSemaine=()=>{
            const sem={
              id:Date.now(),
              semaine:`Semaine ${stats.semaines.length+1}`,
              date:new Date().toLocaleDateString("fr-FR"),
              facebook:stats.facebook,
              instagram:stats.instagram,
              tiktok:stats.tiktok,
              ventes:stats.ventesParSemaine,
              messages:stats.messagesParJour,
            };
            sauvegarder({...stats,semaines:[...stats.semaines,sem]});
          };

          const objetifs = {facebook:1000, instagram:800, tiktok:2000, ventes:15};

          return (
            <div>
              <div style={{fontWeight:800,fontSize:20,marginBottom:16}}>📊 Suivi des performances</div>

              {/* SAISIE STATS */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div style={css.panel}>
                  <div style={css.ptitle}>📱 Abonnés actuels</div>
                  {[
                    ["📘 Facebook","facebook","#1877F2",objetifs.facebook],
                    ["📸 Instagram","instagram","#E1306C",objetifs.instagram],
                    ["🎵 TikTok","tiktok","#000000",objetifs.tiktok],
                    ["👻 Snapchat","snapchat","#FFD700",500],
                  ].map(([label,key,color,obj])=>(
                    <div key={key} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <label style={{...css.label,marginBottom:0}}>{label}</label>
                        <span style={{fontSize:11,color:D.muted}}>Objectif: {obj.toLocaleString()}</span>
                      </div>
                      <input type="number" style={css.input} value={stats[key]||0}
                        onChange={e=>setStats({...stats,[key]:Number(e.target.value)})}/>
                      <div style={{height:4,background:D.border,borderRadius:99,marginTop:6,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.min(100,Math.round(((stats[key]||0)/obj)*100))}%`,background:color,borderRadius:99,transition:"width 0.5s"}}/>
                      </div>
                      <div style={{fontSize:10,color:D.muted,marginTop:3,textAlign:"right"}}>
                        {Math.min(100,Math.round(((stats[key]||0)/obj)*100))}% de l'objectif
                      </div>
                    </div>
                  ))}
                </div>

                <div style={css.panel}>
                  <div style={css.ptitle}>💰 Ventes & Messages</div>
                  <div style={{marginBottom:14}}>
                    <label style={css.label}>Ventes cette semaine</label>
                    <input type="number" style={css.input} value={stats.ventesParSemaine||0}
                      onChange={e=>setStats({...stats,ventesParSemaine:Number(e.target.value)})}/>
                    <div style={{height:4,background:D.border,borderRadius:99,marginTop:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,Math.round(((stats.ventesParSemaine||0)/15)*100))}%`,background:"#00E676",borderRadius:99}}/>
                    </div>
                    <div style={{fontSize:10,color:D.muted,marginTop:3,textAlign:"right"}}>Objectif: 15/semaine</div>
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={css.label}>Messages par jour</label>
                    <input type="number" style={css.input} value={stats.messagesParJour||0}
                      onChange={e=>setStats({...stats,messagesParJour:Number(e.target.value)})}/>
                    <div style={{height:4,background:D.border,borderRadius:99,marginTop:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,Math.round(((stats.messagesParJour||0)/50)*100))}%`,background:"#FF9F0A",borderRadius:99}}/>
                    </div>
                    <div style={{fontSize:10,color:D.muted,marginTop:3,textAlign:"right"}}>Objectif: 50/jour</div>
                  </div>
                  <button style={css.btn()} onClick={()=>sauvegarder(stats)}>💾 Sauvegarder</button>
                  <button style={css.btnSec} onClick={ajouterSemaine}>📸 Snapshot semaine</button>
                </div>
              </div>

              {/* HISTORIQUE SEMAINES */}
              {stats.semaines.length>0&&(
                <div style={css.panel}>
                  <div style={css.ptitle}>📈 Progression semaine par semaine</div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead>
                        <tr>
                          {["Semaine","Date","Facebook","Instagram","TikTok","Ventes","Messages"].map(h=>(
                            <th key={h} style={{padding:"8px 12px",textAlign:"left",borderBottom:`1px solid ${D.border}`,color:D.muted,fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.semaines.map((s,i)=>(
                          <tr key={s.id} style={{borderBottom:`1px solid ${D.border}`}}>
                            <td style={{padding:"8px 12px",fontWeight:700}}>{s.semaine}</td>
                            <td style={{padding:"8px 12px",color:D.muted}}>{s.date}</td>
                            <td style={{padding:"8px 12px",color:"#1877F2",fontWeight:600}}>{s.facebook}</td>
                            <td style={{padding:"8px 12px",color:"#E1306C",fontWeight:600}}>{s.instagram}</td>
                            <td style={{padding:"8px 12px",color:"#000",fontWeight:600}}>{s.tiktok}</td>
                            <td style={{padding:"8px 12px",color:"#00E676",fontWeight:700}}>{s.ventes}</td>
                            <td style={{padding:"8px 12px",color:"#FF9F0A",fontWeight:600}}>{s.messages}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:dark?"#1C1C2E":"#FFF",border:`1px solid ${D.border}`,color:D.text,padding:"11px 22px",borderRadius:12,fontSize:14,fontWeight:600,boxShadow:"0 8px 28px rgba(0,0,0,0.3)",zIndex:9999,whiteSpace:"nowrap"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
