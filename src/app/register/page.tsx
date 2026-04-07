"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("¡Cuenta creada! Revisa tu email para confirmar tu cuenta.");
      window.location.href = "/login";
    }
    setLoading(false);
  };

  return (
    <body className="min-h-screen flex items-center justify-center p-6 bg-mesh">
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
              person_add
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">
            Crear Cuenta
          </h1>
          <p className="text-on-surface-variant font-medium tracking-tight">
            Únete a Mi Capital y controla tus finanzas
          </p>
        </div>

        <div className="glass-card rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 blur-3xl rounded-full"></div>
          
          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Nombre
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      person
                    </span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

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
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Contraseña
                </label>
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
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
              {!loading && (
                <span className="material-symbols-outlined text-xl">how_to_reg</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant/30 text-center">
            <p className="text-on-surface-variant text-sm">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant/50 text-xs">
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </body>
  );
}
