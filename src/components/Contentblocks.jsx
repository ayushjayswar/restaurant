import React from "react";
import { motion } from "motion/react";

const FONT_MAP = {
  Poppins: "Poppins, sans-serif",
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  Georgia: "Georgia, serif",
};

const headingSizes = {
  small: "text-2xl md:text-3xl",
  medium: "text-3xl md:text-4xl",
  large: "text-4xl md:text-5xl",
  xlarge: "text-5xl md:text-6xl",
};

const paragraphSizes = {
  small: "text-sm md:text-base",
  medium: "text-base md:text-lg",
  large: "text-lg md:text-xl",
  xlarge: "text-xl md:text-2xl",
};

const imageSizes = {
  small: "w-full md:w-1/3",
  medium: "w-full md:w-1/2",
  large: "w-full md:w-2/3",
  full: "w-full",
};

const getAnimation = (animation) => {
  switch (animation) {
    case "slide-up":
      return {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
      };

    case "slide-left":
      return {
        initial: { opacity: 0, x: -50 },
        whileInView: { opacity: 1, x: 0 },
      };

    case "slide-right":
      return {
        initial: { opacity: 0, x: 50 },
        whileInView: { opacity: 1, x: 0 },
      };

    case "zoom":
      return {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
      };

    case "fade":
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
      };

    default:
      return {
        initial: false,
        whileInView: false,
      };
  }
};

