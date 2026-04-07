"use client";

interface Transaction {
  amount: number;
  type: string;
  category?: { name: string; color: string };
}

export default function StatsCards({ transactions }: { transactions: Transaction[] }) {
  const expensesByCategory = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => {
      const cat = t.category?.name || "Otros";
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const total = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5 hover:border-primary/20 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Ingresos del Mes</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "INCOME")
                  .reduce((sum, t) => sum + Number(t.amount), 0)
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5 hover:border-error/20 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error">
            <span className="material-symbols-outlined">trending_down</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Gastos del Mes</p>
            <p className="text-xl font-bold text-error">
              {formatCurrency(
                transactions
                  .filter(t => t.type === "EXPENSE")
                  .reduce((sum, t) => sum + Number(t.amount), 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {sortedCategories.length > 0 && (
        <div className="p-8 bg-gradient-to-br from-secondary/20 to-surface-container-low rounded-3xl border border-secondary/10">
          <h4 className="text-sm font-bold mb-4">Gastos por Categoría</h4>
          <div className="space-y-4">
            {sortedCategories.map(([name, amount]) => {
              const percentage = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{name}</span>
                    <span className="text-on-surface-variant">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}
