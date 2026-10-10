import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import ImageUploadField from "./Imageuploadfield";
import SliderControl from "./Slidercontrol";
import { TITLE_ANIMATIONS, uid } from "./Blockutils";


// Slider ki image purane format (sirf url string) ya naye format ({url, title, subtitle}) dono me ho sakti hai
const slideOf = (item) =>
  typeof item === "string"
    ? { url: item, title: "", subtitle: "" }
    : { url: item?.url || "", title: item?.title || "", subtitle: item?.subtitle || "" };

const INPUT_CLASS =
  "w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500 text-white text-sm placeholder:text-gray-600";

// Purane HeroSlider ki 5 slides (images public/images folder me hain)
const OLD_SLIDES = [
  { url: "/images/slider1.jpg", title: "Welcome to Fork&Flame", subtitle: "An unforgettable dining experience" },
  { url: "/images/slider2.jpg", title: "Taste Something Special", subtitle: "Discover flavours made with passion" },
  { url: "/images/slider3.jpg", title: "Where Taste Meets Elegance", subtitle: "Every meal tells a story" },
  { url: "/images/slider4.jpg", title: "Moments Worth Sharing", subtitle: "Enjoy great food and beautiful moments" },
  { url: "/images/slider5.jpg", title: "Your Table Awaits", subtitle: "Make your next visit memorable" },
];

const EMPTY_SLIDE = { url: "", title: "", subtitle: "" };

const newSlider = (images = [EMPTY_SLIDE], extra = {}) => ({
  id: uid(),
  title: "",
  titleAnimation: "slide-up",
  overlayHeading: "",
  overlaySubtext: "",
  overlayX: 50,
  interval: 5,
  images,
  ...extra,
});

// Purani 5 slides ek naye slider ke roop me (text left me, purane design jaisa)
const oldSlider = () => newSlider(OLD_SLIDES, { overlayX: 0 });

// Module level: taaki typing ke time inputs remount na ho
const SliderCard = ({ slider, index, total, onUpdate, onRemove, onMove, authFetch }) => {
  const [open, setOpen] = useState(true);
  const images = (slider.images || []).map(slideOf);

  const setSlide = (i, patch) =>
    onUpdate({ images: images.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  const addImage = () => onUpdate({ images: [...images, EMPTY_SLIDE] });

  const removeImage = (i) => onUpdate({ images: images.filter((_, k) => k !== i) });

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 text-left min-w-0"
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="text-sm font-semibold truncate">
            Slider {index + 1}
            {slider.title ? ` - ${slider.title}` : ""}
          </span>
          <span className="text-xs text-gray-500 shrink-0">
            {images.filter((s) => s.url).length} images
          </span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-red-400 hover:text-red-300"
            title="Delete slider"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-5 space-y-5 border-t border-gray-700 pt-4">
          {/* TITLE */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Slider title</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-2">
                  Title (top center of the slider)
                </label>
                <input
                  value={slider.title || ""}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="e.g. Welcome to Fork&Flame"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Text animation</label>
                <select
                  value={slider.titleAnimation || "slide-up"}
                  onChange={(e) => onUpdate({ titleAnimation: e.target.value })}
                  className={INPUT_CLASS}
                >
                  {TITLE_ANIMATIONS.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* OVERLAY TEXT */}
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-white">Overlay text on images</h4>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Heading</label>
              <input
                value={slider.overlayHeading || ""}
                onChange={(e) => onUpdate({ overlayHeading: e.target.value })}
                placeholder="Leave empty for no overlay text"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Subtext</label>
              <textarea
                value={slider.overlaySubtext || ""}
                onChange={(e) => onUpdate({ overlaySubtext: e.target.value })}
                rows={2}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <SliderControl
              label="Text position (left to right)"
              value={slider.overlayX ?? 50}
              onChange={(overlayX) => onUpdate({ overlayX })}
              unit="%"
              marks={[
                ["Left", 0],
                ["Center", 50],
                ["Right", 100],
              ]}
            />
          </div>

          {/* IMAGES */}
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Images</h4>
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg hover:border-red-500 text-gray-300 transition"
              >
                <Plus size={13} /> Add image
              </button>
            </div>

            {images.length === 0 && (
              <p className="text-xs text-gray-500">No images yet. Add at least one image.</p>
            )}

            {images.map((slide, i) => (
              <div
                key={`${slider.id}-${i}`}
                className="bg-gray-900/60 border border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-red-400 font-semibold">Image {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-red-400 hover:text-red-300"
                    title="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <ImageUploadField
                  label=""
                  value={slide.url}
                  onChange={(url) => setSlide(i, { url })}
                  authFetch={authFetch}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Text on this image (optional)
                    </label>
                    <input
                      value={slide.title}
                      onChange={(e) => setSlide(i, { title: e.target.value })}
                      placeholder="Heading"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Subtext</label>
                    <input
                      value={slide.subtitle}
                      onChange={(e) => setSlide(i, { subtitle: e.target.value })}
                      placeholder="Subtext"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              </div>
            ))}

            {images.length > 1 && (
              <SliderControl
                label="Seconds per image"
                value={slider.interval ?? 5}
                onChange={(interval) => onUpdate({ interval })}
                min={2}
                max={12}
                unit="s"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const HomeSlidersEditor = ({ sliders, onChange, authFetch }) => {
  const list = sliders || [];

  const update = (i, patch) =>
    onChange(list.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const remove = (i) => {
    if (!window.confirm("Delete this slider?")) return;
    onChange(list.filter((_, idx) => idx !== i));
  };

  const move = (i, direction) => {
    const target = i + direction;
    if (target < 0 || target >= list.length) return;

    const copy = [...list];
    [copy[i], copy[target]] = [copy[target], copy[i]];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <label className="block text-sm text-gray-400">Hero Sliders</label>
          <p className="text-xs text-gray-600 mt-1">
            First slider is the top banner of the homepage. Others show below it.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange([...list, oldSlider()])}
            className="text-xs px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-red-500 text-gray-300 transition"
          >
            Import old 5 slides
          </button>

          <button
            type="button"
            onClick={() => onChange([...list, newSlider()])}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
          >
            <Plus size={14} /> Add new slider
          </button>
        </div>
      </div>

      {list.length === 0 && (
        <div className="border border-dashed border-gray-700 rounded-xl p-7 text-center">
          <p className="text-sm text-gray-500">No sliders yet.</p>
        </div>
      )}

      {list.map((slider, i) => (
        <SliderCard
          key={slider.id || i}
          slider={slider}
          index={i}
          total={list.length}
          onUpdate={(patch) => update(i, patch)}
          onRemove={() => remove(i)}
          onMove={(d) => move(i, d)}
          authFetch={authFetch}
        />
      ))}
    </div>
  );
};

export default HomeSlidersEditor;