"use client";

interface Workspace {
  id: string;
  name: string;
  type: string;
}

export default function Sidebar({ workspace, onLogout }: { workspace: Workspace | null; onLogout: () => void }) {
  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full bg-zinc-950/60 backdrop-blur-xl border-r border-zinc-800/50 shadow-2xl shadow-black/40 z-[60]">
      <div className="p-8">
        <h1 className="text-xl font-bold tracking-tighter text-zinc-100">Mi Capital</h1>
        {workspace && (
          <p className="text-sm text-zinc-500 truncate">{workspace.name}</p>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 font-semibold border-r-2 border-blue-500 bg-blue-500/10">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm">Dashboard</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-sm">Transacciones</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors">
          <span className="material-symbols-outlined">payments</span>
          <span className="text-sm">Presupuestos</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors">
          <span className="material-symbols-outlined">group</span>
          <span className="text-sm">Miembros</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Configuración</span>
        </a>
      </nav>
      
      <div className="p-6 mt-auto border-t border-zinc-800/50 space-y-4">
        <button 
          onClick={() => window.location.href = '/workspace'}
          className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Añadir Gasto
        </button>
        <div className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <span className="material-symbols-outlined">help</span>
            <span className="text-xs uppercase tracking-wider font-medium">Ayuda</span>
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-xs uppercase tracking-wider font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
      
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </aside>
  );
}
