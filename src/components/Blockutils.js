// Shared helpers for HeroSlider, Contentblocks (website) and the admin editors.
// Ek hi jagah logic rakha hai, taaki admin preview aur website same dikhe.

export const FONT_MAP = {
  Poppins: "Poppins, sans-serif",
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  Georgia: "Georgia, serif",
};

export const FONT_LIST = Object.keys(FONT_MAP);

export const ANIMATIONS = [
  ["none", "None"],
  ["fade", "Fade"],
  ["slide-up", "Slide Up"],
  ["slide-left", "Slide Left"],
  ["slide-right", "Slide Right"],
  ["zoom", "Zoom"],
];

// Slider title ke liye "typing" bhi hai
export const TITLE_ANIMATIONS = [
  ["slide-up", "Slide Up"],
  ["fade", "Fade"],
  ["zoom", "Zoom"],
  ["typing", "Typing"],
  ["none", "None"],
];

export const FIT_LIST = [
  ["cover", "Cover (crop to fill)"],
  ["contain", "Contain (show whole image)"],
  ["fill", "Stretch"],
];

// ---- Purane blocks (presets) ko naye slider values me badalne ke liye ----
export const PRESET_HEADING_PX = { small: 28, medium: 36, large: 46, xlarge: 58 };
export const PRESET_TEXT_PX = { small: 15, medium: 17, large: 20, xlarge: 24 };
export const PRESET_WIDTH_PCT = { small: 33, medium: 50, large: 66, full: 100 };
export const POS_TO_X = { left: 0, center: 50, right: 100, full: 50 };

// 0 = left, 50 = center, 100 = right
export const alignFromX = (x = 50) => (x < 34 ? "left" : x > 66 ? "right" : "center");

// Element ko container ke andar x% par rakhta hai (0 = left edge, 100 = right edge).
// NOTE: motion animation isi element par mat lagao, transform override ho jayega.
export const placeStyle = (x = 50) => ({
  marginLeft: `${x}%`,
  transform: `translateX(-${x}%)`,
  width: "fit-content",
  maxWidth: "100%",
});

// Mobile par chhota, desktop par poora px size
export const fluidFont = (px) =>
  `clamp(${Math.round(px * 0.55)}px, ${(px / 12).toFixed(2)}vw, ${px}px)`;

export const getAnimation = (animation) => {
  switch (animation) {
    case "slide-up":
      return { initial: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
    case "slide-left":
      return { initial: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
    case "slide-right":
      return { initial: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
    case "zoom":
      return { initial: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
    case "fade":
      return { initial: { opacity: 0 }, visible: { opacity: 1 } };
    default:
      return null;
  }
};

export const uid = () => Math.random().toString(36).slice(2, 10);

// ---- Image / Image + Text block: purane aur naye dono format padhta hai ----
export function normalizeMedia(b = {}) {
  const isImageText = b.type === "image-text";

  const extraParagraphs = Array.isArray(b.paragraphs)
    ? b.paragraphs.map((p) => (typeof p === "string" ? p : p?.text || p?.paragraph || ""))
    : [];

  return {
    image: b.image || b.url || "",
    widthPct:
      b.widthPct ??
      (b.imagePosition === "full"
        ? 100
        : PRESET_WIDTH_PCT[b.imageSize] ?? (isImageText ? 50 : 100)),
    imageX: b.imageX ?? POS_TO_X[b.imagePosition] ?? (isImageText ? 0 : 50),
    heightMode: b.heightMode || "auto",
    heightPx: b.heightPx ?? 420,
    fit: b.imageFit || "cover",
    rounded: b.rounded ?? true,
    radius: b.radius ?? 12,
    animation: b.animation || b.imageAnimation || "fade",
    textPosition: b.textPosition || (isImageText ? "right" : "none"),
    heading: b.heading || "",
    text: [b.text || b.paragraph || "", ...extraParagraphs].filter(Boolean).join("\n\n"),
    font: b.font || "Poppins",
    headingPx: b.headingPx ?? PRESET_HEADING_PX[b.headingSize || b.fontSize] ?? 46,
    textPx: b.textPx ?? 18,
    textX: b.textX ?? POS_TO_X[b.textAlign] ?? (isImageText ? 0 : 50),
    headingAnimation: b.headingAnimation || b.textAnimation || "fade",
    descriptionAnimation: b.descriptionAnimation || b.textAnimation || "fade",
  };
}

// ---- Heading / Paragraph block ----
export function normalizeTextOnly(b = {}) {
  const isHeading = b.type === "heading";
  return {
    text: b.text || "",
    font: b.font || "Poppins",
    px: b.fontPx ?? (isHeading ? PRESET_HEADING_PX : PRESET_TEXT_PX)[b.fontSize] ?? (isHeading ? 46 : 18),
    textX: b.textX ?? POS_TO_X[b.textAlign] ?? 50,
    animation: b.animation || "fade",
  };
}

// ---- Naye blocks ke defaults (admin "+ Add" button) ----
export const makeBlock = (type) => {
  const base = {
    _id: uid(),
    type,
  };

  const media = {
    widthPct: 100,
    imageX: 50,
    heightMode: "auto",
    heightPx: 420,
    imageFit: "cover",
    rounded: false,
    radius: 16,
    animation: "fade",
    heading: "",
    text: "",
    font: "Poppins",
    headingPx: 44,
    textPx: 18,
    textX: 50,
    headingAnimation: "fade",
    descriptionAnimation: "fade",
  };

  if (type === "image") {
    return { ...base, ...media, url: "", textPosition: "none" };
  }

  if (type === "image-text") {
    return {
      ...base,
      ...media,
      image: "",
      widthPct: 45,
      imageX: 0,
      rounded: true,
      textPosition: "right",
      textX: 0,
    };
  }

  if (type === "heading") {
    return { ...base, text: "", font: "Poppins", fontPx: 44, textX: 50, animation: "fade" };
  }

  return { ...base, text: "", font: "Poppins", fontPx: 18, textX: 50, animation: "fade" };
};

// Slider ki image purane format (sirf url string) ya naye format ({url, title, subtitle}) dono me ho sakti hai
export const slideOf = (item) =>
  typeof item === "string"
    ? { url: item, title: "", subtitle: "" }
    : { url: item?.url || "", title: item?.title || "", subtitle: item?.subtitle || "" };