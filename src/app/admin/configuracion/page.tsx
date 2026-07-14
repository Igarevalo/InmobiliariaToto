"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { Button } from "@/components/ui/Button";
import { 
  User, Mail, Image as ImageIcon, KeyRound, 
  CheckCircle2, ShieldAlert, Settings, Eye, EyeOff 
} from "lucide-react";
import Image from "next/image";

export default function AdminConfiguracionPage() {
  const { name, email, avatar, setProfile } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  // Estados locales para el formulario de perfil
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputAvatar, setInputAvatar] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Estados locales para el formulario de contraseña
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInputName(name);
    setInputEmail(email);
    setInputAvatar(avatar);
  }, [name, email, avatar]);

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center p-12 text-slate-500 font-medium">
        Cargando configuración...
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(inputName, inputEmail, inputAvatar);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!newPassword.trim()) {
      setPasswordError("La contraseña no puede estar vacía.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(data.error || "Ocurrió un error al cambiar la contraseña.");
      }
    } catch (err) {
      setPasswordError("Error de red. Intenta nuevamente.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#1a365d] text-white rounded-xl flex items-center justify-center shadow-lg">
          <Settings size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Configuración de Cuenta</h1>
          <p className="text-slate-500 text-sm">Gestiona tus datos de perfil, imagen y contraseñas de administrador.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Previsualización del Perfil (Izquierda) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start">Vista Previa</p>
          
          {inputAvatar ? (
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-100 shadow-md">
              <Image
                src={inputAvatar}
                alt={inputName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#1a365d] text-white border-2 border-white flex items-center justify-center font-bold text-3xl shadow-xl">
              {getInitials(inputName) || <User size={40} />}
            </div>
          )}

          <div>
            <h3 className="font-bold text-lg text-slate-800 font-display">{inputName || "Administrador"}</h3>
            <p className="text-[#d69e2e] text-xs font-semibold uppercase tracking-wider mt-0.5">Administrador</p>
            <p className="text-slate-400 text-xs mt-2 truncate max-w-[200px]">{inputEmail || "sin-correo@toto.com"}</p>
          </div>
        </div>

        {/* Formularios de Configuración (Derecha) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Editar Perfil */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display mb-4 border-b border-slate-50 pb-3">
              Información de Perfil
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="Ej. administrador@inmobiliariatoto.com"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* URL del Avatar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-slate-400" />
                  URL de Imagen de Perfil (Opcional)
                </label>
                <input
                  type="text"
                  value={inputAvatar}
                  onChange={(e) => setInputAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                />
              </div>

              {/* Alerta de Éxito */}
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Perfil guardado exitosamente.</span>
                </div>
              )}

              <Button type="submit" className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl px-5 h-11 font-semibold text-sm cursor-pointer ml-auto flex">
                Guardar Perfil
              </Button>
            </form>
          </div>

          {/* Cambiar Contraseña */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 font-display mb-4 border-b border-slate-50 pb-3">
              Cambiar Contraseña
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nueva Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <KeyRound size={14} className="text-slate-400" />
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full h-11 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <KeyRound size={14} className="text-slate-400" />
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Alertas */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium">
                  <ShieldAlert size={16} className="text-red-500 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Contraseña cambiada exitosamente en el servidor.</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSubmittingPassword}
                className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl px-5 h-11 font-semibold text-sm cursor-pointer ml-auto flex"
              >
                {isSubmittingPassword ? "Guardando..." : "Cambiar Contraseña"}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
