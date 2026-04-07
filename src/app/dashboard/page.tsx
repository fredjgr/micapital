"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/sidebar";
import BottomNav from "@/components/bottom-nav";
import BalanceCard from "@/components/balance-card";
import StatsCards from "@/components/stats-cards";
import TransactionList from "@/components/transaction-list";
import SettlementWidget from "@/components/settlement-widget";
import TransactionModal from "@/components/transaction-modal";
import AddExpenseFab from "@/components/fab";

interface Workspace {
  id: string;
  name: string;
  type: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
  category?: { name: string; icon: string; color: string };
  paidBy?: { name: string };
}

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const loadWorkspace = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) setWorkspace(data);
  }, []);

  const loadTransactions = useCallback(async (workspaceId: string) => {
    const { data } = await supabase
      .from("transactions")
      .select(`
        *,
        category:categories(*),
        paidBy:users(*)
      `)
      .eq("workspace_id", workspaceId)
      .order("date", { ascending: false })
      .limit(10);

    if (data) setTransactions(data);
    setLoading(false);
  }, []);

  const loadFirstWorkspace = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("workspace_members")
      .select("workspace:workspaces(*)")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (data?.workspace) {
      const ws = data.workspace as Workspace;
      setWorkspace(ws);
      loadTransactions(ws.id);
    } else {
      window.location.href = "/workspace";
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const workspaceId = params.get("workspace");

    if (workspaceId) {
      loadWorkspace(workspaceId);
      loadTransactions(workspaceId);
    } else {
      loadFirstWorkspace();
    }
  }, [loadWorkspace, loadTransactions, loadFirstWorkspace]);

  const handleTransactionAdded = () => {
    setShowModal(false);
    if (workspace) {
      loadTransactions(workspace.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar workspace={workspace} onLogout={handleLogout} />
      
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <header className="flex justify-between items-center h-16 px-6 sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
          <div className="flex items-center gap-6">
            <span className="text-lg font-black text-zinc-100 uppercase tracking-widest">
              Gestión de Gastos
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-zinc-100 transition-colors">
              notifications
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/30">
              <div className="w-full h-full bg-primary-container flex items-center justify-center text-xs font-bold text-primary">
                U
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <BalanceCard workspace={workspace} transactions={transactions} />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <StatsCards transactions={transactions} />
              <SettlementWidget transactions={transactions} workspace={workspace} />
            </div>
            
            <div className="xl:col-span-3">
              <TransactionList 
                transactions={transactions} 
                onRefresh={() => workspace && loadTransactions(workspace.id)}
              />
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <AddExpenseFab onClick={() => setShowModal(true)} />
      
      {showModal && (
        <TransactionModal
          workspaceId={workspace?.id || ""}
          onClose={() => setShowModal(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
    </div>
  );
}
