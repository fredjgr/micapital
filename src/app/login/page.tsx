"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/workspace";
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <style>{`
        .bg-mesh {
          background-image: 
            radial-gradient(at 0% 0%, rgba(0, 67, 149, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(89, 0, 153, 0.1) 0px, transparent 50%);
        }
        .glass-card {
          background: rgba(37, 37, 43, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(173, 198, 255, 0.1);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-surface-container rounded-full shadow-2xl">
            <span className="material-symbols-outlined text-primary text-4xl">
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">
            Mi Capital - Acceso
          </h1>
          <p className="text-on-surface-variant font-medium tracking-tight">
            Tu control financiero en Reales (R$)
          </p>
        </div>

        <div className="glass-card rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl rounded-full"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      mail
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                    placeholder="nombre@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                    Contraseña
                  </label>
                  <a href="#" className="text-[0.7rem] font-bold text-primary hover:text-primary-dim transition-colors uppercase tracking-wider">
                    ¿Olvidaste la contraseña?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      lock
                    </span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary/40"
              />
              <label htmlFor="remember" className="text-sm text-on-surface-variant">
                Recordar sesión
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Entrar"}
              {!loading && (
                <span className="material-symbols-outlined text-xl">login</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/30 text-center">
            <p className="text-on-surface-variant text-sm">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                Regístrate
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-outline-variant"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
              O accede con
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-outline-variant"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-2 py-4 bg-surface-container-high hover:bg-surface-container-highest rounded-xl transition-colors border border-outline-variant/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-semibold">Google</span>
          </button>
        </div>

        <div className="mt-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8"></div>
          <div className="grid grid-cols-3 gap-4 px-4">
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center flex-col gap-2">
              <span className="material-symbols-outlined text-primary-dim">payments</span>
              <span className="text-[0.6rem] uppercase tracking-tighter text-outline">Pagos Rápidos</span>
            </div>
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center flex-col gap-2">
              <span className="material-symbols-outlined text-secondary-dim">monitoring</span>
              <span className="text-[0.6rem] uppercase tracking-tighter text-outline">Reportes R$</span>
            </div>
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center flex-col gap-2">
              <span className="material-symbols-outlined text-tertiary-dim">shield_with_heart</span>
              <span className="text-[0.6rem] uppercase tracking-tighter text-outline">Privacidad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
