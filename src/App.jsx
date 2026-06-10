import { useState, useRef, useEffect, useCallback } from "react";

// ─── LOGO SVG ────────────────────────────────────────────────────────────────
const AngyLogo = ({ width = 180, light = false }) => {
  const tc = light ? "#0A0A0F" : "#FFFFFF";
  const r = 20, ep = r*2;
  const cx0 = 42, cy = 42;
  const compX = cx0 + ep*3 + r + 12;
  const rougeX = compX + 148 + 10;
  const W = rougeX + 52, H = 84;
  return (
    <svg width={width} height={Math.round(H*(width/W))} viewBox={`0 0 ${W} ${H}`} fill="none">
      {/* Crochet bleu bas-gauche */}
      <rect x="4" y="8"  width="9" height={cy+r-8+6} fill="#1400FF"/>
      <rect x="4" y={cy+r-2} width="36" height="9" fill="#1400FF"/>
      {/* Cercles ANGY collés */}
      {[[cx0,"A"],[cx0+ep,"N"],[cx0+ep*2,"G"],[cx0+ep*3,"Y"]].map(([cx,l])=>(
        <g key={l}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={tc} strokeWidth="2"/>
          <text x={cx} y={cy+7} textAnchor="middle" fontFamily="Arial Black,Arial" fontWeight="900" fontSize="18" fill={tc}>{l}</text>
        </g>
      ))}
      {/* Company */}
      <text x={compX} y={cy+9} fontFamily="Arial Black,Arial" fontWeight="900" fontSize="28" fill={tc}>Company</text>
      {/* Crochet rouge haut-droit */}
      <rect x={rougeX}    y="8"  width="48" height="9"  fill="#CC0000"/>
      <rect x={rougeX+39} y="8"  width="9"  height="36" fill="#CC0000"/>
    </svg>
  );
};

// ─── LOGO CANVAS ─────────────────────────────────────────────────────────────
function drawLogo(ctx, x, y, targetW, light=false) {
  const tc = light ? "#0A0A0F" : "#FFFFFF";
  const r=20, ep=r*2, cx0=42, cy=42;
  const compX = cx0+ep*3+r+12;
  const rougeX = compX+148+10;
  const W = rougeX+52;
  const sc = targetW/W;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sc, sc);
  // Crochet bleu
  ctx.fillStyle="#1400FF";
  ctx.fillRect(4,8,9,cy+r-8+6);
  ctx.fillRect(4,cy+r-2,36,9);
  // Cercles
  [[cx0,"A"],[cx0+ep,"N"],[cx0+ep*2,"G"],[cx0+ep*3,"Y"]].forEach(([cx,l])=>{
    ctx.strokeStyle=tc; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle=tc; ctx.font="900 18px Arial Black,Arial";
    ctx.textAlign="center"; ctx.fillText(l,cx,cy+7);
  });
  // Company
  ctx.fillStyle=tc; ctx.font="900 28px Arial Black,Arial";
  ctx.textAlign="left"; ctx.fillText("Company",compX,cy+9);
  // Crochet rouge
  ctx.fillStyle="#CC0000";
  ctx.fillRect(rougeX,8,48,9);
  ctx.fillRect(rougeX+39,8,9,36);
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
  const {produit,prix,specs,points,type,format,contact,localisation,instagram,facebook,tiktok} = cfg;
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

  // ── CERCLE LUMINEUX fond (ambiance)
  const glowGrad = ctx.createRadialGradient(W*0.75, H*0.15, 0, W*0.75, H*0.15, W*0.55);
  glowGrad.addColorStop(0, "rgba(200,60,0,0.22)");
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0,0,W,H);

  const glowGrad2 = ctx.createRadialGradient(W*0.2, H*0.8, 0, W*0.2, H*0.8, W*0.4);
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
  const [legende, setLegende] = useState("");
  const [loadingL, setLoadingL] = useState(false);
  const [planning, setPlanning] = useState(()=>JSON.parse(localStorage.getItem("angy_plan")||"[]"));
  const [history, setHistory] = useState(()=>JSON.parse(localStorage.getItem("angy_hist")||"[]"));
  const [planDate, setPlanDate] = useState(new Date().toISOString().split("T")[0]);
  const [planHeure, setPlanHeure] = useState("18:00");
  const [planReseau, setPlanReseau] = useState("📘 Facebook");
  const [planNote, setPlanNote] = useState("");
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

  const dessiner = useCallback(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = fmt.w; canvas.height = fmt.h;
    drawVisual(canvas,{produit,prix,specs,points,type,format,contact,localisation,instagram,facebook,tiktok});
  },[produit,prix,specs,points,type,format,contact,localisation,instagram,facebook,tiktok,fmt]);

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
          {[["creer","✨ Créer"],["planifier","📅 Planifier"],["historique","🗂 Historique"]].map(([id,lbl])=>(
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

        {/* ══ PLANIFIER ══ */}
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
