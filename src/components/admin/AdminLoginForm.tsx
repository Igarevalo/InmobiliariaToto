"use client";

import { useState } from "react";
import { KeyRound, ShieldAlert, Building, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminStore } from "@/stores/adminStore";

export function AdminLoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setProfile } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Por favor, ingrese la contraseña.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el perfil en Zustand
        if (data.user) {
          setProfile(data.user.name, data.user.email, data.user.avatar || "");
        }
        // Recargar la página para activar la validación en el Server Component del Layout
        window.location.reload();
      } else {
        setError(data.error || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      setError("Error de red. Intente de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
        
        {/* Brand/Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 bg-[#1a365d] text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Building size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 font-display">InmobiliariaToto</h2>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Panel de Administración</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario / Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Usuario o Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Ej. marta o marta@inmobiliariatoto.com"
                className={`w-full h-11 pl-10 pr-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Contraseña de Acceso</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full h-11 pl-10 pr-10 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Alerta de Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium">
              <ShieldAlert size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl flex items-center justify-center font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer font-sans"
          >
            {isLoading ? "Validando..." : "Ingresar al Panel"}
          </Button>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs text-slate-400 hover:text-[#1a365d] transition-colors font-medium">
            Volver a la página principal
          </a>
        </div>
      </div>
    </div>
  );
}
