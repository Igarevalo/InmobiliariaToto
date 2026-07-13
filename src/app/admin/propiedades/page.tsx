import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPropertiesPage() {
  const PROPERTIES = [
    { id: 1, slug: "casa-moderna-en-palermo", title: "Casa Moderna con Jardín en Palermo", type: "Casa", operation: "Venta", price: "$350,000", status: "Activa", views: 245 },
    { id: 2, slug: "departamento-puerto-madero", title: "Lujoso Departamento con Vista al Río", type: "Depto", operation: "Alquiler", price: "$2,500/mes", status: "Reservada", views: 189 },
    { id: 3, slug: "oficina-microcentro", title: "Oficina Moderna en Microcentro", type: "Oficina", operation: "Alquiler", price: "$1,200/mes", status: "Inactiva", views: 56 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Propiedades</h1>
          <p className="text-sm text-slate-500">Gestiona el catálogo de inmuebles publicados.</p>
        </div>
        <Link href="/admin/propiedades/nueva">
          <Button>
            <Plus size={18} className="mr-2" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por título, ID o ubicación..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d]"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
              <option>Todos los estados</option>
              <option>Activas</option>
              <option>Reservadas</option>
              <option>Inactivas</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Propiedad</th>
                <th className="px-6 py-4 font-medium">Tipo/Oper.</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Vistas</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROPERTIES.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 line-clamp-1">{prop.title}</p>
                    <p className="text-xs text-slate-500 font-mono">ID: #{prop.id.toString().padStart(4, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800">{prop.type}</p>
                    <p className="text-xs text-slate-500">{prop.operation}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{prop.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      prop.status === 'Activa' ? 'bg-green-50 text-green-700' :
                      prop.status === 'Reservada' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{prop.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/propiedades/${prop.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-[#2b6cb0] hover:bg-blue-50 rounded-lg transition-colors" title="Ver en la web">
                        <Eye size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-[#d69e2e] hover:bg-yellow-50 rounded-lg transition-colors" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
          <span>Mostrando 1 a 3 de 3 propiedades</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded border border-slate-200 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
