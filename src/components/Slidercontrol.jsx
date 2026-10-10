import React from "react";

// Volume button jaisa slider. Har jagah (image size, rounded, text size,
// left/right position) yahi use hota hai.
//
// marks = [["Left", 0], ["Center", 50], ["Right", 100]]  -> click karke jump
const SliderControl = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  marks,
}) => {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : min;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs font-semibold text-red-400 tabular-nums">
          {safeValue}
          {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-red-600"
      />

      {marks && (
        <div className="flex justify-between mt-1">
          {marks.map(([text, markValue]) => (
            <button
              key={text}
              type="button"
              onClick={() => onChange(markValue)}
              className="text-[11px] text-gray-500 hover:text-red-400 transition"
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderControl;