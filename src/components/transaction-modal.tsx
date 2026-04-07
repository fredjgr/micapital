"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function TransactionModal({ 
  workspaceId, 
  onClose, 
  onSuccess 
}: { 
  workspaceId: string; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, [workspaceId]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("workspace_id", workspaceId);

    if (data && data.length > 0) {
      setCategories(data);
      setCategoryId(data[0].id);
    } else {
      await createDefaultCategories();
    }
  };

  const createDefaultCategories = async () => {
    const defaults = [
      { name: "Alimentación", icon: "restaurant", color: "#61c2ff" },
      { name: "Transporte", icon: "directions_car", color: "#c180ff" },
      { name: "Vivienda", icon: "home", color: "#adc6ff" },
      { name: "Servicios", icon: "wifi", color: "#ec7c8a" },
      { name: "Ocio", icon: "sports_esports", color: "#f59e0b" },
      { name: "Otros", icon: "more_horiz", color: "#acaab1" },
    ];

    const toInsert = defaults.map(cat => ({
      ...cat,
      workspace_id: workspaceId,
      is_default: true,
    }));

    await supabase.from("categories").insert(toInsert);
    loadCategories();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!amount || !description || !categoryId) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("No estás autenticado");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      workspace_id: workspaceId,
      type,
      amount: parseFloat(amount),
      description,
      category_id: categoryId,
      date,
      paid_by_id: user.id,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-surface-container-low rounded-[2rem] p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Nueva Transacción</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`py-4 rounded-xl font-bold transition-all ${
                type === "EXPENSE"
                  ? "bg-error/20 text-error border-2 border-error"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined block text-2xl mb-1">arrow_upward</span>
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`py-4 rounded-xl font-bold transition-all ${
                type === "INCOME"
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined block text-2xl mb-1">arrow_downward</span>
              Ingreso
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Monto (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container-low rounded-xl py-4 pl-12 pr-4 text-on-surface text-2xl font-bold placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-low rounded-xl py-4 px-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all"
              placeholder="Ej: Supermercado Pão de Açúcar"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Categoría
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    categoryId === cat.id
                      ? "bg-surface-container-highest border-2"
                      : "bg-surface-container-low"
                  }`}
                  style={{ 
                    borderColor: categoryId === cat.id ? cat.color : "transparent",
                  }}
                >
                  <span 
                    className="material-symbols-outlined text-xl block mb-1"
                    style={{ color: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-[10px] font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-container-low rounded-xl py-4 px-5 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Transacción"}
          </button>
        </form>
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </div>
    </div>
  );
}
