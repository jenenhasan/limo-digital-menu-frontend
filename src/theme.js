// ---------------------------------------------------------------
// THEME
// This is the one file to edit when re-skinning this template for
// a new client. Change the colors and fonts here and the entire
// site (cover, menu, branding kit, staff editor) updates.
//
// Keep the KEY NAMES the same (ivory, bottle, bottleDeep, lemon,
// terracotta, ink) even if you change what they point to — the
// rest of the app refers to these names, not the hex values.
// If a client's palette needs a 7th color, add a new key and wire
// it in where needed.
// ---------------------------------------------------------------

export const colors = {
  ivory: "#FBF3DE",      // page background
  bottle: "#1F3D2E",     // primary brand color (header, buttons, active states)
  bottleDeep: "#142A20", // darker shade — footer, nav bar background
  lemon: "#F4CD3C",      // accent — highlights, the eyebrow text, logo strokes
  terracotta: "#C4602F", // secondary accent — prices, category numerals
  ink: "#241F16",        // body text
};

// Display name shown on the Branding Kit page's palette swatches.
export const paletteLabels = {
  ivory: "Ivory",
  bottle: "Bottle Green",
  bottleDeep: "Bottle Deep",
  lemon: "Lemon",
  terracotta: "Terracotta",
  ink: "Ink",
};

export const fonts = {
  display: "'Fraunces', serif",       // logo, headings — italic display serif
  body: "'Cormorant Garamond', serif", // dish descriptions, body copy
  mono: "'Space Mono', monospace",     // prices, labels, utility text
};

// The Google Fonts <link> in index.html must match whatever font
// families you reference above. If you change fonts for a client,
// update the href in index.html to load the new family too.

// Converts a theme color name + opacity into an rgba() string,
// e.g. alpha('ink', 0.6) -> "rgba(36,31,22,0.6)"
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

export function alpha(colorName, opacity) {
  const hex = colors[colorName];
  if (!hex) {
    console.warn(`theme.alpha: unknown color "${colorName}"`);
    return `rgba(0,0,0,${opacity})`;
  }
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${opacity})`;
}

const theme = { colors, fonts, alpha, paletteLabels };
export default theme;
