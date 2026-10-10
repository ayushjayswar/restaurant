import React from "react";
import { Trash2 } from "lucide-react";

import ImageUploadField from "./Imageuploadfield";
import SliderControl from "./Slidercontrol";
import {
  ANIMATIONS,
  FIT_LIST,
  FONT_LIST,
  makeBlock,
  normalizeMedia,
  normalizeTextOnly,
} from "./Blockutils";


const BLOCK_TYPES = [
  { value: "image", label: "Image only" },
  { value: "image-text", label: "Image + Text" },
  { value: "heading", label: "Heading" },
  { value: "paragraph", label: "Paragraph" },
];

const TYPE_LABEL = {
  image: "Image",
  "image-text": "Image + Text",
  heading: "Heading",
  paragraph: "Paragraph",
};

const INPUT_CLASS =
  "w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500 text-white text-sm placeholder:text-gray-600";

const POSITION_MARKS = [
  ["Left", 0],
  ["Center", 50],
  ["Right", 100],
];

// ---- Chhote reusable pieces (module level, taaki typing me remount na ho) ----

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-2">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={INPUT_CLASS}>
      {options.map(([val, text]) => (
        <option key={val} value={val}>
          {text}
        </option>
      ))}
    </select>
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-sm font-semibold text-white border-t border-gray-700 pt-4">{children}</h4>
);

