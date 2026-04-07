"use client";

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-surface-container-low/90 backdrop-blur-2xl border-t border-outline-variant/30 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center px-4 pb-6 pt-3">
        <a href="#" className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-2xl px-4 py-2 transition-all">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Inicio</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-zinc-300 active:scale-90 transition-all">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Extrato</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-zinc-300 active:scale-90 transition-all">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Grupos</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-zinc-300 active:scale-90 transition-all">
          <span className="material-symbols-outlined">insights</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Análisis</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-2 hover:text-zinc-300 active:scale-90 transition-all">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] uppercase tracking-[0.05em] font-medium mt-1">Perfil</span>
        </a>
      </div>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </nav>
  );
}
