"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Workspace {
  id: string;
  name: string;
  type: string;
}

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceType, setNewWorkspaceType] = useState<"PERSONAL" | "SHARED">("PERSONAL");
  const supabase = createClient();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("workspace_members")
      .select(`
        workspace:workspaces (
          id,
          name,
          type
        )
      `)
      .eq("user_id", user.id);

    if (data) {
      const ws = data.map((d: any) => d.workspace as unknown as Workspace).filter(Boolean);
      setWorkspaces(ws);
    }
    setLoading(false);
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: ws, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        name: newWorkspaceName,
        type: newWorkspaceType,
      })
      .select()
      .single();

    if (wsError) {
      console.error("Error creating workspace:", wsError);
      setCreating(false);
      return;
    }

    await supabase.from("workspace_members").insert({
      user_id: user.id,
      workspace_id: ws.id,
      role: "OWNER",
    });

    window.location.href = `/dashboard?workspace=${ws.id}`;
  };

  const selectWorkspace = (workspaceId: string) => {
    window.location.href = `/dashboard?workspace=${workspaceId}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
          background: rgba(19, 19, 22, 0.6);
          backdrop-filter: blur(20px);
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #adc6ff 0%, #004395 100%);
        }
        .bg-gradient-secondary {
          background: linear-gradient(135deg, #c180ff 0%, #590099 100%);
        }
      `}</style>
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full -z-10"></div>

        <header className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-3xl">
                account_balance_wallet
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-100 mb-4">
            Elige tu Workspace
          </h1>
          <p className="text-on-surface-variant max-w-md mx-auto text-lg">
            Selecciona un entorno para gestionar tus finanzas en R$ con precisión editorial.
          </p>
        </header>

        {loading ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-on-surface-variant">Cargando workspaces...</p>
          </div>
        ) : (
          <>
            {workspaces.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => selectWorkspace(workspace.id)}
                    className="group relative flex flex-col text-left p-8 rounded-3xl bg-surface-container-low border border-transparent hover:border-primary/30 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-12">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                        workspace.type === "PERSONAL" 
                          ? "bg-primary-container/20 text-primary"
                          : "bg-secondary-container/20 text-secondary"
                      }`}>
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {workspace.type === "PERSONAL" ? "person" : "group"}
                        </span>
                      </div>
                      <span className={`label-md uppercase tracking-widest font-semibold ${
                        workspace.type === "PERSONAL" ? "text-primary/60" : "text-secondary/60"
                      }`}>
                        {workspace.type === "PERSONAL" ? "Individual" : "Colectivo"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-100 mb-2">{workspace.name}</h2>
                      <p className="text-on-surface-variant text-sm mb-6">
                        {workspace.type === "PERSONAL" 
                          ? "Gestiona tus ahorros, gastos y presupuestos individuales."
                          : "Colabora en tiempo real con otros miembros."}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                        <span>Abrir workspace</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <section className="w-full max-w-2xl">
              <div className="relative p-8 rounded-xl bg-surface-container-highest border border-outline-variant/20 overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">add</span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-100">Crear nuevo Workspace</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="label-md uppercase tracking-widest text-on-surface-variant px-1">
                        Nombre del Workspace
                      </label>
                      <input
                        type="text"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/40 placeholder:text-outline transition-all outline-none"
                        placeholder="Ej. Apartamento 402"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="label-md uppercase tracking-widest text-on-surface-variant px-1">
                        Tipo de Workspace
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setNewWorkspaceType("PERSONAL")}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            newWorkspaceType === "PERSONAL"
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-surface-container-low border-transparent text-on-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined">person</span>
                          <span className="text-xs font-bold">Personal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewWorkspaceType("SHARED")}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            newWorkspaceType === "SHARED"
                              ? "bg-secondary/10 border-secondary/30 text-secondary"
                              : "bg-surface-container-low border-transparent text-on-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined">group</span>
                          <span className="text-xs font-bold">Compartido</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={createWorkspace}
                      disabled={creating || !newWorkspaceName.trim()}
                      className={`w-full py-5 rounded-full font-bold text-lg shadow-lg transition-all ${
                        newWorkspaceType === "PERSONAL"
                          ? "bg-gradient-primary text-on-primary shadow-primary-container/20"
                          : "bg-gradient-secondary text-on-secondary shadow-secondary-container/20"
                      } hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {creating ? "Creando..." : "Crear Workspace"}
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
            </section>
          </>
        )}

        <footer className="mt-12 text-on-surface-variant/40 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="text-xs uppercase tracking-widest font-medium">Encriptación Bancaria</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="text-xs uppercase tracking-widest font-medium">Cerrar Sesión</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
