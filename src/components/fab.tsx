"use client";

export default function AddExpenseFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-14 h-14 rounded-2xl primary-gradient shadow-[0px_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center text-on-primary active:scale-90 transition-all duration-150 z-[100]"
      aria-label="Añadir gasto"
    >
      <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'wght' 600" }}>
        add
      </span>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .primary-gradient {
          background: linear-gradient(135deg, #adc6ff 0%, #004395 100%);
        }
      `}</style>
    </button>
  );
}