const MotionWrapper = ({
  children,
  animation = "fade",
  className = "",
}) => {
  if (!animation || animation === "none") {
    return <div className={className}>{children}</div>;
  }

  const anim = getAnimation(animation);

  return (
    <motion.div
      className={className}
      initial={anim.initial}
      whileInView={anim.whileInView}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

const ContentBlocks = ({
  blocks,
  variant = "inline",
  className = "",
  bgClassName = "bg-black",
  headingClassName = "text-white",
  paragraphClassName = "text-white/80",
}) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div
      className={`${className} w-full relative isolate`}
    >
      {blocks.map((block, i) => {
        /* =====================================================
           IMAGE BLOCK
        ===================================================== */

        if (block.type === "image" && block.url) {
          const image = block.url;

          const position = block.imagePosition || "center";
          const size = block.imageSize || "large";
          const fit = block.imageFit || "cover";

          const textPosition = block.textPosition || "none";

          const text =
            block.text ||
            block.paragraph ||
            "";

          const heading = block.heading || "";

          const fontFamily =
            FONT_MAP[block.font] || FONT_MAP.Poppins;

          const textAlign =
            block.textAlign || "center";

          const textSize =
            paragraphSizes[block.fontSize] ||
            paragraphSizes.large;

          const headingSize =
            headingSizes[block.fontSize] ||
            headingSizes.large;

          const headingAnimation =
            block.headingAnimation ||
            block.textAnimation ||
            "fade";

          const descriptionAnimation =
            block.descriptionAnimation ||
            block.textAnimation ||
            "fade";

          let imageAlignment = "mx-auto";

          if (position === "left") {
            imageAlignment = "mr-auto";
          }

          if (position === "right") {
            imageAlignment = "ml-auto";
          }

          const imageWidth =
            position === "full"
              ? "w-full"
              : imageSizes[size] || imageSizes.large;

          const hasText =
            textPosition !== "none" &&
            (heading || text);

          const TextContent = ({ overlay = false }) => (
            <div
              className={
                overlay
                  ? "relative z-20 w-full max-w-4xl px-6 py-8"
                  : "w-full max-w-4xl mx-auto px-6"
              }
              style={{
                fontFamily,
                textAlign,
              }}
            >
              {heading && (
                <motion.h3
                  className={`${headingClassName} ${headingSize} font-bold mb-4 drop-shadow-lg`}
                  initial={
                    headingAnimation === "none"
                      ? false
                      : getAnimation(
                          headingAnimation
                        ).initial
                  }
                  whileInView={
                    headingAnimation === "none"
                      ? false
                      : getAnimation(
                          headingAnimation
                        ).whileInView
                  }
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  {heading}
                </motion.h3>
              )}

              {text && (
                <motion.p
                  className={`${paragraphClassName} ${textSize} leading-relaxed drop-shadow-md`}
                  initial={
                    descriptionAnimation === "none"
                      ? false
                      : getAnimation(
                          descriptionAnimation
                        ).initial
                  }
                  whileInView={
                    descriptionAnimation === "none"
                      ? false
                      : getAnimation(
                          descriptionAnimation
                        ).whileInView
                  }
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: "easeOut",
                  }}
                >
                  {text}
                </motion.p>
              )}
            </div>
          );

          /* =====================================================
             TEXT OVER IMAGE
          ===================================================== */

          if (
            textPosition === "overlay" &&
            hasText
          ) {
            return (
              <MotionWrapper
                key={i}
                animation={block.animation || "fade"}
                className="relative z-0 w-full overflow-hidden clear-both"
              >
                <div className="relative w-full min-h-[420px] md:min-h-[560px]">
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 w-full h-full"
                    style={{
                      objectFit: fit,
                    }}
                  />

                  <div className="absolute inset-0 bg-black/45" />

                  <div className="relative z-10 min-h-[420px] md:min-h-[560px] flex items-center justify-center">
                    <TextContent overlay />
                  </div>
                </div>
              </MotionWrapper>
            );
          }

          /* =====================================================
             TEXT ABOVE IMAGE
          ===================================================== */

          if (
            textPosition === "above" &&
            hasText
          ) {
            return (
              <MotionWrapper
                key={i}
                animation={block.animation || "fade"}
                className="relative z-0 w-full py-10 clear-both"
              >
                <TextContent />

                <div className="mt-8 flex w-full">
                  <img
                    src={image}
                    alt=""
                    className={`${imageWidth} ${imageAlignment} block h-auto max-h-[800px] rounded-xl`}
                    style={{
                      objectFit: fit,
                    }}
                  />
                </div>
              </MotionWrapper>
            );
          }

          /* =====================================================
             TEXT BELOW IMAGE
          ===================================================== */

          if (
            textPosition === "below" &&
            hasText
          ) {
            return (
              <MotionWrapper
                key={i}
                animation={block.animation || "fade"}
                className="relative z-0 w-full py-10 clear-both flow-root"
              >
                <div className="flex w-full">
                  <img
                    src={image}
                    alt=""
                    className={`${imageWidth} ${imageAlignment} block h-auto max-h-[800px] rounded-xl`}
                    style={{
                      objectFit: fit,
                    }}
                  />
                </div>

                <div className="mt-8 w-full clear-both">
                  <TextContent />
                </div>
              </MotionWrapper>
            );
          }

          /* =====================================================
             IMAGE ONLY
          ===================================================== */

          return (
            <MotionWrapper
              key={i}
              animation={block.animation || "fade"}
              className={`relative z-0 clear-both ${
                position === "full"
                  ? "w-full"
                  : "w-full px-6 py-8"
              }`}
            >
              <img
                src={image}
                alt=""
                className={`${imageWidth} ${imageAlignment} block h-auto max-h-[800px] rounded-xl`}
                style={{
                  objectFit: fit,
                }}
              />
            </MotionWrapper>
          );
        }

        /* =====================================================
           IMAGE + TEXT BLOCK
        ===================================================== */

        if (block.type === "image-text") {
          const image =
            block.image ||
            block.url ||
            "";

          const heading =
            block.heading || "";

          /*
           * Supports all possible paragraph formats
           */
          const singleText =
            block.text ||
            block.paragraph ||
            "";

          const paragraphs = Array.isArray(
            block.paragraphs
          )
            ? block.paragraphs
            : [];

          const fontFamily =
            FONT_MAP[block.font] ||
            FONT_MAP.Poppins;

          const imageFit =
            block.imageFit || "cover";

          const textAlign =
            block.textAlign || "left";

          const imageSize =
            block.imageSize || "medium";

          const textPosition =
            block.textPosition || "right";

          const headingSize =
            headingSizes[
              block.headingSize
            ] || headingSizes.large;

          const imageWidth =
            imageSizes[imageSize] ||
            imageSizes.medium;

          const imagePosition =
            block.imagePosition || "left";

          const imageAnimation =
            block.imageAnimation ||
            block.animation ||
            "fade";

          const headingAnimation =
            block.headingAnimation ||
            block.textAnimation ||
            "fade";

          const descriptionAnimation =
            block.descriptionAnimation ||
            block.textAnimation ||
            "fade";

          if (!image) return null;

          /* ---------------------------------------------
             IMAGE
          --------------------------------------------- */

          const imageElement = (
            <div
              className={`shrink-0 ${
                imagePosition === "full"
                  ? "w-full"
                  : imageWidth
              }`}
            >
              <div className="relative w-full overflow-hidden rounded-xl">
                <MotionWrapper
                  animation={imageAnimation}
                  className="relative z-0 w-full"
                >
                  <img
                    src={image}
                    alt=""
                    className="relative z-0 block w-full h-auto max-h-[700px] rounded-xl"
                    style={{
                      objectFit: imageFit,
                    }}
                  />
                </MotionWrapper>
              </div>
            </div>
          );

          /* ---------------------------------------------
             TEXT + PARAGRAPHS
          --------------------------------------------- */

          const textElement = (
            <div
              className="flex-1 min-w-0"
              style={{
                fontFamily,
                textAlign,
              }}
            >
              {heading && (
                <motion.h3
                  className={`${headingClassName} ${headingSize} font-bold mb-4 drop-shadow-lg`}
                  initial={
                    headingAnimation === "none"
                      ? false
                      : getAnimation(
                          headingAnimation
                        ).initial
                  }
                  whileInView={
                    headingAnimation === "none"
                      ? false
                      : getAnimation(
                          headingAnimation
                        ).whileInView
                  }
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  {heading}
                </motion.h3>
              )}

              {/* SINGLE TEXT */}
              {singleText && (
                <motion.p
                  className={`${paragraphClassName} text-base md:text-lg leading-relaxed mb-5`}
                  initial={
                    descriptionAnimation === "none"
                      ? false
                      : getAnimation(
                          descriptionAnimation
                        ).initial
                  }
                  whileInView={
                    descriptionAnimation === "none"
                      ? false
                      : getAnimation(
                          descriptionAnimation
                        ).whileInView
                  }
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1,
                    ease: "easeOut",
                  }}
                >
                  {singleText}
                </motion.p>
              )}

              {/* MULTIPLE PARAGRAPHS */}
              {paragraphs.length > 0 && (
                <div className="space-y-5">
                  {paragraphs.map(
                    (paragraph, index) => {
                      const paragraphText =
                        typeof paragraph ===
                        "string"
                          ? paragraph
                          : paragraph?.text ||
                            paragraph?.paragraph ||
                            "";

                      if (!paragraphText)
                        return null;

                      return (
                        <motion.p
                          key={index}
                          className={`${paragraphClassName} text-base md:text-lg leading-relaxed`}
                          initial={
                            descriptionAnimation ===
                            "none"
                              ? false
                              : getAnimation(
                                  descriptionAnimation
                                ).initial
                          }
                          whileInView={
                            descriptionAnimation ===
                            "none"
                              ? false
                              : getAnimation(
                                  descriptionAnimation
                                ).whileInView
                          }
                          viewport={{
                            once: true,
                            amount: 0.2,
                          }}
                          transition={{
                            duration: 0.7,
                            delay:
                              0.1 +
                              index * 0.08,
                            ease: "easeOut",
                          }}
                        >
                          {paragraphText}
                        </motion.p>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          );

          /* =====================================================
             OVERLAY
          ===================================================== */

          if (
            textPosition === "overlay"
          ) {
            return (
              <MotionWrapper
                key={i}
                animation="none"
                className="relative z-0 w-full overflow-hidden clear-both"
              >
                <div className="relative z-0 w-full min-h-[420px] md:min-h-[560px]">
                  <MotionWrapper
                    animation={imageAnimation}
                    className="absolute inset-0 z-0 w-full h-full"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full"
                      style={{
                        objectFit: imageFit,
                      }}
                    />
                  </MotionWrapper>

                  <div className="absolute inset-0 bg-black/45" />

                  <div className="relative z-10 min-h-[420px] md:min-h-[560px] flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-4xl">
                      {textElement}
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            );
          }

          /* =====================================================
             TEXT ABOVE IMAGE
          ===================================================== */

          if (
            textPosition === "above"
          ) {
            return (
              <MotionWrapper
                key={i}
                animation="none"
                className="relative z-0 w-full px-6 py-12 clear-both flow-root"
              >
                <div className="relative z-0 max-w-6xl mx-auto">
                  {textElement}

                  <div className="mt-8 flex justify-center w-full">
                    {imageElement}
                  </div>
                </div>
              </MotionWrapper>
            );
          }

          /* =====================================================
             IMAGE BELOW + TEXT
          ===================================================== */

          if (
            textPosition === "below"
          ) {
            return (
              <MotionWrapper
                key={i}
                animation="none"
                className="relative z-0 w-full px-6 py-12 clear-both flow-root"
              >
                <div className="relative z-0 max-w-6xl mx-auto">
                  <div className="flex justify-center w-full">
                    {imageElement}
                  </div>

                  <div className="mt-8 w-full clear-both">
                    {textElement}
                  </div>
                </div>
              </MotionWrapper>
            );
          }

          /* =====================================================
             SIDE BY SIDE
          ===================================================== */

          const textLeft =
            textPosition === "left";

          return (
            <MotionWrapper
              key={i}
              animation="none"
              className="relative z-0 w-full px-6 py-12 clear-both flow-root"
            >
              <div
                className="
                  relative
                  z-0
                  max-w-6xl
                  mx-auto
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  gap-8
                  md:gap-12
                "
              >
                {textLeft
                  ? textElement
                  : imageElement}

                {textLeft
                  ? imageElement
                  : textElement}
              </div>
            </MotionWrapper>
          );
        }

        /* =====================================================
           HEADING BLOCK
        ===================================================== */

        if (
          block.type === "heading" &&
          block.text
        ) {
          const fontFamily =
            FONT_MAP[block.font] ||
            FONT_MAP.Poppins;

          const size =
            headingSizes[
              block.fontSize
            ] || headingSizes.large;

          const align =
            block.textAlign || "center";

          return (
            <MotionWrapper
              key={i}
              animation={
                block.animation || "fade"
              }
              className={`${bgClassName} px-6 py-10 relative z-0 clear-both`}
            >
              <h3
                className={`${headingClassName} ${size} font-bold max-w-4xl mx-auto`}
                style={{
                  fontFamily,
                  textAlign: align,
                }}
              >
                {block.text}
              </h3>
            </MotionWrapper>
          );
        }

        /* =====================================================
           PARAGRAPH BLOCK
        ===================================================== */

        if (
          block.type === "paragraph" &&
          block.text
        ) {
          const fontFamily =
            FONT_MAP[block.font] ||
            FONT_MAP.Poppins;

          const size =
            paragraphSizes[
              block.fontSize
            ] || paragraphSizes.medium;

          const align =
            block.textAlign || "center";

          return (
            <MotionWrapper
              key={i}
              animation={
                block.animation || "fade"
              }
              className={`${bgClassName} px-6 pb-10 relative z-0 clear-both`}
            >
              <p
                className={`${paragraphClassName} max-w-3xl mx-auto leading-relaxed ${size}`}
                style={{
                  fontFamily,
                  textAlign: align,
                }}
              >
                {block.text}
              </p>
            </MotionWrapper>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ContentBlocks;