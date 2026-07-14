import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminHeaderProfile } from "@/components/admin/AdminHeaderProfile";
import { cookies } from "next/headers";

export const metadata = {
  title: "Admin Dashboard | InmobiliariaToto",
  description: "Panel de administración y CRM",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "authenticated";

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      
      {/* Contenido Principal */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header Interno */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-slate-800">Panel de Control</h2>
          
          <div className="flex items-center gap-4">
            <AdminHeaderProfile />
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
