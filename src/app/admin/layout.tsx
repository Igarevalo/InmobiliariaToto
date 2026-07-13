import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { User } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | InmobiliariaToto",
  description: "Panel de administración y CRM",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      
      {/* Contenido Principal */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header Interno */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-slate-800">Panel de Control</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">Juan Pérez</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
