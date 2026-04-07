"use client";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
  category?: { name: string; icon: string; color: string };
  paidBy?: { name: string };
}

export default function TransactionList({ 
  transactions, 
  onRefresh 
}: { 
  transactions: Transaction[]; 
  onRefresh: () => void;
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) return "Hace minutos";
    if (diffHours < 24) return `Hace ${Math.floor(diffHours)} horas`;
    if (diffHours < 48) return "Ayer";
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold tracking-tight">Transacciones Recientes</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
            receipt_long
          </span>
          <p className="text-on-surface-variant mb-4">No hay transacciones todavía</p>
          <p className="text-sm text-on-surface-variant/60">Comienza añadiendo tu primer gasto</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold tracking-tight">Transacciones Recientes</h3>
        <button className="text-sm font-bold text-primary hover:underline">Ver Historial</button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="group flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container-highest shadow-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">
                  {transaction.category?.icon || "payments"}
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface">{transaction.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: `${transaction.category?.color || "#666"}20`,
                      color: transaction.category?.color || "#666"
                    }}
                  >
                    {transaction.category?.name || "Sin categoría"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    {formatDate(transaction.date)} • {transaction.paidBy?.name || "Tú"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black text-lg ${transaction.type === "INCOME" ? "text-primary" : "text-on-surface"}`}>
                {transaction.type === "INCOME" ? "+ " : "- "}
                {formatCurrency(Number(transaction.amount))}
              </p>
              {transaction.type === "EXPENSE" && (
                <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter">
                  Dividido
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}
