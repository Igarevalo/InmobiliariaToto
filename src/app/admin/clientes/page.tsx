import Link from "next/link";
import { Plus, Search, Mail, Phone, Edit, MoreVertical, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminClientesPage() {
  const CLIENTS = [
    { id: "CLI-001", name: "María Gómez", email: "maria.gomez@example.com", phone: "+54 11 1234-5678", type: "Propietario", status: "Ganado", lastContact: "Hace 2 días" },
    { id: "CLI-002", name: "Carlos Rodríguez", email: "carlos.r@gmail.com", phone: "+54 11 8765-4321", type: "Comprador", status: "Calificado", lastContact: "Hoy" },
    { id: "CLI-003", name: "Sofía Etcheverry", email: "sofia.e@hotmail.com", phone: "+54 11 5555-4444", type: "Inquilino", status: "Propuesta", lastContact: "Hace 1 semana" },
    { id: "CLI-004", name: "Juan Ignacio", email: "juan.ig@empresa.com", phone: "-", type: "Lead", status: "Nuevo", lastContact: "Ayer" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Clientes (CRM)</h1>
          <p className="text-sm text-slate-500">Gestiona tus prospectos, compradores y propietarios.</p>
        </div>
        <Link href="/admin/clientes/nuevo">
          <Button>
            <Plus size={18} className="mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Tarjetas de Resumen CRM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total Clientes</p>
          <p className="text-2xl font-bold text-[#1a365d]">156</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Nuevos Leads (Mes)</p>
          <p className="text-2xl font-bold text-blue-600">42</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">En Negociación</p>
          <p className="text-2xl font-bold text-amber-600">18</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Cerrados (Mes)</p>
          <p className="text-2xl font-bold text-green-600">7</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o teléfono..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d]"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
              <option>Tipo: Todos</option>
              <option>Propietario</option>
              <option>Comprador</option>
              <option>Inquilino</option>
              <option>Lead</option>
            </select>
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
              <option>Estado: Todos</option>
              <option>Nuevo</option>
              <option>Contactado</option>
              <option>Calificado</option>
              <option>Ganado</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Últ. Interacción</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CLIENTS.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{client.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{client.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-slate-600">
                      {client.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-slate-400" />
                          <span className="text-xs">{client.email}</span>
                        </div>
                      )}
                      {client.phone && client.phone !== "-" && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-xs">{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      client.status === 'Nuevo' ? 'bg-blue-50 text-blue-700' :
                      client.status === 'Calificado' ? 'bg-indigo-50 text-indigo-700' :
                      client.status === 'Propuesta' ? 'bg-amber-50 text-amber-700' :
                      client.status === 'Ganado' ? 'bg-green-50 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{client.lastContact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-[#2b6cb0] hover:bg-blue-50 rounded-lg transition-colors" title="Añadir interacción">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-[#d69e2e] hover:bg-yellow-50 rounded-lg transition-colors" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Más opciones">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
