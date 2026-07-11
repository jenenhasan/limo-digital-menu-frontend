import React, { useState, useEffect, useCallback } from "react";
import {
  Home, BookOpen, Palette, Lock, Instagram, Phone, MapPin, Globe,
  Leaf, Plus, Trash2, Save, RotateCcw, Check, ChevronDown, ChevronUp, X, Image as ImageIcon,
  Minus, ShoppingCart, Send
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { RESTAURANT_SLUG, STAFF_PIN } from "./config";
import { colors, fonts, alpha, paletteLabels } from "./theme";
import PrintButton from "./components/printButton";

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
    whatsapp: "", // digits only with country code, e.g. "14165550182" — leave blank to hide ordering
  },
  categories: [
    {
      id: "antipasti", numeral: "I", title: "Antipasti",
      subtitle: "To start, while the bread is still warm",
      items: [
        { id: uid(), name: "Burrata Pugliese", desc: "Creamy burrata, heirloom tomato, basil oil, Maldon salt, grilled sourdough", price: "19", veg: true, image: ""  },
        { id: uid(), name: "Carpaccio di Manzo", desc: "Thin-sliced raw beef tenderloin, arugula, shaved grana padano, lemon-caper dressing", price: "21", veg: false, image: ""  },
        { id: uid(), name: "Arancini al Limone", desc: "Saffron rice, mozzarella, preserved lemon, fried golden, whipped ricotta", price: "16", veg: true, image: ""  },
        { id: uid(), name: "Bruschetta al Pomodoro", desc: "Charred country bread, San Marzano tomato, garlic, basil, extra virgin olive oil", price: "14", veg: true, image: ""  },
        { id: uid(), name: "Insalata di Mare", desc: "Chilled octopus, shrimp, calamari, celery, lemon, chili, parsley", price: "22", veg: false, image: ""  },
      ],
    },
    {
      id: "primi", numeral: "II", title: "Primi",
      subtitle: "Pasta and rice, made fresh each morning",
      items: [
        { id: uid(), name: "Spaghetti alle Vongole", desc: "Manila clams, white wine, garlic, chili flake, parsley, bottarga", price: "27", veg: false, image: ""  },
        { id: uid(), name: "Risotto ai Limoni di Amalfi", desc: "Carnaroli rice, Amalfi lemon zest, mascarpone, aged parmesan, cracked pepper", price: "25", veg: true, image: ""  },
        { id: uid(), name: "Tagliatelle al Tartufo", desc: "Egg tagliatelle, brown butter, black winter truffle, parmigiano reggiano", price: "30", veg: true, image: ""  },
        { id: uid(), name: "Orecchiette con Cime di Rapa", desc: "Hand-shaped orecchiette, broccoli rabe, anchovy, garlic, chili, pecorino", price: "23", veg: false, image: ""  },
        { id: uid(), name: "Ravioli di Ricotta e Spinaci", desc: "House-made ravioli, sage burnt butter, toasted walnut, nutmeg", price: "24", veg: true, image: ""  },
      ],
    },
    {
      id: "secondi", numeral: "III", title: "Secondi",
      subtitle: "From the wood grill and the copper pan",
      items: [
        { id: uid(), name: "Branzino al Forno", desc: "Whole roasted Mediterranean sea bass, cherry tomato, olive, oregano, lemon", price: "36", veg: false, image: ""  },
        { id: uid(), name: "Pollo al Limone", desc: "Half chicken under a brick, charred lemon, rosemary, pan jus", price: "29", veg: false, image: ""  },
        { id: uid(), name: "Saltimbocca alla Romana", desc: "Veal scaloppine, prosciutto di Parma, sage, white wine butter sauce", price: "32", veg: false, image: ""  },
        { id: uid(), name: "Osso Buco", desc: "Braised veal shank, saffron risotto milanese, gremolata", price: "38", veg: false, image: ""  },
        { id: uid(), name: "Tagliata di Manzo", desc: "Sliced grilled striploin, arugula, shaved parmesan, aged balsamic", price: "41", veg: false, image: ""  },
      ],
    },
    {
      id: "contorni", numeral: "IV", title: "Contorni",
      subtitle: "On the side",
      items: [
        { id: uid(), name: "Patate Arrosto", desc: "Rosemary roasted potatoes, garlic, sea salt", price: "9", veg: true, image: ""  },
        { id: uid(), name: "Verdure Grigliate", desc: "Grilled seasonal vegetables, olive oil, aged balsamic", price: "11", veg: true, image: ""  },
        { id: uid(), name: "Insalata Verde", desc: "Little gem lettuce, shallot vinaigrette, shaved fennel", price: "9", veg: true, image: ""  },
      ],
    },
    {
      id: "dolci", numeral: "V", title: "Dolci",
      subtitle: "To finish, with an espresso",
      items: [
        { id: uid(), name: "Delizia al Limone", desc: "Sponge cake soaked in limoncello, lemon cream, candied Sorrento lemon", price: "13", veg: true, image: ""  },
        { id: uid(), name: "Tiramisù", desc: "Espresso-soaked savoiardi, mascarpone cream, cocoa", price: "12", veg: true, image: ""  },
        { id: uid(), name: "Cannoli Siciliani", desc: "Crisp shells, sweet ricotta, candied orange, pistachio", price: "12", veg: true, image: ""  },
        { id: uid(), name: "Panna Cotta", desc: "Vanilla bean panna cotta, blood orange, basil syrup", price: "11", veg: true, image: ""  },
      ],
    },
    {
      id: "bevande", numeral: "VI", title: "Bevande",
      subtitle: "Wine, spritz, and something cold",
      items: [
        { id: uid(), name: "Limoncello Spritz", desc: "House limoncello, prosecco, soda, mint", price: "15", veg: false, image: ""  },
        { id: uid(), name: "Aperol Spritz", desc: "Aperol, prosecco, soda, orange", price: "15", veg: false, image: ""  },
        { id: uid(), name: "Negroni", desc: "Gin, Campari, sweet vermouth, orange peel", price: "17", veg: false, image: ""  },
        { id: uid(), name: "Vino della Casa", desc: "Rotating red or white by the glass or bottle — ask your server", price: "14 / 52", veg: false, image: ""  },
        { id: uid(), name: "Acqua Panna & San Pellegrino", desc: "Still or sparkling, 750ml", price: "7", veg: false, image: ""  },
      ],
    },
  ],
};

