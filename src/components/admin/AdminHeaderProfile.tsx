"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAdminStore } from "@/stores/adminStore";
import Image from "next/image";

export function AdminHeaderProfile() {
  const { name, avatar } = useAdminStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-slate-700">{name}</p>
        <p className="text-xs text-slate-500">Administrador</p>
      </div>
      
      {avatar ? (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#1a365d] text-white border border-[#1a365d] flex items-center justify-center font-bold text-xs shadow-md">
          {getInitials(name) || <User size={18} />}
        </div>
      )}
    </div>
  );
}
