'use client';

export default function PhysicsDeck({ physics, onChange }) {
  const sliders = [
    { key: 'viscosity', label: 'Viscosity', min: 0, max: 2, step: 0.1 },
    { key: 'blur', label: 'Blur', min: 0, max: 50, step: 1 },
    { key: 'mass', label: 'Mass', min: 0.1, max: 5, step: 0.1 },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl overflow-y-auto">
      <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500">Physics Deck</div>
      <div className="space-y-4">
        {sliders.map(({ key, label, min, max, step }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-white">{label}</label>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={physics[key]}
              onChange={(e) => onChange(key, Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-400">
              {physics[key].toFixed(key === 'viscosity' ? 2 : 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