function LemonMark({ size = 48, stroke = colors.lemon }) {
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

function RindDivider({ fill = colors.bottleDeep }) {
  return (
    <svg viewBox="0 0 400 22" preserveAspectRatio="none" style={{ width: "100%", height: 20, display: "block" }} aria-hidden="true">
      <path d="M0,0 Q10,22 20,0 Q30,22 40,0 Q50,22 60,0 Q70,22 80,0 Q90,22 100,0 Q110,22 120,0 Q130,22 140,0 Q150,22 160,0 Q170,22 180,0 Q190,22 200,0 Q210,22 220,0 Q230,22 240,0 Q250,22 260,0 Q270,22 280,0 Q290,22 300,0 Q310,22 320,0 Q330,22 340,0 Q350,22 360,0 Q370,22 380,0 Q390,22 400,0 L400,0 L0,0 Z" fill={fill} />
    </svg>
  );
}

const PALETTE = Object.keys(colors).map((key) => ({
  name: paletteLabels[key] || key,
  hex: colors[key],
}));

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
  const [cart, setCart] = useState({}); // { itemId: quantity }

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
          ? { ...c, items: [...c.items, { id: uid(), name: "New dish", desc: "Description", price: "0", veg: false, image: "" }] }
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=${colors.bottleDeep.replace(
    "#",
    ""
  )}&bgcolor=${colors.ivory.replace("#", "")}&data=${encodeURIComponent(
    "https://" + (data.brand.website || "limoristorante.com")
  )}`;

  const activeCategory = data.categories.find((c) => c.id === activeCat) || data.categories[0];

  // ---------------- Cart / WhatsApp ordering ----------------

  const cartStorageKey = `menu-cart-${RESTAURANT_SLUG}`;

  useEffect(() => {
    if (loading) return;
    try {
      const saved = window.localStorage.getItem(cartStorageKey);
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      // ignore — cart just starts empty
    }
  }, [loading]);

  useEffect(() => {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch (e) {
      // storage unavailable (e.g. private browsing) — cart still works, just won't persist
    }
  }, [cart]);

  const allItems = data.categories.flatMap((c) => c.items);

  const setQty = (itemId, qty) => {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) {
        delete next[itemId];
      } else {
        next[itemId] = qty;
      }
      return next;
    });
  };

  const cartEntries = Object.entries(cart)
    .map(([itemId, qty]) => ({ item: allItems.find((it) => it.id === itemId), qty }))
    .filter((e) => e.item && e.qty > 0);

  const cartCount = cartEntries.reduce((sum, e) => sum + e.qty, 0);
  const cartTotal = cartEntries.reduce((sum, e) => sum + (parseFloat(e.item.price) || 0) * e.qty, 0);

  const clearCart = () => setCart({});

  const buildWhatsAppMessage = () => {
    const lines = [`Hi ${data.brand.name}! I'd like to order:`, ""];
    cartEntries.forEach((e) => {
      lines.push(`• ${e.qty}x ${e.item.name} — $${e.item.price} each`);
    });
    lines.push("");
    lines.push(`Total: $${cartTotal.toFixed(2)}`);
    lines.push("");
    lines.push("Name: ");
    lines.push("Pickup or delivery: ");
    return lines.join("\n");
  };

  const sendOrderViaWhatsApp = () => {
    if (!data.brand.whatsapp || cartEntries.length === 0) return;
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${data.brand.whatsapp}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.ivory }}>
        <LemonMark size={40} stroke={colors.bottle} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fonts.body, background: colors.ivory, color: colors.ink, minHeight: 480 }}>
      <style>{`
        .limo-scope * { box-sizing: border-box; }
        .limo-fade { animation: limoFade 0.4s ease both; }
        @keyframes limoFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .limo-navlink { display:flex; align-items:center; gap:6px; font-family:${fonts.mono}; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:8px 12px; border-radius:999px; border:1px solid transparent; cursor:pointer; background:none; color:${colors.ivory}; opacity:0.75; transition: all 0.2s ease; }
        .limo-navlink:hover { opacity:1; border-color: ${alpha('ivory', 0.3)}; }
        .limo-navlink.active { opacity:1; background: ${alpha('ivory', 0.12)}; border-color: ${alpha('ivory', 0.4)}; }
        .limo-cattab { font-family:${fonts.mono}; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; padding:9px 16px; border-radius:999px; border:1px solid ${colors.bottle}33; background:transparent; color:${colors.bottle}; cursor:pointer; white-space:nowrap; }
        .limo-cattab.active { background:${colors.bottle}; color:${colors.ivory}; border-color:${colors.bottle}; }
        .limo-dish { display:flex; align-items:flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px dotted ${alpha('bottle', 0.25)}; }
        .limo-dish:last-child { border-bottom: none; }
        .limo-dish-photo { width:72px; height:72px; border-radius:10px; object-fit:cover; flex-shrink:0; background:${alpha('bottle', 0.06)}; }
        .limo-dish-photo-empty { display:none; }
        .limo-dish-body { flex:1; min-width:0; }
        .limo-dish-row { display:flex; justify-content:space-between; align-items:baseline; gap:14px; }
        @media (max-width: 480px) { .limo-dish-photo:not(.limo-dish-photo-empty) { width:56px; height:56px; } }
        .limo-qty-btn { width:26px; height:26px; border-radius:50%; border:1px solid ${alpha('bottle', 0.3)}; background:#fff; color:${colors.bottle}; display:flex; align-items:center; justify-content:center; cursor:pointer; padding:0; }
        .limo-qty-btn:disabled { opacity:0.3; cursor:default; }
        .limo-qty-btn:not(:disabled):hover { background:${colors.bottle}; color:${colors.ivory}; }
        .limo-cart-fab { position:fixed; bottom:22px; right:22px; z-index:40; background:${colors.bottle}; color:${colors.ivory}; border:none; border-radius:999px; padding:12px 18px; display:flex; align-items:center; gap:8px; box-shadow:0 6px 18px rgba(0,0,0,0.25); cursor:pointer; font-family:${fonts.mono}; font-size:13px; }
        .limo-input { font-family:${fonts.body}; font-size:15px; padding:7px 9px; border:1px solid ${colors.bottle}44; border-radius:6px; background:#fff; color:${colors.ink}; width:100%; }
        .limo-btn { font-family:${fonts.mono}; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; padding:9px 16px; border-radius:8px; border:1px solid ${colors.bottle}; background:${colors.bottle}; color:${colors.ivory}; cursor:pointer; display:inline-flex; align-items:center; gap:6px; }
        .limo-btn.ghost { background:transparent; color:${colors.bottle}; }
        .limo-btn.danger { background:${colors.terracotta}; border-color:${colors.terracotta}; }
        .limo-btn:hover { filter: brightness(1.08); }
        ::selection { background: ${colors.lemon}; color: ${colors.bottleDeep}; }
      `}</style>

      <div className="limo-scope">
        {view !== "cover" && (
          <div className="no-print" style={{ background: colors.bottleDeep, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "sticky", top: 0, zIndex: 30 }}>
            <button onClick={() => setView("cover")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
              <LemonMark size={22} />
              <span style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, color: colors.ivory, fontSize: 18 }}>
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
            <div style={{ background: colors.bottle, padding: "70px 24px 50px", textAlign: "center", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, backgroundImage: `repeating-linear-gradient(90deg, ${colors.lemon} 0 20px, transparent 20px 40px)`, opacity: 0.9 }} />
              <div style={{ maxWidth: 520, margin: "0 auto", border: `2px solid ${colors.lemon}`, padding: "34px 20px 30px", position: "relative" }}>
                <div style={{ position: "absolute", inset: 8, border: `1px solid ${alpha('lemon', 0.4)}`, pointerEvents: "none" }} />
                <LemonMark size={44} />
                <p style={{ fontFamily: fonts.mono, letterSpacing: "0.4em", fontSize: 10.5, textTransform: "uppercase", color: colors.lemon, margin: "16px 0" }}>
                  Ristorante · Trattoria · Enoteca
                </p>
                <h1 style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: "clamp(56px,14vw,92px)", lineHeight: 0.85, margin: 0, color: colors.ivory }}>
                  {data.brand.name.slice(0, 1)}
                  <em style={{ fontStyle: "italic", fontWeight: 400, color: colors.lemon }}>{data.brand.name.slice(1, -1)}</em>
                  {data.brand.name.slice(-1)}
                </h1>
                <p style={{ fontSize: 18, fontStyle: "italic", color: alpha('ivory', 0.82), margin: "14px 0 8px" }}>{data.brand.tagline}</p>
                <p style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: alpha('ivory', 0.5) }}>{data.brand.estLine}</p>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
                  <button className="limo-btn" onClick={() => setView("menu")}><BookOpen size={13} /> View Menu</button>
                  <button className="limo-btn ghost" style={{ borderColor: colors.lemon, color: colors.lemon }} onClick={() => setView("branding")}><Palette size={13} /> Branding Kit</button>
                  
                </div>
              </div>
            </div>
            <RindDivider />

            <div style={{ maxWidth: 640, margin: "0 auto", padding: "44px 24px 60px", textAlign: "center" }}>
              <img src={qrUrl} alt="QR code linking to the Limo menu" width={140} height={140} style={{ borderRadius: 10, border: `1px solid ${alpha('bottle', 0.2)}` }} />
              <p style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: alpha('ink', 0.5), marginTop: 14 }}>
                Scan to open on your phone
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", marginTop: 30, fontSize: 15, color: alpha('ink', 0.7) }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {data.brand.address}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> {data.brand.phone}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Instagram size={14} /> {data.brand.instagram}</span>
              </div>
              <button onClick={() => setView("admin")} style={{ marginTop: 40, background: "none", border: "none", color: alpha('ink', 0.35), fontFamily: fonts.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", textDecoration: "underline" }}>
                Staff login
              </button>
            </div>
          </div>
        )}

        {/* ---------------- MENU ---------------- */}
        {view === "menu" && (
          <div className="limo-fade" style={{ maxWidth: 780, margin: "0 auto", padding: "20px 24px 60px" }}>
            {/* ---- PRINT BUTTON (visible only on screen) ---- */}
            <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            </div>

            {/* ---- CATEGORY TABS (visible only on screen) ---- */}
            <div className="no-print" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 0 26px", position: "sticky", top: 58, background: colors.ivory, zIndex: 10 }}>
              {data.categories.map((c) => (
                <button key={c.id} className={`limo-cattab ${activeCat === c.id ? "active" : ""}`} onClick={() => setActiveCat(c.id)}>
                  {c.title}
                </button>
              ))}
            </div>

            {/* ---- ACTIVE CATEGORY VIEW (visible only on screen) ---- */}
            <div className="no-print">
              {activeCategory && (
                <div key={activeCategory.id} className="limo-fade">
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.terracotta }}>{activeCategory.numeral}</span>
                    <h2 style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: "clamp(28px,5vw,38px)", color: colors.bottleDeep, margin: 0 }}>
                      {activeCategory.title}
                    </h2>
                  </div>
                  <p style={{ fontSize: 16, fontStyle: "italic", color: alpha('ink', 0.6), margin: "4px 0 26px", paddingLeft: 40 }}>{activeCategory.subtitle}</p>

                  {activeCategory.items.map((it) => (
                    <div className="limo-dish" key={it.id}>
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="limo-dish-photo"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className="limo-dish-photo limo-dish-photo-empty" aria-hidden="true" />
                      )}
                      <div className="limo-dish-body">
                        <div className="limo-dish-row">
                          <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                            {it.name}
                            {it.veg && <Leaf size={13} style={{ marginLeft: 8, verticalAlign: "middle", color: colors.bottle }} />}
                          </h3>
                          <span style={{ fontFamily: fonts.mono, fontSize: 15, color: colors.terracotta, whiteSpace: "nowrap" }}>${it.price}</span>
                        </div>
                        <p style={{ fontSize: 15, color: alpha('ink', 0.62), margin: "3px 0 0", maxWidth: "46ch" }}>{it.desc}</p>
                        {data.brand.whatsapp && (
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                            <button className="limo-qty-btn" onClick={() => setQty(it.id, (cart[it.id] || 0) - 1)} disabled={!cart[it.id]} aria-label={`Remove one ${it.name}`}>
                              <Minus size={13} />
                            </button>
                            <span style={{ fontFamily: fonts.mono, fontSize: 13, minWidth: 14, textAlign: "center" }}>{cart[it.id] || 0}</span>
                            <button className="limo-qty-btn" onClick={() => setQty(it.id, (cart[it.id] || 0) + 1)} aria-label={`Add one ${it.name}`}>
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---- PRINT-ONLY FULL MENU (hidden on screen, visible when printing) ---- */}
            <div className="print-only print-container">
              {/* Header */}
              <div className="print-header">
                <h1>{data.brand.name}</h1>
                <div className="tagline">{data.brand.tagline}</div>
                <div className="est-line">{data.brand.estLine}</div>
                <div className="meta">
                  {data.brand.hours} · {data.brand.phone} · {data.brand.address}
                </div>
              </div>

              {/* All Categories */}
              {data.categories.map((cat, index) => (
                <div 
                  key={cat.id} 
                  className={`print-category ${index < data.categories.length - 1 ? 'print-category-break' : ''}`}
                >
                  <h2>
                    <span style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.terracotta, marginRight: 10 }}>
                      {cat.numeral}
                    </span>
                    {cat.title}
                  </h2>
                  <div className="subtitle">{cat.subtitle}</div>
                  
                  {cat.items.map((it) => (
                    <div className="print-item-wrapper" key={it.id}>
                      <div className="print-item">
                        <span className="name">
                          {it.name}
                          {it.veg && <span className="veg">🌿</span>}
                        </span>
                        <span className="price">${it.price}</span>
                      </div>
                      <div className="desc">{it.desc}</div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Footer */}
              <div className="print-footer">
                {data.brand.website} · {data.brand.instagram}
              </div>
            </div>

            {/* ---- VEGETARIAN NOTE (visible on screen only) ---- */}
            <div className="no-print">
              <p style={{ fontSize: 13.5, color: alpha('ink', 0.5), fontStyle: "italic", marginTop: 34, paddingTop: 16, borderTop: `1px solid ${alpha('bottle', 0.25)}` }}>
                <Leaf size={11} style={{ verticalAlign: "middle", marginRight: 4 }} /> indicates a vegetarian dish. Please tell your server of any allergies.
              </p>
            </div>

            {data.brand.whatsapp && cartEntries.length > 0 && (
              <div id="order-summary" className="no-print" style={{ marginTop: 20, padding: 20, borderRadius: 12, background: "#fff", border: `1px solid ${alpha('bottle', 0.15)}` }}>
                <h3 style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 22, margin: "0 0 14px" }}>Your Order</h3>
                {cartEntries.map((e) => (
                  <div key={e.item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px dotted ${alpha('bottle', 0.15)}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: fonts.mono, fontSize: 13, color: alpha('ink', 0.55) }}>{e.qty}×</span>
                      <span style={{ fontSize: 16 }}>{e.item.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.terracotta }}>${(parseFloat(e.item.price) * e.qty).toFixed(2)}</span>
                      <button onClick={() => setQty(e.item.id, 0)} style={{ background: "none", border: "none", cursor: "pointer", color: alpha('ink', 0.35) }} aria-label={`Remove ${e.item.name} from order`}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${alpha('bottle', 0.2)}` }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
                  <span style={{ fontFamily: fonts.mono, fontSize: 19, color: colors.bottle }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <button className="limo-btn" onClick={sendOrderViaWhatsApp}>
                    <Send size={13} /> Send Order via WhatsApp
                  </button>
                  <button className="limo-btn ghost" onClick={clearCart}>Clear order</button>
                </div>
                <p style={{ fontSize: 12, color: alpha('ink', 0.45), fontStyle: "italic", marginTop: 12 }}>
                  This opens WhatsApp with your order pre-filled — the restaurant confirms availability, pricing, and payment directly with you in the chat.
                </p>
              </div>
            )}
          </div>
        )}

        {view === "menu" && data.brand.whatsapp && cartCount > 0 && (
          <button className="limo-cart-fab no-print" onClick={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })}>
            <ShoppingCart size={15} /> {cartCount} · ${cartTotal.toFixed(2)}
          </button>
        )}


        {/* ---------------- BRANDING ---------------- */}
        {view === "branding" && (
          <div className="limo-fade" style={{ maxWidth: 860, margin: "0 auto", padding: "30px 24px 70px" }}>
            <h2 style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 34, color: colors.bottleDeep, marginBottom: 4 }}>Branding Kit</h2>
            <p style={{ color: alpha('ink', 0.6), marginTop: 0, marginBottom: 36 }}>The visual identity, ready to hand to a printer or social manager.</p>

            <h3 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.terracotta, marginBottom: 14 }}>Logo Lockups</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <div style={{ background: colors.bottleDeep, borderRadius: 12, padding: "30px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: "1 1 260px" }}>
                <LemonMark size={40} />
                <span style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 30, color: colors.ivory }}>{data.brand.name}</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: "0.3em", color: colors.lemon, textTransform: "uppercase" }}>On dark</span>
              </div>
              <div style={{ background: colors.ivory, border: `1px solid ${alpha('bottle', 0.2)}`, borderRadius: 12, padding: "30px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: "1 1 260px" }}>
                <LemonMark size={40} stroke={colors.bottle} />
                <span style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 30, color: colors.bottleDeep }}>{data.brand.name}</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: "0.3em", color: colors.terracotta, textTransform: "uppercase" }}>On light</span>
              </div>
            </div>

            <h3 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.terracotta, marginBottom: 14 }}>Palette</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 12, marginBottom: 40 }}>
              {PALETTE.map((p) => (
                <div key={p.hex} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${alpha('bottle', 0.15)}` }}>
                  <div style={{ height: 70, background: p.hex }} />
                  <div style={{ padding: "8px 10px", background: "#fff" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 11, color: alpha('ink', 0.55) }}>{p.hex}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.terracotta, marginBottom: 14 }}>Typography</h3>
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 32, margin: "0 0 4px" }}>Fraunces — Display</p>
              <p style={{ fontFamily: fonts.body, fontSize: 22, margin: "0 0 4px", color: alpha('ink', 0.75) }}>Cormorant Garamond — Body copy, dish descriptions</p>
              <p style={{ fontFamily: fonts.mono, fontSize: 14, letterSpacing: "0.05em", color: alpha('ink', 0.6) }}>SPACE MONO — Prices, labels, utility</p>
            </div>

            <h3 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.terracotta, marginBottom: 14 }}>Social Preview</h3>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ width: 220, height: 220, background: `linear-gradient(160deg,${colors.bottle},${colors.bottleDeep})`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <LemonMark size={34} />
                <span style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 24, color: colors.ivory }}>{data.brand.name}</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 8, letterSpacing: "0.25em", color: colors.lemon, textTransform: "uppercase" }}>Instagram Cover</span>
              </div>
              <div style={{ width: 300, borderRadius: 14, border: `1px solid ${alpha('bottle', 0.2)}`, background: "#fff", padding: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                <LemonMark size={26} stroke={colors.bottle} />
                <span style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: colors.bottleDeep }}>{data.brand.name}</span>
                <span style={{ fontSize: 14, color: alpha('ink', 0.6), fontStyle: "italic" }}>{data.brand.tagline}</span>
                <span style={{ fontFamily: fonts.mono, fontSize: 10, color: alpha('ink', 0.5), marginTop: 8 }}>{data.brand.phone} · {data.brand.website}</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- ADMIN ---------------- */}
        {view === "admin" && (
          <div className="limo-fade" style={{ maxWidth: 760, margin: "0 auto", padding: "30px 24px 70px" }}>
            {!adminUnlocked ? (
              <div style={{ maxWidth: 340, margin: "60px auto", textAlign: "center" }}>
                <Lock size={26} style={{ color: colors.bottle }} />
                <h2 style={{ fontFamily: fonts.display, fontStyle: "italic", fontSize: 26, margin: "14px 0 6px" }}>Staff Login</h2>
                <p style={{ fontSize: 14, color: alpha('ink', 0.55), marginBottom: 18 }}>Enter the staff PIN to edit dishes and prices. Demo PIN: <strong>1234</strong></p>
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
                {pinError && <p style={{ color: colors.terracotta, fontSize: 13, marginTop: 8 }}>Incorrect PIN, try again.</p>}
                <button className="limo-btn" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
                  onClick={() => { if (pinInput === STAFF_PIN) setAdminUnlocked(true); else setPinError(true); }}>
                  Unlock
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                  <h2 style={{ fontFamily: fonts.display, fontStyle: "italic", fontSize: 28, margin: 0 }}>Menu Editor</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <PrintButton data={data} />
                    <button className="limo-btn ghost" onClick={resetDraft}><RotateCcw size={13} /> Discard changes</button>
                    <button className="limo-btn" onClick={saveDraft}>
                      {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save changes</>}
                    </button>
                  </div>
                </div>

                <details style={{ marginBottom: 20, background: "#fff", borderRadius: 10, padding: "12px 16px", border: `1px solid ${alpha('bottle', 0.15)}` }}>
                  <summary style={{ cursor: "pointer", fontFamily: fonts.mono, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Restaurant info</summary>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginTop: 14 }}>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Name
                      <input className="limo-input" value={draft.brand.name} onChange={(e) => updateBrand("name", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Tagline
                      <input className="limo-input" value={draft.brand.tagline} onChange={(e) => updateBrand("tagline", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Est. line
                      <input className="limo-input" value={draft.brand.estLine} onChange={(e) => updateBrand("estLine", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Hours
                      <input className="limo-input" value={draft.brand.hours} onChange={(e) => updateBrand("hours", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Phone
                      <input className="limo-input" value={draft.brand.phone} onChange={(e) => updateBrand("phone", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Address
                      <input className="limo-input" value={draft.brand.address} onChange={(e) => updateBrand("address", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Instagram
                      <input className="limo-input" value={draft.brand.instagram} onChange={(e) => updateBrand("instagram", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>Website
                      <input className="limo-input" value={draft.brand.website} onChange={(e) => updateBrand("website", e.target.value)} />
                    </label>
                    <label style={{ fontSize: 12, color: alpha('ink', 0.6) }}>WhatsApp number (digits only, with country code — no + or spaces, e.g. 14165550182)
                      <input className="limo-input" value={draft.brand.whatsapp || ""} onChange={(e) => updateBrand("whatsapp", e.target.value.replace(/[^0-9]/g, ""))} placeholder="Leave blank to hide ordering" />
                    </label>
                  </div>
                </details>

                {draft.categories.map((cat) => (
                  <div key={cat.id} style={{ background: "#fff", borderRadius: 10, border: `1px solid ${alpha('bottle', 0.15)}`, marginBottom: 14, overflow: "hidden" }}>
                    <button
                      onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)}
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <span style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 600, fontSize: 19 }}>{cat.title}</span>
                      {openCat === cat.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openCat === cat.id && (
                      <div style={{ padding: "0 16px 18px" }}>
                        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                          <input className="limo-input" value={cat.title} onChange={(e) => updateCategoryField(cat.id, "title", e.target.value)} placeholder="Category title" />
                          <input className="limo-input" value={cat.subtitle} onChange={(e) => updateCategoryField(cat.id, "subtitle", e.target.value)} placeholder="Category subtitle" />
                        </div>
                        {cat.items.map((it) => (
                          <div key={it.id} style={{ border: `1px solid ${alpha('bottle', 0.12)}`, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                            <div style={{ display: "flex", gap: 10 }}>
                              {it.image ? (
                                <img src={it.image} alt="" style={{ width: 52, height: 52, borderRadius: 6, objectFit: "cover", flexShrink: 0, background: alpha('bottle', 0.06) }} onError={(e) => { e.currentTarget.style.opacity = 0.2; }} />
                              ) : (
                                <div style={{ width: 52, height: 52, borderRadius: 6, flexShrink: 0, background: alpha('bottle', 0.06), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <ImageIcon size={18} style={{ color: alpha('ink', 0.3) }} />
                                </div>
                              )}
                              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 3fr 80px auto", gap: 8, alignItems: "center" }}>
                                <input className="limo-input" value={it.name} onChange={(e) => updateItem(cat.id, it.id, "name", e.target.value)} placeholder="Dish name" />
                                <input className="limo-input" value={it.desc} onChange={(e) => updateItem(cat.id, it.id, "desc", e.target.value)} placeholder="Description" />
                                <input className="limo-input" value={it.price} onChange={(e) => updateItem(cat.id, it.id, "price", e.target.value)} placeholder="Price" />
                                <button onClick={() => removeItem(cat.id, it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: colors.terracotta }}><Trash2 size={16} /></button>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, paddingLeft: 62 }}>
                              <input className="limo-input" value={it.image || ""} onChange={(e) => updateItem(cat.id, it.id, "image", e.target.value)} placeholder="Photo URL (optional) — paste an image link" style={{ flex: 1 }} />
                              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: alpha('ink', 0.6), whiteSpace: "nowrap" }}>
                                <input type="checkbox" checked={it.veg} onChange={(e) => updateItem(cat.id, it.id, "veg", e.target.checked)} /> Veg
                              </label>
                            </div>
                          </div>
                        ))}
                        <button className="limo-btn ghost" style={{ marginTop: 8 }} onClick={() => addItem(cat.id)}><Plus size={13} /> Add dish</button>
                      </div>
                    )}
                  </div>
                ))}

                {saveStatus === "error" && <p style={{ color: colors.terracotta, fontSize: 13 }}>Something went wrong saving — try again.</p>}
                <p style={{ fontSize: 12.5, color: alpha('ink', 0.45), fontStyle: "italic", marginTop: 20 }}>
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