// Image ki width / height / rounded / fit / position
const ImageSettings = ({ m, set, showWidth, showPosition }) => (
  <div className="space-y-4">
    <SectionTitle>Image size</SectionTitle>

    {showWidth && (
      <SliderControl
        label="Width"
        value={m.widthPct}
        onChange={(widthPct) => set({ widthPct })}
        min={10}
        max={100}
        unit="%"
        marks={[
          ["Small", 10],
          ["Half", 50],
          ["Full", 100],
        ]}
      />
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SelectField
        label="Height"
        value={m.heightMode}
        onChange={(heightMode) => set({ heightMode })}
        options={[
          ["auto", "Auto (full image)"],
          ["custom", "Custom height"],
        ]}
      />

      <SelectField
        label="Image fit"
        value={m.fit}
        onChange={(imageFit) => set({ imageFit })}
        options={FIT_LIST}
      />
    </div>

    {m.heightMode === "custom" && (
      <SliderControl
        label="Height"
        value={m.heightPx}
        onChange={(heightPx) => set({ heightPx })}
        min={120}
        max={900}
        step={10}
        unit="px"
      />
    )}

    {showPosition && m.widthPct < 100 && (
      <SliderControl
        label="Image position (left to right)"
        value={m.imageX}
        onChange={(imageX) => set({ imageX })}
        unit="%"
        marks={POSITION_MARKS}
      />
    )}

    <label className="flex items-center gap-3 text-sm text-gray-300">
      <input
        type="checkbox"
        checked={m.rounded}
        onChange={(e) => set({ rounded: e.target.checked })}
        className="w-4 h-4 accent-red-600"
      />
      Rounded corners
    </label>

    {m.rounded && (
      <SliderControl
        label="Roundness"
        value={m.radius}
        onChange={(radius) => set({ radius })}
        min={0}
        max={80}
        unit="px"
      />
    )}

    <SelectField
      label="Image animation"
      value={m.animation}
      onChange={(animation) => set({ animation })}
      options={ANIMATIONS}
    />
  </div>
);

// Heading + description + font + size + position + animation
const TextSettings = ({ m, set }) => (
  <div className="space-y-4">
    <SectionTitle>Text</SectionTitle>

    <div>
      <label className="block text-xs text-gray-400 mb-2">Heading</label>
      <input
        value={m.heading}
        onChange={(e) => set({ heading: e.target.value })}
        placeholder="Enter heading..."
        className={INPUT_CLASS}
      />
    </div>

    <div>
      <label className="block text-xs text-gray-400 mb-2">Description</label>
      <textarea
        value={m.text}
        onChange={(e) => set({ text: e.target.value })}
        placeholder="Enter description..."
        rows={4}
        className={`${INPUT_CLASS} resize-none`}
      />
    </div>

    <SelectField
      label="Font"
      value={m.font}
      onChange={(font) => set({ font })}
      options={FONT_LIST.map((f) => [f, f])}
    />

    <SliderControl
      label="Heading size"
      value={m.headingPx}
      onChange={(headingPx) => set({ headingPx })}
      min={18}
      max={90}
      unit="px"
    />

    <SliderControl
      label="Description size"
      value={m.textPx}
      onChange={(textPx) => set({ textPx })}
      min={12}
      max={32}
      unit="px"
    />

    <SliderControl
      label="Text position (left to right)"
      value={m.textX}
      onChange={(textX) => set({ textX })}
      unit="%"
      marks={POSITION_MARKS}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SelectField
        label="Heading animation"
        value={m.headingAnimation}
        onChange={(headingAnimation) => set({ headingAnimation })}
        options={ANIMATIONS}
      />
      <SelectField
        label="Description animation"
        value={m.descriptionAnimation}
        onChange={(descriptionAnimation) => set({ descriptionAnimation })}
        options={ANIMATIONS}
      />
    </div>
  </div>
);

// ---- Image / Image + Text ----
const MediaBlockFields = ({ block, update, authFetch }) => {
  const m = normalizeMedia(block);
  const isImageText = block.type === "image-text";
  const imageKey = isImageText ? "image" : "url";

  const textOptions = isImageText
    ? [
        ["right", "Text on right"],
        ["left", "Text on left"],
        ["above", "Text above image"],
        ["below", "Text below image"],
        ["overlay", "Text on image (overlay)"],
      ]
    : [
        ["none", "No text"],
        ["overlay", "Text on image (overlay)"],
        ["above", "Text above image"],
        ["below", "Text below image"],
      ];

  const side = m.textPosition === "left" || m.textPosition === "right";
  const overlay = m.textPosition === "overlay";
  const hasText = m.textPosition !== "none";

  return (
    <div className="space-y-5">
      <ImageUploadField
        label="Image"
        value={m.image}
        onChange={(url) => update({ [imageKey]: url })}
        authFetch={authFetch}
      />

      <SelectField
        label={isImageText ? "Text layout" : "Add text with image?"}
        value={m.textPosition}
        onChange={(textPosition) => update({ textPosition })}
        options={textOptions}
      />

      {!overlay && (
        <ImageSettings m={m} set={update} showWidth showPosition={!side} />
      )}

      {overlay && (
        <ImageSettings m={m} set={update} showWidth={false} showPosition={false} />
      )}

      {hasText && <TextSettings m={m} set={update} />}
    </div>
  );
};

// ---- Heading / Paragraph ----
const TextOnlyFields = ({ block, update }) => {
  const t = normalizeTextOnly(block);
  const isHeading = block.type === "heading";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          {isHeading ? "Heading text" : "Paragraph text"}
        </label>

        {isHeading ? (
          <input
            value={t.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Enter heading..."
            className={INPUT_CLASS}
          />
        ) : (
          <textarea
            value={t.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Enter paragraph..."
            rows={4}
            className={`${INPUT_CLASS} resize-none`}
          />
        )}
      </div>

      <SelectField
        label="Font"
        value={t.font}
        onChange={(font) => update({ font })}
        options={FONT_LIST.map((f) => [f, f])}
      />

      <SliderControl
        label="Text size"
        value={t.px}
        onChange={(fontPx) => update({ fontPx })}
        min={12}
        max={isHeading ? 96 : 36}
        unit="px"
      />

      <SliderControl
        label="Text position (left to right)"
        value={t.textX}
        onChange={(textX) => update({ textX })}
        unit="%"
        marks={POSITION_MARKS}
      />

      <SelectField
        label="Animation"
        value={t.animation}
        onChange={(animation) => update({ animation })}
        options={ANIMATIONS}
      />
    </div>
  );
};

// =====================================================
// MAIN EDITOR
// Home / About / Footer / Contact sab isi ko use karte hain.
// Purane blocks bhi khulte hain, edit karte hi naye format me save hote hain.
// =====================================================
const ContentBlockEditor = ({ label = "Content Blocks", items, onChange, authFetch }) => {
  const blocks = items || [];

  const addBlock = (type) => onChange([...blocks, makeBlock(type)]);

  const updateBlock = (index, patch) =>
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));

  const removeBlock = (index) => onChange(blocks.filter((_, i) => i !== index));

  const moveBlock = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;

    const copy = [...blocks];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="block text-sm text-gray-400">{label}</label>

        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.value}
              type="button"
              onClick={() => addBlock(bt.value)}
              className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg hover:border-red-500 hover:text-white text-gray-300 transition"
            >
              + {bt.label}
            </button>
          ))}
        </div>
      </div>

      {blocks.length === 0 && (
        <div className="border border-dashed border-gray-700 rounded-xl p-7 text-center">
          <p className="text-sm text-gray-500">No content blocks yet.</p>
          <p className="text-xs text-gray-600 mt-1">
            Add an image, an image with text, a heading or a paragraph.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {blocks.map((block, index) => {
          const update = (patch) => updateBlock(index, patch);
          const isMedia = block.type === "image" || block.type === "image-text";

          return (
            <div
              key={block._id || index}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wide text-red-400 font-semibold">
                    {TYPE_LABEL[block.type] || block.type}
                  </span>
                  <span className="text-xs text-gray-600">Block {index + 1}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === blocks.length - 1}
                    className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                    title="Remove block"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {isMedia ? (
                <MediaBlockFields block={block} update={update} authFetch={authFetch} />
              ) : (
                <TextOnlyFields block={block} update={update} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentBlockEditor;