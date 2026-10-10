import React from "react";
import { motion } from "motion/react";

import {
  FONT_MAP,
  alignFromX,
  fluidFont,
  getAnimation,
  normalizeMedia,
  normalizeTextOnly,
  placeStyle,
} from "./blockUtils";

// Scroll karne par animation. Sab blocks yahi use karte hain.
const Anim = ({ type = "fade", delay = 0, as = "div", className = "", style, children }) => {
  const anim = getAnimation(type);

  if (!anim) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  const Tag = motion[as];

  return (
    <Tag
      className={className}
      style={style}
      initial={anim.initial}
      whileInView={anim.visible}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
};

/* =====================================================
   HEADING + DESCRIPTION (image ke saath wala text)
===================================================== */

const TextBox = ({ m, headingClassName, paragraphClassName }) => {
  if (!m.heading && !m.text) return null;

  return (
    <div
      className="w-full"
      style={{
        fontFamily: FONT_MAP[m.font] || FONT_MAP.Poppins,
        textAlign: alignFromX(m.textX),
      }}
    >
      {/* position wrapper alag hai, taaki animation ka transform na takraye */}
      <div style={placeStyle(m.textX)}>
        {m.heading && (
          <Anim
            as="h3"
            type={m.headingAnimation}
            className={`${headingClassName} mb-4 font-bold drop-shadow-lg`}
            style={{ fontSize: fluidFont(m.headingPx) }}
          >
            {m.heading}
          </Anim>
        )}

        {m.text && (
          <Anim
            as="p"
            type={m.descriptionAnimation}
            delay={0.1}
            className={`${paragraphClassName} whitespace-pre-line leading-relaxed drop-shadow-md`}
            style={{ fontSize: fluidFont(m.textPx) }}
          >
            {m.text}
          </Anim>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   IMAGE / IMAGE + TEXT
===================================================== */

const MediaBlock = ({ block, headingClassName, paragraphClassName }) => {
  const m = normalizeMedia(block);

  if (!m.image) return null;

  const customHeight = m.heightMode === "custom";
  const hasText = m.textPosition !== "none" && (m.heading || m.text);
  const textProps = { m, headingClassName, paragraphClassName };

  const imgStyle = {
    width: "100%",
    height: customHeight ? `${m.heightPx}px` : "auto",
    objectFit: m.fit,
    borderRadius: m.rounded ? `${m.radius}px` : 0,
    display: "block",
  };

  /* ---------- TEXT ON IMAGE ---------- */
  if (m.textPosition === "overlay" && hasText) {
    const heightClass = customHeight ? "" : "min-h-[420px] md:min-h-[560px]";
    const heightStyle = customHeight ? { height: `${m.heightPx}px` } : undefined;

    return (
      <Anim type={m.animation} className="relative w-full overflow-hidden">
        <div className={`relative w-full ${heightClass}`} style={heightStyle}>
          <img
            src={m.image}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: m.fit }}
          />
          <div className="absolute inset-0 bg-black/45" />

          <div
            className={`relative z-10 flex items-center px-6 py-16 ${heightClass}`}
            style={heightStyle}
          >
            <div className="mx-auto w-full max-w-6xl">
              <TextBox {...textProps} />
            </div>
          </div>
        </div>
      </Anim>
    );
  }

  /* ---------- IMAGE + TEXT SIDE BY SIDE ---------- */
  if ((m.textPosition === "left" || m.textPosition === "right") && hasText) {
    const imageEl = (
      <div
        className="w-full md:w-[var(--w)] md:shrink-0"
        style={{ "--w": `${m.widthPct}%` }}
      >
        <Anim type={m.animation}>
          <img src={m.image} alt="" style={imgStyle} />
        </Anim>
      </div>
    );

    const textEl = (
      <div className="min-w-0 flex-1">
        <TextBox {...textProps} />
      </div>
    );

    const textFirst = m.textPosition === "left";

    return (
      <div className="w-full px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-12">
          {textFirst ? textEl : imageEl}
          {textFirst ? imageEl : textEl}
        </div>
      </div>
    );
  }

  /* ---------- IMAGE ONLY / TEXT ABOVE / TEXT BELOW ---------- */
  const fullWidth = m.widthPct >= 100;
  const marginLeft = `${((100 - m.widthPct) * m.imageX) / 100}%`;

  const imageEl = (
    <div
      style={{
        width: `${m.widthPct}%`,
        minWidth: "min(100%, 160px)",
        marginLeft,
      }}
    >
      <Anim type={m.animation}>
        <img src={m.image} alt="" style={imgStyle} />
      </Anim>
    </div>
  );

  const textEl = hasText ? (
    <div className="mx-auto w-full max-w-5xl px-6">
      <TextBox {...textProps} />
    </div>
  ) : null;

  return (
    <div className={`w-full ${fullWidth && !hasText ? "" : "py-8"} ${fullWidth ? "" : "px-6"}`}>
      {m.textPosition === "above" && textEl && <div className="mb-8">{textEl}</div>}
      {imageEl}
      {m.textPosition === "below" && textEl && <div className="mt-8">{textEl}</div>}
    </div>
  );
};

/* =====================================================
   HEADING / PARAGRAPH
===================================================== */

const TextOnlyBlock = ({
  block,
  bgClassName,
  headingClassName,
  paragraphClassName,
}) => {
  const t = normalizeTextOnly(block);
  const isHeading = block.type === "heading";

  if (!t.text) return null;

  return (
    <Anim
      type={t.animation}
      className={`${bgClassName} w-full px-6 ${isHeading ? "py-10" : "pb-10"}`}
    >
      <div
        className="mx-auto max-w-4xl"
        style={{
          fontFamily: FONT_MAP[t.font] || FONT_MAP.Poppins,
          textAlign: alignFromX(t.textX),
        }}
      >
        <div style={placeStyle(t.textX)}>
          {isHeading ? (
            <h3
              className={`${headingClassName} font-bold`}
              style={{ fontSize: fluidFont(t.px) }}
            >
              {t.text}
            </h3>
          ) : (
            <p
              className={`${paragraphClassName} whitespace-pre-line leading-relaxed`}
              style={{ fontSize: fluidFont(t.px) }}
            >
              {t.text}
            </p>
          )}
        </div>
      </div>
    </Anim>
  );
};

/* =====================================================
   MAIN
   (variant prop purane pages ke liye rakha hai, ab use nahi hota)
===================================================== */

const ContentBlocks = ({
  blocks,
  className = "",
  bgClassName = "bg-black",
  headingClassName = "text-white",
  paragraphClassName = "text-white/80",
}) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={`${className} relative isolate w-full overflow-x-hidden`}>
      {blocks.map((block, i) => {
        const key = block._id || i;

        if (block.type === "image" || block.type === "image-text") {
          return (
            <MediaBlock
              key={key}
              block={block}
              headingClassName={headingClassName}
              paragraphClassName={paragraphClassName}
            />
          );
        }

        if (block.type === "heading" || block.type === "paragraph") {
          return (
            <TextOnlyBlock
              key={key}
              block={block}
              bgClassName={bgClassName}
              headingClassName={headingClassName}
              paragraphClassName={paragraphClassName}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default ContentBlocks;