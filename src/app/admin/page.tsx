import { Home, Users, DollarSign, ArrowUpRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const STATS = [
    { label: "Propiedades Activas", value: "42", icon: Home, trend: "+3 este mes" },
    { label: "Leads Nuevos", value: "18", icon: MessageSquare, trend: "+5 esta semana" },
    { label: "Clientes (CRM)", value: "156", icon: Users, trend: "+12 este mes" },
    { label: "Ventas Mensuales", value: "$450K", icon: DollarSign, trend: "+15% vs mes anterior" },
  ];

  const RECENT_LEADS = [
    { id: 1, name: "María Gómez", property: "Casa Moderna en Palermo", date: "Hace 2 horas", status: "Nuevo" },
    { id: 2, name: "Carlos Rodríguez", property: "Depto en Puerto Madero", date: "Hace 5 horas", status: "Contactado" },
    { id: 3, name: "Sofía Etcheverry", property: "Oficina Microcentro", date: "Ayer", status: "Nuevo" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display mb-2">Bienvenido de nuevo, Juan</h1>
        <p className="text-slate-500">Aquí tienes un resumen del estado de tu inmobiliaria hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1a365d]">
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={14} className="mr-1" />
                {stat.trend.split(' ')[0]}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 font-display mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Leads Recientes</h3>
            <Link href="/admin/leads" className="text-sm text-[#2b6cb0] hover:underline font-medium">
              Ver todos
            </Link>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Propiedad</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_LEADS.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{lead.name}</td>
                    <td className="px-6 py-4 text-slate-600">{lead.property}</td>
                    <td className="px-6 py-4 text-slate-500">{lead.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'Nuevo' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link href="/admin/propiedades/nueva" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#1a365d] hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#1a365d]/10 text-[#1a365d] flex items-center justify-center group-hover:bg-[#1a365d] group-hover:text-white transition-colors">
                <Home size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Nueva Propiedad</p>
                <p className="text-xs text-slate-500">Publicar un nuevo inmueble</p>
              </div>
            </Link>
            
            <Link href="/admin/clientes/nuevo" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#2b6cb0] hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#2b6cb0]/10 text-[#2b6cb0] flex items-center justify-center group-hover:bg-[#2b6cb0] group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Nuevo Cliente</p>
                <p className="text-xs text-slate-500">Registrar en el CRM</p>
              </div>
            </Link>

            <Link href="/admin/finanzas/nueva-operacion" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#38a169] hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#38a169]/10 text-[#38a169] flex items-center justify-center group-hover:bg-[#38a169] group-hover:text-white transition-colors">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Registrar Operación</p>
                <p className="text-xs text-slate-500">Venta o Alquiler concretado</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
