"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, LayoutDashboard, Home, Users, MessageSquare, LogOut, Settings, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Propiedades", href: "/admin/propiedades", icon: Home },
    { name: "Clientes (CRM)", href: "/admin/clientes", icon: Users },
    { name: "Leads", href: "/admin/leads", icon: MessageSquare },
    { name: "Finanzas", href: "/admin/finanzas", icon: DollarSign },
    { name: "Calendario", href: "/admin/calendario", icon: Calendar },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className="w-64 bg-[#1a202c] min-h-screen text-slate-300 flex flex-col fixed left-0 top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Building size={20} className="text-[#d69e2e]" />
          <span className="font-bold font-display tracking-tight">Toto Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm",
                isActive 
                  ? "bg-[#1a365d] text-white" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={18} className={isActive ? "text-[#d69e2e]" : "text-slate-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Nav */}
      <div className="p-4 border-t border-slate-700/50 space-y-1">
        <Link
          href="/admin/configuracion"
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm hover:bg-slate-800 hover:text-white"
        >
          <Settings size={18} className="text-slate-400" />
          Configuración
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm hover:bg-red-500/10 hover:text-red-400 text-slate-300 cursor-pointer text-left"
        >
          <LogOut size={18} className="text-slate-400" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
