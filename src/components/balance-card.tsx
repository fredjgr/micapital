"use client";

interface Workspace {
  id: string;
  name: string;
  type: string;
}

interface Transaction {
  amount: number;
  type: string;
}

export default function BalanceCard({ workspace, transactions }: { workspace: Workspace | null; transactions: Transaction[] }) {
  const isShared = workspace?.type === "SHARED";
  const isPersonal = workspace?.type === "PERSONAL";

  const totalIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between min-h-[240px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <span className="material-symbols-outlined text-8xl scale-150 rotate-12" style={{ fontVariationSettings: "'FILL' 0, 'wght' 100, 'GRAD' 0, 'opsz' 24" }}>
            account_balance
          </span>
        </div>
        
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest mb-2 block ${
            isShared ? "text-secondary" : "text-primary"
          }`}>
            {isShared ? "Saldo Total Compartido" : "Tu Saldo Personal"}
          </span>
          <h2 className="text-5xl font-black tracking-tighter text-on-surface leading-tight">
            <span className="text-on-surface-variant text-3xl font-light">R$</span>{" "}
            {formatCurrency(balance).replace("R$", "").trim()}
          </h2>
        </div>
        
        {isShared && (
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-on-surface-variant font-medium">
              3 miembros activos en <span className="text-secondary">{workspace?.name || "Workspace"}</span>
            </p>
          </div>
        )}
      </div>

      <div className="bg-surface-container-highest rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/10 shadow-2xl">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold tracking-tight">Resumen</h3>
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">arrow_downward</span>
              <div>
                <p className="text-xs font-bold text-on-surface">Ingresos</p>
              </div>
            </div>
            <span className="font-bold text-primary">{formatCurrency(totalIncome)}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error">arrow_upward</span>
              <div>
                <p className="text-xs font-bold text-on-surface">Gastos</p>
              </div>
            </div>
            <span className="font-bold text-error">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
        
        <button className="mt-6 w-full py-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-sm font-bold tracking-tight transition-all">
          Ver Reportes
        </button>
      </div>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </section>
  );
}
