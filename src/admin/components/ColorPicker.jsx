import { useState } from 'react';

const ColorPicker = ({ label = 'Color Palette', values = [], onChange }) => {
  const [hex, setHex] = useState('#ffffff');

  const addColor = () => {
    if (!hex) return;
    onChange?.([...values, hex]);
    setHex('#ffffff');
  };

  const removeColor = (color) => {
    onChange?.(values.filter((item) => item !== color));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-[0.35em] text-mist">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(event) => setHex(event.target.value)}
          className="h-11 w-16 cursor-pointer rounded-2xl border border-slate-200"
        />
        <input
          type="text"
          value={hex}
          onChange={(event) => setHex(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-ink"
        />
        <button
          type="button"
          onClick={addColor}
          className="rounded-2xl border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-ink"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {values.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => removeColor(color)}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-600"
          >
            <span
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: color }}
            />
            {color}
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
