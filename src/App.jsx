import React, { useState, useEffect, useCallback } from "react";
import {
  Home, BookOpen, Palette, Lock, Instagram, Phone, MapPin, Globe,
  Leaf, Plus, Trash2, Save, RotateCcw, Check, ChevronDown, ChevronUp, X
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { RESTAURANT_SLUG, STAFF_PIN } from "./config";

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_DATA = {
  brand: {
    name: "Limo",
    tagline: "Cucina della costa, fatta a mano",
    estLine: "Sapori di Sorrento — dal 2019",
    hours: "Tue–Sun · 5pm – 11pm",
    phone: "(416) 555-0182",
    address: "184 Ossington Ave, Toronto, ON",
    instagram: "@limo.ristorante",
    website: "limoristorante.com",
  },
  categories: [
    {
      id: "antipasti", numeral: "I", title: "Antipasti",
      subtitle: "To start, while the bread is still warm",
      items: [
        { id: uid(), name: "Burrata Pugliese", desc: "Creamy burrata, heirloom tomato, basil oil, Maldon salt, grilled sourdough", price: "19", veg: true },
        { id: uid(), name: "Carpaccio di Manzo", desc: "Thin-sliced raw beef tenderloin, arugula, shaved grana padano, lemon-caper dressing", price: "21", veg: false },
        { id: uid(), name: "Arancini al Limone", desc: "Saffron rice, mozzarella, preserved lemon, fried golden, whipped ricotta", price: "16", veg: true },
        { id: uid(), name: "Bruschetta al Pomodoro", desc: "Charred country bread, San Marzano tomato, garlic, basil, extra virgin olive oil", price: "14", veg: true },
        { id: uid(), name: "Insalata di Mare", desc: "Chilled octopus, shrimp, calamari, celery, lemon, chili, parsley", price: "22", veg: false },
      ],
    },
    {
      id: "primi", numeral: "II", title: "Primi",
      subtitle: "Pasta and rice, made fresh each morning",
      items: [
        { id: uid(), name: "Spaghetti alle Vongole", desc: "Manila clams, white wine, garlic, chili flake, parsley, bottarga", price: "27", veg: false },
        { id: uid(), name: "Risotto ai Limoni di Amalfi", desc: "Carnaroli rice, Amalfi lemon zest, mascarpone, aged parmesan, cracked pepper", price: "25", veg: true },
        { id: uid(), name: "Tagliatelle al Tartufo", desc: "Egg tagliatelle, brown butter, black winter truffle, parmigiano reggiano", price: "30", veg: true },
        { id: uid(), name: "Orecchiette con Cime di Rapa", desc: "Hand-shaped orecchiette, broccoli rabe, anchovy, garlic, chili, pecorino", price: "23", veg: false },
        { id: uid(), name: "Ravioli di Ricotta e Spinaci", desc: "House-made ravioli, sage burnt butter, toasted walnut, nutmeg", price: "24", veg: true },
      ],
    },
    {
      id: "secondi", numeral: "III", title: "Secondi",
      subtitle: "From the wood grill and the copper pan",
      items: [
        { id: uid(), name: "Branzino al Forno", desc: "Whole roasted Mediterranean sea bass, cherry tomato, olive, oregano, lemon", price: "36", veg: false },
        { id: uid(), name: "Pollo al Limone", desc: "Half chicken under a brick, charred lemon, rosemary, pan jus", price: "29", veg: false },
        { id: uid(), name: "Saltimbocca alla Romana", desc: "Veal scaloppine, prosciutto di Parma, sage, white wine butter sauce", price: "32", veg: false },
        { id: uid(), name: "Osso Buco", desc: "Braised veal shank, saffron risotto milanese, gremolata", price: "38", veg: false },
        { id: uid(), name: "Tagliata di Manzo", desc: "Sliced grilled striploin, arugula, shaved parmesan, aged balsamic", price: "41", veg: false },
      ],
    },
    {
      id: "contorni", numeral: "IV", title: "Contorni",
      subtitle: "On the side",
      items: [
        { id: uid(), name: "Patate Arrosto", desc: "Rosemary roasted potatoes, garlic, sea salt", price: "9", veg: true },
        { id: uid(), name: "Verdure Grigliate", desc: "Grilled seasonal vegetables, olive oil, aged balsamic", price: "11", veg: true },
        { id: uid(), name: "Insalata Verde", desc: "Little gem lettuce, shallot vinaigrette, shaved fennel", price: "9", veg: true },
      ],
    },
    {
      id: "dolci", numeral: "V", title: "Dolci",
      subtitle: "To finish, with an espresso",
      items: [
        { id: uid(), name: "Delizia al Limone", desc: "Sponge cake soaked in limoncello, lemon cream, candied Sorrento lemon", price: "13", veg: true },
        { id: uid(), name: "Tiramisù", desc: "Espresso-soaked savoiardi, mascarpone cream, cocoa", price: "12", veg: true },
        { id: uid(), name: "Cannoli Siciliani", desc: "Crisp shells, sweet ricotta, candied orange, pistachio", price: "12", veg: true },
        { id: uid(), name: "Panna Cotta", desc: "Vanilla bean panna cotta, blood orange, basil syrup", price: "11", veg: true },
      ],
    },
    {
      id: "bevande", numeral: "VI", title: "Bevande",
      subtitle: "Wine, spritz, and something cold",
      items: [
        { id: uid(), name: "Limoncello Spritz", desc: "House limoncello, prosecco, soda, mint", price: "15", veg: false },
        { id: uid(), name: "Aperol Spritz", desc: "Aperol, prosecco, soda, orange", price: "15", veg: false },
        { id: uid(), name: "Negroni", desc: "Gin, Campari, sweet vermouth, orange peel", price: "17", veg: false },
        { id: uid(), name: "Vino della Casa", desc: "Rotating red or white by the glass or bottle — ask your server", price: "14 / 52", veg: false },
        { id: uid(), name: "Acqua Panna & San Pellegrino", desc: "Still or sparkling, 750ml", price: "7", veg: false },
      ],
    },
  ],
};

function LemonMark({ size = 48, stroke = "#F4CD3C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <ellipse cx="24" cy="26" rx="16" ry="13" transform="rotate(-18 24 26)" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M32 12 C36 8 40 8 41 9 C42 10 42 14 38 18" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M11 22 Q24 15 37 22" stroke={stroke} strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M9 27 Q24 21 39 27" stroke={stroke} strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M11 32 Q24 27 37 32" stroke={stroke} strokeWidth="1.2" fill="none" opacity="0.7" />
    </svg>
  );
}

function RindDivider({ fill = "#142A20" }) {
  return (
    <svg viewBox="0 0 400 22" preserveAspectRatio="none" style={{ width: "100%", height: 20, display: "block" }} aria-hidden="true">
      <path d="M0,0 Q10,22 20,0 Q30,22 40,0 Q50,22 60,0 Q70,22 80,0 Q90,22 100,0 Q110,22 120,0 Q130,22 140,0 Q150,22 160,0 Q170,22 180,0 Q190,22 200,0 Q210,22 220,0 Q230,22 240,0 Q250,22 260,0 Q270,22 280,0 Q290,22 300,0 Q310,22 320,0 Q330,22 340,0 Q350,22 360,0 Q370,22 380,0 Q390,22 400,0 L400,0 L0,0 Z" fill={fill} />
    </svg>
  );
}

const PALETTE = [
  { name: "Ivory", hex: "#FBF3DE" },
  { name: "Bottle Green", hex: "#1F3D2E" },
  { name: "Bottle Deep", hex: "#142A20" },
  { name: "Lemon", hex: "#F4CD3C" },
  { name: "Terracotta", hex: "#C4602F" },
  { name: "Ink", hex: "#241F16" },
];

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [draft, setDraft] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("cover");
  const [activeCat, setActiveCat] = useState("antipasti");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [openCat, setOpenCat] = useState("antipasti");

  useEffect(() => {
    (async () => {
      try {
        const { data: row, error } = await supabase
          .from("menus")
          .select("data")
          .eq("slug", RESTAURANT_SLUG)
          .maybeSingle();

        if (error) throw error;

        if (row && row.data) {
          setData(row.data);
          setDraft(row.data);
        } else {
          // First run for this slug — seed Supabase with the defaults
          // baked into this file, so future edits have a row to update.
          await supabase.from("menus").upsert({ slug: RESTAURANT_SLUG, data: DEFAULT_DATA });
        }
      } catch (e) {
        console.error("Failed to load menu from Supabase, showing defaults:", e);
        // defaults already in state — page still works
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveDraft = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const { error } = await supabase
        .from("menus")
        .upsert({ slug: RESTAURANT_SLUG, data: draft, updated_at: new Date().toISOString() }, { onConflict: "slug" });

      if (error) throw error;

      setData(draft);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2200);
    } catch (e) {
      console.error("Save failed:", e);
      setSaveStatus("error");
    }
  }, [draft]);

  const resetDraft = () => setDraft(data);

  const updateBrand = (field, value) => {
    setDraft((d) => ({ ...d, brand: { ...d.brand, [field]: value } }));
  };

  const updateCategoryField = (catId, field, value) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === catId ? { ...c, [field]: value } : c)),
    }));
  };

  const updateItem = (catId, itemId, field, value) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) }
          : c
      ),
    }));
  };

  const addItem = (catId) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, items: [...c.items, { id: uid(), name: "New dish", desc: "Description", price: "0", veg: false }] }
          : c
      ),
    }));
  };

  const removeItem = (catId, itemId) => {
    setDraft((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((it) => it.id !== itemId) } : c
      ),
    }));
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=142A20&bgcolor=FBF3DE&data=${encodeURIComponent(
    "https://" + (data.brand.website || "limoristorante.com")
  )}`;

  const activeCategory = data.categories.find((c) => c.id === activeCat) || data.categories[0];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF3DE" }}>
        <LemonMark size={40} stroke="#1F3D2E" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif", background: "#FBF3DE", color: "#241F16", minHeight: 480 }}>
      <style>{`
        .limo-scope * { box-sizing: border-box; }
        .limo-fade { animation: limoFade 0.4s ease both; }
        @keyframes limoFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .limo-navlink { display:flex; align-items:center; gap:6px; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:8px 12px; border-radius:999px; border:1px solid transparent; cursor:pointer; background:none; color:#FBF3DE; opacity:0.75; transition: all 0.2s ease; }
        .limo-navlink:hover { opacity:1; border-color: rgba(251,243,222,0.3); }
        .limo-navlink.active { opacity:1; background: rgba(251,243,222,0.12); border-color: rgba(251,243,222,0.4); }
        .limo-cattab { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:9px 16px; border-radius:999px; border:1px solid #1F3D2E33; background:transparent; color:#1F3D2E; cursor:pointer; white-space:nowrap; }
        .limo-cattab.active { background:#1F3D2E; color:#FBF3DE; border-color:#1F3D2E; }
        .limo-dish { display:grid; grid-template-columns: 1fr auto; gap: 4px 18px; padding: 16px 0; border-bottom: 1px dotted rgba(31,61,46,0.25); }
        .limo-dish:last-child { border-bottom: none; }
        .limo-input { font-family:'Cormorant Garamond',serif; font-size:15px; padding:7px 9px; border:1px solid #1F3D2E44; border-radius:6px; background:#fff; color:#241F16; width:100%; }
        .limo-btn { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; padding:9px 16px; border-radius:8px; border:1px solid #1F3D2E; background:#1F3D2E; color:#FBF3DE; cursor:pointer; display:inline-flex; align-items:center; gap:6px; }
        .limo-btn.ghost { background:transparent; color:#1F3D2E; }
        .limo-btn.danger { background:#C4602F; border-color:#C4602F; }
        .limo-btn:hover { filter: brightness(1.08); }
        ::selection { background: #F4CD3C; color: #142A20; }
      `}</style>

      <div className="limo-scope">
        {view !== "cover" && (
          <div style={{ background: "#142A20", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 30 }}>
            <button onClick={() => setView("cover")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
              <LemonMark size={22} />
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, color: "#FBF3DE", fontSize: 18 }}>
                {data.brand.name}
              </span>
            </button>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className={`limo-navlink ${view === "cover" ? "active" : ""}`} onClick={() => setView("cover")}><Home size={12} /> Home</button>
              <button className={`limo-navlink ${view === "menu" ? "active" : ""}`} onClick={() => setView("menu")}><BookOpen size={12} /> Menu</button>
              <button className={`limo-navlink ${view === "branding" ? "active" : ""}`} onClick={() => setView("branding")}><Palette size={12} /> Branding</button>
              <button className={`limo-navlink ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}><Lock size={12} /> Staff</button>
            </div>
          </div>
        )}

        {/* ---------------- COVER ---------------- */}
        {view === "cover" && (
          <div className="limo-fade">
            <div style={{ background: "#1F3D2E", padding: "70px 24px 50px", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, backgroundImage: "repeating-linear-gradient(90deg, #F4CD3C 0 20px, transparent 20px 40px)", opacity: 0.9 }} />
              <div style={{ maxWidth: 520, margin: "0 auto", border: "2px solid #F4CD3C", padding: "34px 20px 30px", position: "relative" }}>
                <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(244,205,60,0.4)", pointerEvents: "none" }} />
                <LemonMark size={44} />
                <p style={{ fontFamily: "'Space Mono',monospace", letterSpacing: "0.4em", fontSize: 10.5, textTransform: "uppercase", color: "#F4CD3C", margin: "16px 0" }}>
                  Ristorante · Trattoria · Enoteca
                </p>
                <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: "clamp(56px,14vw,92px)", lineHeight: 0.85, margin: 0, color: "#FBF3DE" }}>
                  {data.brand.name.slice(0, 1)}
                  <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4CD3C" }}>{data.brand.name.slice(1, -1)}</em>
                  {data.brand.name.slice(-1)}
                </h1>
                <p style={{ fontSize: 18, fontStyle: "italic", color: "rgba(251,243,222,0.82)", margin: "14px 0 8px" }}>{data.brand.tagline}</p>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(251,243,222,0.5)" }}>{data.brand.estLine}</p>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
                  <button className="limo-btn" onClick={() => setView("menu")}><BookOpen size={13} /> View Menu</button>
                  <button className="limo-btn ghost" style={{ borderColor: "#F4CD3C", color: "#F4CD3C" }} onClick={() => setView("branding")}><Palette size={13} /> Branding Kit</button>
                </div>
              </div>
            </div>
            <RindDivider />

            <div style={{ maxWidth: 640, margin: "0 auto", padding: "44px 24px 60px", textAlign: "center" }}>
              <img src={qrUrl} alt="QR code linking to the Limo menu" width={140} height={140} style={{ borderRadius: 10, border: "1px solid rgba(31,61,46,0.2)" }} />
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(36,31,22,0.5)", marginTop: 14 }}>
                Scan to open on your phone
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", marginTop: 30, fontSize: 15, color: "rgba(36,31,22,0.7)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {data.brand.address}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> {data.brand.phone}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Instagram size={14} /> {data.brand.instagram}</span>
              </div>
              <button onClick={() => setView("admin")} style={{ marginTop: 40, background: "none", border: "none", color: "rgba(36,31,22,0.35)", fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", textDecoration: "underline" }}>
                Staff login
              </button>
            </div>
          </div>
        )}

        {/* ---------------- MENU ---------------- */}
        {view === "menu" && (
          <div className="limo-fade" style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 60px" }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 0 26px", position: "sticky", top: 58, background: "#FBF3DE", zIndex: 10 }}>
              {data.categories.map((c) => (
                <button key={c.id} className={`limo-cattab ${activeCat === c.id ? "active" : ""}`} onClick={() => setActiveCat(c.id)}>
                  {c.title}
                </button>
              ))}
            </div>

            {activeCategory && (
              <div key={activeCategory.id} className="limo-fade">
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#C4602F" }}>{activeCategory.numeral}</span>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(28px,5vw,38px)", color: "#142A20", margin: 0 }}>
                    {activeCategory.title}
                  </h2>
                </div>
                <p style={{ fontSize: 16, fontStyle: "italic", color: "rgba(36,31,22,0.6)", margin: "4px 0 26px", paddingLeft: 40 }}>{activeCategory.subtitle}</p>

                {activeCategory.items.map((it) => (
                  <div className="limo-dish" key={it.id}>
                    <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                      {it.name}
                      {it.veg && <Leaf size={13} style={{ marginLeft: 8, verticalAlign: "middle", color: "#1F3D2E" }} />}
                    </h3>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, color: "#C4602F", whiteSpace: "nowrap" }}>${it.price}</span>
                    <p style={{ gridColumn: "1 / 2", fontSize: 15, color: "rgba(36,31,22,0.62)", margin: "3px 0 0", maxWidth: "46ch" }}>{it.desc}</p>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize: 13.5, color: "rgba(36,31,22,0.5)", fontStyle: "italic", marginTop: 34, paddingTop: 16, borderTop: "1px solid rgba(31,61,46,0.25)" }}>
              <Leaf size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> indicates a vegetarian dish. Please tell your server of any allergies.
            </p>
          </div>
        )}

        {/* ---------------- BRANDING ---------------- */}
        {view === "branding" && (
          <div className="limo-fade" style={{ maxWidth: 860, margin: "0 auto", padding: "30px 24px 70px" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 34, color: "#142A20", marginBottom: 4 }}>Branding Kit</h2>
            <p style={{ color: "rgba(36,31,22,0.6)", marginTop: 0, marginBottom: 36 }}>The visual identity, ready to hand to a printer or social manager.</p>

            <h3 style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4602F", marginBottom: 14 }}>Logo Lockups</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <div style={{ background: "#142A20", borderRadius: 12, padding: "30px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: "1 1 260px" }}>
                <LemonMark size={40} />
                <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 30, color: "#FBF3DE" }}>{data.brand.name}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: "0.3em", color: "#F4CD3C", textTransform: "uppercase" }}>On dark</span>
              </div>
              <div style={{ background: "#FBF3DE", border: "1px solid rgba(31,61,46,0.2)", borderRadius: 12, padding: "30px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: "1 1 260px" }}>
                <LemonMark size={40} stroke="#1F3D2E" />
                <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 30, color: "#142A20" }}>{data.brand.name}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C4602F", textTransform: "uppercase" }}>On light</span>
              </div>
            </div>

            <h3 style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4602F", marginBottom: 14 }}>Palette</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 12, marginBottom: 40 }}>
              {PALETTE.map((p) => (
                <div key={p.hex} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(31,61,46,0.15)" }}>
                  <div style={{ height: 70, background: p.hex }} />
                  <div style={{ padding: "8px 10px", background: "#fff" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(36,31,22,0.55)" }}>{p.hex}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4602F", marginBottom: 14 }}>Typography</h3>
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 32, margin: "0 0 4px" }}>Fraunces — Display</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, margin: "0 0 4px", color: "rgba(36,31,22,0.75)" }}>Cormorant Garamond — Body copy, dish descriptions</p>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, letterSpacing: "0.05em", color: "rgba(36,31,22,0.6)" }}>SPACE MONO — Prices, labels, utility</p>
            </div>

            <h3 style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4602F", marginBottom: 14 }}>Social Preview</h3>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 220, height: 220, background: "linear-gradient(160deg,#1F3D2E,#142A20)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <LemonMark size={34} />
                <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 24, color: "#FBF3DE" }}>{data.brand.name}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: "0.25em", color: "#F4CD3C", textTransform: "uppercase" }}>Instagram Cover</span>
              </div>
              <div style={{ width: 300, borderRadius: 14, border: "1px solid rgba(31,61,46,0.2)", background: "#fff", padding: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                <LemonMark size={26} stroke="#1F3D2E" />
                <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 22, color: "#142A20" }}>{data.brand.name}</span>
                <span style={{ fontSize: 14, color: "rgba(36,31,22,0.6)", fontStyle: "italic" }}>{data.brand.tagline}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "rgba(36,31,22,0.5)", marginTop: 8 }}>{data.brand.phone} · {data.brand.website}</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- ADMIN ---------------- */}
        {view === "admin" && (
          <div className="limo-fade" style={{ maxWidth: 760, margin: "0 auto", padding: "30px 24px 70px" }}>
            {!adminUnlocked ? (
              <div style={{ maxWidth: 340, margin: "60px auto", textAlign: "center" }}>
                <Lock size={26} style={{ color: "#1F3D2E" }} />
                <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 26, margin: "14px 0 6px" }}>Staff Login</h2>
                <p style={{ fontSize: 14, color: "rgba(36,31,22,0.55)", marginBottom: 18 }}>Enter the staff PIN to edit dishes and prices. Demo PIN: <strong>1234</strong></p>
                <input
                  className="limo-input"
                  type="password"
                  inputMode="numeric"
                  placeholder="PIN"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { if (pinInput === STAFF_PIN) { setAdminUnlocked(true); } else setPinError(true); } }}
                  style={{ textAlign: "center", letterSpacing: "0.3em" }}
                />
                {pinError && <p style={{ color: "#C4602F", fontSize: 13, marginTop: 8 }}>Incorrect PIN, try again.</p>}
                <button className="limo-btn" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
                  onClick={() => { if (pinInput === STAFF_PIN) setAdminUnlocked(true); else setPinError(true); }}>
                  Unlock
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 28, margin: 0 }}>Menu Editor</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="limo-btn ghost" onClick={resetDraft}><RotateCcw size={13} /> Discard changes</button>
                    <button className="limo-btn" onClick={saveDraft}>
                      {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save changes</>}
                    </button>
                  </div>
                </div>

                <details style={{ marginBottom: 20, background: "#fff", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(31,61,46,0.15)" }}>
                  <summary style={{ cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Restaurant info</summary>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginTop: 14 }}>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Name
                      <input className="limo-input" value={draft.brand.name} onChange={(e) => updateBrand("name", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Tagline
                      <input className="limo-input" value={draft.brand.tagline} onChange={(e) => updateBrand("tagline", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Est. line
                      <input className="limo-input" value={draft.brand.estLine} onChange={(e) => updateBrand("estLine", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Hours
                      <input className="limo-input" value={draft.brand.hours} onChange={(e) => updateBrand("hours", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Phone
                      <input className="limo-input" value={draft.brand.phone} onChange={(e) => updateBrand("phone", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Address
                      <input className="limo-input" value={draft.brand.address} onChange={(e) => updateBrand("address", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Instagram
                      <input className="limo-input" value={draft.brand.instagram} onChange={(e) => updateBrand("instagram", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: "rgba(36,31,22,0.6)" }}>Website
                      <input className="limo-input" value={draft.brand.website} onChange={(e) => updateBrand("website", e.target.value)} />
                    </label>
                  </div>
                </details>

                {draft.categories.map((cat) => (
                  <div key={cat.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(31,61,46,0.15)", marginBottom: 14, overflow: "hidden" }}>
                    <button
                      onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)}
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 600, fontSize: 19 }}>{cat.title}</span>
                      {openCat === cat.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openCat === cat.id && (
                      <div style={{ padding: "0 16px 18px" }}>
                        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                          <input className="limo-input" value={cat.title} onChange={(e) => updateCategoryField(cat.id, "title", e.target.value)} placeholder="Category title" />
                          <input className="limo-input" value={cat.subtitle} onChange={(e) => updateCategoryField(cat.id, "subtitle", e.target.value)} placeholder="Category subtitle" />
                        </div>
                        {cat.items.map((it) => (
                          <div key={it.id} style={{ display: "grid", gridTemplateColumns: "2fr 3fr 80px auto auto", gap: 8, alignItems: "center", marginBottom: 8 }}>
                            <input className="limo-input" value={it.name} onChange={(e) => updateItem(cat.id, it.id, "name", e.target.value)} placeholder="Dish name" />
                            <input className="limo-input" value={it.desc} onChange={(e) => updateItem(cat.id, it.id, "desc", e.target.value)} placeholder="Description" />
                            <input className="limo-input" value={it.price} onChange={(e) => updateItem(cat.id, it.id, "price", e.target.value)} placeholder="Price" />
                            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(36,31,22,0.6)" }}>
                              <input type="checkbox" checked={it.veg} onChange={(e) => updateItem(cat.id, it.id, "veg", e.target.checked)} /> Veg
                            </label>
                            <button onClick={() => removeItem(cat.id, it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4602F" }}><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button className="limo-btn ghost" style={{ marginTop: 8 }} onClick={() => addItem(cat.id)}><Plus size={13} /> Add dish</button>
                      </div>
                    )}
                  </div>
                ))}

                {saveStatus === "error" && <p style={{ color: "#C4602F", fontSize: 13 }}>Something went wrong saving — try again.</p>}
                <p style={{ fontSize: 12.5, color: "rgba(36,31,22,0.45)", fontStyle: "italic", marginTop: 20 }}>
                  Changes save to shared storage and appear for anyone viewing this menu.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
