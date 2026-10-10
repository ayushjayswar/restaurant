import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

import { alignFromX, fluidFont, getAnimation, placeStyle } from "./Blockutils";


// Slider ki image purane format (sirf url string) ya naye format ({url, title, subtitle}) dono me ho sakti hai
const slideOf = (item) =>
  typeof item === "string"
    ? { url: item, title: "", subtitle: "" }
    : { url: item?.url || "", title: item?.title || "", subtitle: item?.subtitle || "" };

// Typing effect: text ek ek akshar karke aata hai
const Typewriter = ({ text }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= text.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {text.slice(0, count)}
      <span className="animate-pulse">|</span>
    </>
  );
};

// Hero me element jaldi dikhta hai, isliye whileInView ki jagah animate use hota hai
const Reveal = ({ type, delay = 0, as = "div", className = "", style, children }) => {
  const anim = getAnimation(type);
  const Tag = motion[as];

  if (!anim) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={anim.initial}
      animate={anim.visible}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
};

// slider = { title, titleAnimation, overlayHeading, overlaySubtext, overlayX, interval, images[] }
// children = hero ke neeche overlay hone wala content (jaise search bar)
const SliderView = ({ slider, fullScreen = false, children }) => {
  const images = (slider?.images || []).map(slideOf).filter((slide) => slide.url);
  const [active, setActive] = useState(0);

  const intervalSeconds = slider?.interval || 5;

  useEffect(() => {
    if (images.length < 2) return undefined;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [images.length, intervalSeconds]);

  const current = images.length ? active % images.length : 0;

  // Har image ka apna title / subtitle (purani slides jaisa)
  const slideTitle = images[current]?.title || "";
  const slideSubtitle = images[current]?.subtitle || "";
  const hasSlideText = Boolean(slideTitle || slideSubtitle);

  const title = slider?.title || "";
  const titleAnimation = slider?.titleAnimation || "slide-up";

  const overlayHeading = slider?.overlayHeading || "";
  const overlaySubtext = slider?.overlaySubtext || "";
  const overlayX = slider?.overlayX ?? 50;

  // typing sirf title ke liye hai, overlay text me slide-up use hoga
  const overlayAnimation = titleAnimation === "typing" ? "slide-up" : titleAnimation;

  return (
    <section
      className={`relative w-full overflow-hidden bg-stone-950 ${
        fullScreen ? "h-[100svh] min-h-[600px]" : "h-[420px] md:h-[520px]"
      }`}
    >
      {/* IMAGES */}
      {images.map((slide, index) => (
        <div
          key={`${slide.url}-${index}`}
          aria-hidden={current !== index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            current === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
          }`}
          style={{ backgroundImage: `url("${slide.url}")` }}
        />
      ))}

      {/* dark layer, taaki text aur navbar padhne me aaye */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/45" />

      {/* TITLE: slider ke upar, center me */}
      {title && (
        <div
          className={`absolute inset-x-0 z-20 px-6 text-center ${
            fullScreen ? "top-24 md:top-28" : "top-8 md:top-10"
          }`}
        >
          <h2
            className="font-bold tracking-tight text-white drop-shadow-lg"
            style={{ fontSize: fluidFont(56) }}
          >
            {titleAnimation === "typing" ? (
              <Typewriter text={title} />
            ) : (
              <Reveal type={titleAnimation} as="span" className="inline-block">
                {title}
              </Reveal>
            )}
          </h2>
        </div>
      )}

      {/* OVERLAY TEXT: admin ke slider se left / center / right */}
      {!hasSlideText && (overlayHeading || overlaySubtext) && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6 md:px-16">
          <div style={{ textAlign: alignFromX(overlayX) }}>
            <div style={{ ...placeStyle(overlayX), maxWidth: "min(100%, 48rem)" }}>
              {overlayHeading && (
                <Reveal
                  type={overlayAnimation}
                  delay={0.2}
                  as="h3"
                  className="mb-3 font-bold leading-tight text-white drop-shadow-lg"
                  style={{ fontSize: fluidFont(44) }}
                >
                  {overlayHeading}
                </Reveal>
              )}

              {overlaySubtext && (
                <Reveal
                  type={overlayAnimation}
                  delay={0.4}
                  as="p"
                  className="whitespace-pre-line text-white/90 drop-shadow-md"
                  style={{ fontSize: fluidFont(22) }}
                >
                  {overlaySubtext}
                </Reveal>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HAR IMAGE KA APNA TEXT: slide badalne par naya text animation ke saath aata hai */}
      {hasSlideText && (
        <div
          key={`slide-text-${current}`}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6 md:px-16"
        >
          <div style={{ textAlign: alignFromX(overlayX) }}>
            <div style={{ ...placeStyle(overlayX), maxWidth: "min(100%, 48rem)" }}>
              {slideTitle && (
                <Reveal
                  type={overlayAnimation}
                  as="h3"
                  className="mb-3 font-bold leading-tight text-white drop-shadow-lg"
                  style={{ fontSize: fluidFont(52) }}
                >
                  {slideTitle}
                </Reveal>
              )}

              {slideSubtitle && (
                <Reveal
                  type={overlayAnimation}
                  delay={0.2}
                  as="p"
                  className="whitespace-pre-line text-white/90 drop-shadow-md"
                  style={{ fontSize: fluidFont(22) }}
                >
                  {slideSubtitle}
                </Reveal>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHILDREN (search bar) */}
      {children && (
        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-50 sm:px-6">{children}</div>
      )}

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index ? "w-7 bg-orange-500" : "w-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Tunnel ka URL badle to .env me VITE_API_URL set karo.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://lcd-dressing-jim-oven.trycloudflare.com";

// Home page me jaise pehle <HeroSlider /> lagta tha, waise hi lagao.
// Admin > Home ke sliders yeh khud backend se leta hai aur ek ke neeche ek dikhata hai.
// Agar kisi ko direct data dena ho to <HeroSlider slider={...} /> bhi chalega.
const HeroSlider = ({ slider, fullScreen, children }) => {
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    if (slider) return undefined;

    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(`${API_URL}/content`);
        if (!response.ok) return;

        const result = await response.json();
        const list = result?.hero?.sliders;

        if (!cancelled && Array.isArray(list)) {
          setSliders(list.filter((s) => (s.images || []).some((img) => slideOf(img).url) || s.title));
        }
      } catch (err) {
        console.error("Slider fetch error:", err);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slider]);

  if (slider) {
    return (
      <SliderView slider={slider} fullScreen={fullScreen}>
        {children}
      </SliderView>
    );
  }

  if (sliders.length === 0) return null;

  return (
    <>
      {sliders.map((item, index) => (
        <SliderView key={item.id || index} slider={item} />
      ))}
    </>
  );
};

export default HeroSlider;