export default function LiquidToast({ message = 'Operation successful' }) {
  return (
    <div className="liquid-toast rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white shadow-glass">
      {message}
    </div>
  );
}
