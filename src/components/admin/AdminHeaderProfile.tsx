"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import Image from "next/image";
import Link from "next/link";

export function AdminHeaderProfile() {
  const { name, avatar, setProfile } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch actual server profile to keep in sync
    fetch("/api/admin/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setProfile(data.user.name, data.user.email, data.user.avatar || "");
        }
      })
      .catch(err => console.error("Error fetching current admin:", err));
  }, [setProfile]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="text-right">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded mt-1" />
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100" />
      </div>
    );
  }

  // Obtener iniciales
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Link 
      href="/admin/configuracion" 
      className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
      title="Ir a mi perfil / Configuración"
    >
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-slate-700 group-hover:text-[#1a365d] transition-colors">{name}</p>
        <p className="text-xs text-slate-500">Administrador</p>
      </div>
      
      {avatar ? (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#1a365d] text-white border border-[#1a365d] flex items-center justify-center font-bold text-xs shadow-md group-hover:bg-[#2c5282] transition-colors">
          {getInitials(name) || <User size={18} />}
        </div>
      )}
    </Link>
  );
}
