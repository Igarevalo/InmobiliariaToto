import Link from "next/link";
import { Plus, DollarSign, TrendingUp, ArrowDownRight, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FinanzasPage() {
  const METRICS = [
    { label: "Ingresos (Mes)", value: "$45,000", trend: "+12%", isPositive: true },
    { label: "Comisiones Estimadas", value: "$32,500", trend: "+8%", isPositive: true },
    { label: "Operaciones Cerradas", value: "8", trend: "+2", isPositive: true },
    { label: "Cobros Pendientes", value: "$5,200", trend: "-3%", isPositive: false },
  ];

  const RECENT_TRANSACTIONS = [
    { id: "TRX-001", date: "12 Jul 2026", type: "Venta", property: "Casa en San Isidro", amount: "$350,000", commission: "$10,500", status: "Completado" },
    { id: "TRX-002", date: "10 Jul 2026", type: "Alquiler", property: "Depto Puerto Madero", amount: "$2,500", commission: "$2,500", status: "Completado" },
    { id: "TRX-003", date: "05 Jul 2026", type: "Venta", property: "Lote en Nordelta", amount: "$120,000", commission: "$3,600", status: "Pendiente" },
    { id: "TRX-004", date: "01 Jul 2026", type: "Alquiler Temp.", property: "Depto Palermo Soho", amount: "$1,800", commission: "$360", status: "Completado" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Módulo Financiero</h1>
          <p className="text-sm text-slate-500">Control de operaciones, comisiones y reportes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Exportar Reporte
          </Button>
          <Link href="/admin/finanzas/nueva-operacion">
            <Button>
              <Plus size={18} className="mr-2" />
              Registrar Operación
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <p className="text-sm text-slate-500 mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-[#1a365d] font-display">{metric.value}</h3>
              <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${
                metric.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}>
                {metric.isPositive ? <TrendingUp size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Historial de Operaciones */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800">Historial de Operaciones</h3>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none">
              <option>Este mes</option>
              <option>Mes anterior</option>
              <option>Este año</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Fecha</th>
                <th className="px-6 py-4 font-medium">Operación</th>
                <th className="px-6 py-4 font-medium">Propiedad</th>
                <th className="px-6 py-4 font-medium">Monto Total</th>
                <th className="px-6 py-4 font-medium">Comisión (Inmob.)</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECENT_TRANSACTIONS.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 font-mono text-xs">{trx.id}</p>
                    <div className="flex items-center text-slate-500 mt-1">
                      <Calendar size={12} className="mr-1" />
                      <span className="text-xs">{trx.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{trx.property}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{trx.amount}</td>
                  <td className="px-6 py-4 font-bold text-[#38a169]">{trx.commission}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      trx.status === 'Completado' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {trx.status}
                    </span>
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
