"use client";

interface Workspace {
  id: string;
  name: string;
  type: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  paidBy?: { name: string };
}

export default function SettlementWidget({ 
  transactions, 
  workspace 
}: { 
  transactions: Transaction[]; 
  workspace: Workspace | null;
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const settlements = calculateSettlements(transactions);

  function calculateSettlements(txs: Transaction[]) {
    const balances: Record<string, number> = {};
    
    txs.forEach(tx => {
      if (tx.paidBy?.name) {
        balances[tx.paidBy.name] = (balances[tx.paidBy.name] || 0) + Number(tx.amount);
      }
    });

    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];

    Object.entries(balances).forEach(([name, balance]) => {
      if (balance > 0) {
        creditors.push({ name, amount: balance });
      } else if (balance < 0) {
        debtors.push({ name, amount: Math.abs(balance) });
      }
    });

    const result: { debtor: string; creditor: string; amount: number }[] = [];
    
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].amount, creditors[j].amount);
      if (amount > 0.01) {
        result.push({
          debtor: debtors[i].name,
          creditor: creditors[j].name,
          amount,
        });
      }
      debtors[i].amount -= amount;
      creditors[j].amount -= amount;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    return result;
  }

  if (workspace?.type !== "SHARED") {
    return null;
  }

  return (
    <div className="bg-surface-container-highest rounded-[2rem] p-8 flex flex-col justify-between border border-outline-variant/10 shadow-2xl">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold tracking-tight">Liquidación</h3>
        <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">
          Pendiente
        </span>
      </div>

      {settlements.length === 0 ? (
        <div className="mt-6 text-center py-8">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">
            check_circle
          </span>
          <p className="text-sm text-on-surface-variant">Todo está cuadrado</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {settlements.slice(0, 2).map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error">arrow_upward</span>
                <div>
                  <p className="text-xs font-bold text-on-surface">Debes a {s.creditor}</p>
                </div>
              </div>
              <span className="font-bold text-error">{formatCurrency(s.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <button className="mt-6 w-full py-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-sm font-bold tracking-tight transition-all">
        Ver Detalle
      </button>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}
