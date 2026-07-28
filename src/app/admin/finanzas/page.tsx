"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, DollarSign, TrendingUp, ArrowDownRight, Download, Calendar, 
  Search, Filter, Printer, FileText, CheckCircle2, X, Eye, 
  ArrowUpRight, Tag, User, Home, PieChart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";

interface FinancialTransaction {
  id: string;
  date: string;
  type: "VENTA" | "ALQUILER" | "ALQUILER_TEMP" | "EXPENSAS" | "MANTENIMIENTO";
  propertySlug?: string;
  propertyTitle: string;
  clientName: string;
  amount: number;
  commission: number;
  currency: "USD" | "ARS";
  status: "COMPLETED" | "PENDING";
  notes?: string;
}

const PROPERTIES = [
  { slug: "casa-moderna-en-palermo", title: "Casa Moderna con Jardín en Palermo" },
  { slug: "departamento-puerto-madero", title: "Lujoso Departamento con Vista al Río" },
  { slug: "oficina-microcentro", title: "Oficina Moderna en Microcentro" },
];

const CLIENTS = [
  "María Gómez",
  "Carlos Rodríguez",
  "Sofía Etcheverry",
  "Juan Ignacio",
];

const TYPE_CONFIG = {
  VENTA: { label: "Venta", color: "bg-purple-50 text-purple-700 border-purple-200" },
  ALQUILER: { label: "Alquiler Mensual", color: "bg-blue-50 text-blue-700 border-blue-200" },
  ALQUILER_TEMP: { label: "Alquiler Temporario", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  EXPENSAS: { label: "Servicios / Expensas", color: "bg-amber-50 text-amber-700 border-amber-200" },
  MANTENIMIENTO: { label: "Mantenimiento", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function FinanzasPage() {
  const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
    { id: "TRX-001", date: "2026-07-12", type: "VENTA", propertySlug: "casa-moderna-en-palermo", propertyTitle: "Casa Moderna con Jardín en Palermo", clientName: "Carlos Rodríguez", amount: 350000, commission: 10500, currency: "USD", status: "COMPLETED", notes: "Comisión del 3% acordada sobre la venta del inmueble." },
    { id: "TRX-002", date: "2026-07-10", type: "ALQUILER", propertySlug: "departamento-puerto-madero", propertyTitle: "Lujoso Departamento con Vista al Río", clientName: "María Gómez", amount: 2500, commission: 2500, currency: "USD", status: "COMPLETED", notes: "Cobro del primer mes de alquiler y comisión inicial." },
    { id: "TRX-003", date: "2026-07-05", type: "VENTA", propertySlug: "oficina-microcentro", propertyTitle: "Oficina Moderna en Microcentro", clientName: "Juan Ignacio", amount: 120000, commission: 3600, currency: "USD", status: "PENDING", notes: "Pendiente de firma de escritura pública en escribanía." },
    { id: "TRX-004", date: "2026-07-01", type: "ALQUILER_TEMP", propertySlug: "casa-moderna-en-palermo", propertyTitle: "Casa Moderna con Jardín en Palermo", clientName: "Sofía Etcheverry", amount: 1800, commission: 360, currency: "USD", status: "COMPLETED", notes: "Alquiler temporario por quincena." },
    { id: "TRX-005", date: "2026-06-25", type: "EXPENSAS", propertySlug: "oficina-microcentro", propertyTitle: "Oficina Moderna en Microcentro", clientName: "María Gómez", amount: 450, commission: 0, currency: "USD", status: "COMPLETED", notes: "Liquidación de expensas extraordinarias." },
  ];

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("TODOS");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("TODOS");
  const [selectedCurrencyFilter, setSelectedCurrencyFilter] = useState("TODOS");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("TODOS");

  // Estado Modal Crear Operación
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newType, setNewType] = useState<FinancialTransaction["type"]>("ALQUILER");
  const [newPropertySlug, setNewPropertySlug] = useState("");
  const [newClientName, setNewClientName] = useState(CLIENTS[0]);
  const [newAmount, setNewAmount] = useState("");
  const [newCommission, setNewCommission] = useState("");
  const [newCurrency, setNewCurrency] = useState<"USD" | "ARS">("USD");
  const [newStatus, setNewStatus] = useState<"COMPLETED" | "PENDING">("COMPLETED");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newNotes, setNewNotes] = useState("");

  // Estado Modal Recibo / Comprobante
  const [receiptTransaction, setReceiptTransaction] = useState<FinancialTransaction | null>(null);

  // Cargar de localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("financial_transactions");
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    }
  }, []);

  // Guardar en localStorage
  const saveTransactions = (updated: FinancialTransaction[]) => {
    setTransactions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("financial_transactions", JSON.stringify(updated));
    }
  };

  // Manejar creación
  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || parseFloat(newAmount) <= 0) return;

    const propertyObj = PROPERTIES.find(p => p.slug === newPropertySlug);
    const newTrx: FinancialTransaction = {
      id: `TRX-${String(transactions.length + 1).padStart(3, "0")}`,
      date: newDate || new Date().toISOString().split("T")[0],
      type: newType,
      propertySlug: newPropertySlug || undefined,
      propertyTitle: propertyObj ? propertyObj.title : "Operación General",
      clientName: newClientName,
      amount: parseFloat(newAmount),
      commission: parseFloat(newCommission) || 0,
      currency: newCurrency,
      status: newStatus,
      notes: newNotes.trim(),
    };

    const updated = [newTrx, ...transactions];
    saveTransactions(updated);

    // Resetear formulario
    setNewAmount("");
    setNewCommission("");
    setNewNotes("");
    setIsCreateOpen(false);
  };

  // Filtrado de transacciones
  const filteredTransactions = transactions.filter((trx) => {
    const matchesSearch = 
      trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedTypeFilter === "TODOS" || trx.type === selectedTypeFilter;
    const matchesCurrency = selectedCurrencyFilter === "TODOS" || trx.currency === selectedCurrencyFilter;
    const matchesStatus = selectedStatusFilter === "TODOS" || trx.status === selectedStatusFilter;

    // Período
    let matchesPeriod = true;
    const trxDate = new Date(trx.date);
    const now = new Date();
    if (selectedPeriod === "ESTE_MES") {
      matchesPeriod = trxDate.getMonth() === now.getMonth() && trxDate.getFullYear() === now.getFullYear();
    } else if (selectedPeriod === "MES_ANTERIOR") {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      matchesPeriod = trxDate.getMonth() === prevMonth.getMonth() && trxDate.getFullYear() === prevMonth.getFullYear();
    } else if (selectedPeriod === "ESTE_ANO") {
      matchesPeriod = trxDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesType && matchesCurrency && matchesStatus && matchesPeriod;
  });

  // Métricas Calculadas
  const totalVolumeUSD = filteredTransactions
    .filter(t => t.currency === "USD" && t.status === "COMPLETED")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalCommissionsUSD = filteredTransactions
    .filter(t => t.currency === "USD" && t.status === "COMPLETED")
    .reduce((acc, t) => acc + t.commission, 0);

  const pendingUSD = filteredTransactions
    .filter(t => t.currency === "USD" && t.status === "PENDING")
    .reduce((acc, t) => acc + t.amount, 0);

  const completedCount = filteredTransactions.filter(t => t.status === "COMPLETED").length;

  // Exportar Reporte en JSON/CSV
  const handleExportCSV = () => {
    const headers = "ID,Fecha,Tipo,Propiedad,Cliente,Monto,Moneda,Comisión,Estado,Notas\n";
    const rows = filteredTransactions.map(t => 
      `"${t.id}","${t.date}","${TYPE_CONFIG[t.type].label}","${t.propertyTitle}","${t.clientName}",${t.amount},"${t.currency}",${t.commission},"${t.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}","${t.notes || ''}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_financiero_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Módulo Financiero y Caja</h1>
          <p className="text-sm text-slate-500">Control de transacciones, comisiones de la inmobiliaria y emisión de comprobantes.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCSV} className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-xl font-semibold text-sm h-11 px-4 cursor-pointer">
            <Download size={18} className="mr-2 text-slate-500" />
            Exportar Reporte
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl flex items-center gap-2 h-11 px-5 font-semibold text-sm cursor-pointer shadow-md shadow-[#1a365d]/10">
            <Plus size={18} />
            Registrar Operación
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Volumen Procesado (USD)</span>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-[#1a365d] font-display">${totalVolumeUSD.toLocaleString()}</h3>
            <span className="flex items-center text-xs font-bold px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50">
              <TrendingUp size={14} className="mr-1" /> +12%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Comisiones Inmobiliaria</span>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-emerald-600 font-display">${totalCommissionsUSD.toLocaleString()}</h3>
            <span className="flex items-center text-xs font-bold px-2 py-1 rounded-lg text-emerald-700 bg-emerald-50">
              <TrendingUp size={14} className="mr-1" /> +8%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cobros Pendientes</span>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-amber-600 font-display">${pendingUSD.toLocaleString()}</h3>
            <span className="flex items-center text-xs font-bold px-2 py-1 rounded-lg text-amber-700 bg-amber-50">
              <ArrowDownRight size={14} className="mr-1" /> En Espera
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Operaciones Completadas</span>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-blue-600 font-display">{completedCount}</h3>
            <span className="flex items-center text-xs font-bold px-2 py-1 rounded-lg text-blue-700 bg-blue-50">
              <Tag size={14} className="mr-1" /> {filteredTransactions.length} Totales
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Filtros y Lista */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Barra de Filtros */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full lg:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ID, inmueble o cliente..." 
              className="w-full pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
            {/* Filtro Período */}
            <Select
              value={selectedPeriod}
              onChange={(val) => setSelectedPeriod(val)}
              className="h-11 text-xs bg-white"
              options={[
                { value: "TODOS", label: "Período: Todos" },
                { value: "ESTE_MES", label: "Este Mes" },
                { value: "MES_ANTERIOR", label: "Mes Anterior" },
                { value: "ESTE_ANO", label: "Este Año" },
              ]}
            />

            {/* Filtro Tipo */}
            <Select
              value={selectedTypeFilter}
              onChange={(val) => setSelectedTypeFilter(val)}
              className="h-11 text-xs bg-white"
              options={[
                { value: "TODOS", label: "Tipo: Todos" },
                { value: "VENTA", label: "Venta" },
                { value: "ALQUILER", label: "Alquiler Mensual" },
                { value: "ALQUILER_TEMP", label: "Alquiler Temporario" },
                { value: "EXPENSAS", label: "Servicios/Expensas" },
                { value: "MANTENIMIENTO", label: "Mantenimiento" },
              ]}
            />

            {/* Filtro Moneda */}
            <Select
              value={selectedCurrencyFilter}
              onChange={(val) => setSelectedCurrencyFilter(val)}
              className="h-11 text-xs bg-white"
              options={[
                { value: "TODOS", label: "Moneda: Todas" },
                { value: "USD", label: "USD ($)" },
                { value: "ARS", label: "ARS ($)" },
              ]}
            />

            {/* Filtro Estado */}
            <Select
              value={selectedStatusFilter}
              onChange={(val) => setSelectedStatusFilter(val)}
              className="h-11 text-xs bg-white"
              options={[
                { value: "TODOS", label: "Estado: Todos" },
                { value: "COMPLETED", label: "Completados" },
                { value: "PENDING", label: "Pendientes" },
              ]}
            />
          </div>
        </div>

        {/* Tabla de Transacciones */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">ID / Fecha</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Propiedad / Cliente</th>
                <th className="px-6 py-4 font-semibold">Monto Total</th>
                <th className="px-6 py-4 font-semibold">Comisión</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No se encontraron transacciones financieras registradas con estos filtros.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 font-mono text-xs">{trx.id}</p>
                      <div className="flex items-center text-slate-400 mt-0.5">
                        <Calendar size={12} className="mr-1" />
                        <span className="text-xs">{trx.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${TYPE_CONFIG[trx.type].color}`}>
                        {TYPE_CONFIG[trx.type].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {trx.propertySlug ? (
                        <Link 
                          href={`/admin/propiedades/${trx.propertySlug}`}
                          className="font-semibold text-slate-800 hover:text-[#1a365d] transition-colors block line-clamp-1"
                        >
                          {trx.propertyTitle}
                        </Link>
                      ) : (
                        <p className="font-semibold text-slate-800 line-clamp-1">{trx.propertyTitle}</p>
                      )}
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <User size={12} className="text-slate-400" /> {trx.clientName}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {trx.currency} ${trx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {trx.commission > 0 ? `${trx.currency} $${trx.commission.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        trx.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      }`}>
                        {trx.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setReceiptTransaction(trx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                        title="Ver Comprobante Oficial"
                      >
                        <Printer size={14} className="text-slate-500" />
                        <span>Recibo</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR OPERACIÓN */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-visible">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 font-display">Registrar Nueva Operación Financiera</h2>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Tipo de Operación */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Tipo de Operación</label>
                  <Select
                    value={newType}
                    onChange={(val) => setNewType(val as any)}
                    className="h-11 text-xs"
                    options={[
                      { value: "VENTA", label: "Venta" },
                      { value: "ALQUILER", label: "Alquiler Mensual" },
                      { value: "ALQUILER_TEMP", label: "Alquiler Temporario" },
                      { value: "EXPENSAS", label: "Servicios / Expensas" },
                      { value: "MANTENIMIENTO", label: "Mantenimiento" },
                    ]}
                  />
                </div>

                {/* Fecha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Fecha de Operación</label>
                  <DatePicker 
                    value={newDate}
                    onChange={(val) => setNewDate(val)}
                  />
                </div>
              </div>

              {/* Propiedad Vinculada */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Propiedad Vinculada (Opcional)</label>
                <Select
                  value={newPropertySlug}
                  onChange={(val) => setNewPropertySlug(val)}
                  className="h-11 text-xs"
                  placeholder="Operación General"
                  options={[
                    { value: "", label: "Sin Inmueble (Operación General)" },
                    ...PROPERTIES.map(p => ({ value: p.slug, label: p.title }))
                  ]}
                />
              </div>

              {/* Cliente Vinculado */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Cliente / Contraparte</label>
                <Select
                  value={newClientName}
                  onChange={(val) => setNewClientName(val)}
                  className="h-11 text-xs"
                  options={CLIENTS.map(c => ({ value: c, label: c }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Moneda */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Moneda</label>
                  <Select
                    value={newCurrency}
                    onChange={(val) => setNewCurrency(val as any)}
                    className="h-11 text-xs font-bold"
                    options={[
                      { value: "USD", label: "USD ($)" },
                      { value: "ARS", label: "ARS ($)" },
                    ]}
                  />
                </div>

                {/* Monto Total */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Monto Total</label>
                  <Input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Ej. 1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Comisión Inmobiliaria */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Comisión Inmobiliaria</label>
                  <Input
                    type="number"
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
                    placeholder="Ej. 300"
                  />
                </div>

                {/* Estado de Pago */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Estado de Pago</label>
                  <Select
                    value={newStatus}
                    onChange={(val) => setNewStatus(val as any)}
                    className="h-11 text-xs"
                    options={[
                      { value: "COMPLETED", label: "🟢 Completado" },
                      { value: "PENDING", label: "🟡 Pendiente" },
                    ]}
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Observaciones o Notas</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Detalles sobre el pago, transferencia o acuerdo de la comisión..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  Registrar Operación
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COMPROBANTE / RECIBO IMPRIMIBLE */}
      {receiptTransaction && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            
            {/* Header Comprobante */}
            <div className="bg-[#1a365d] text-white p-6 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Inmobiliaria Toto - Comprobante de Caja</span>
                <h2 className="text-xl font-bold font-display mt-0.5">Recibo Oficial #{receiptTransaction.id}</h2>
                <p className="text-xs text-blue-100 mt-1">Pico Truncado, Santa Cruz</p>
              </div>
              <button 
                onClick={() => setReceiptTransaction(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Recibo */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Fecha de Emisión</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{receiptTransaction.date}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Estado del Pago</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{receiptTransaction.status === "COMPLETED" ? "PAGADO / COMPLETADO" : "PENDIENTE DE PAGO"}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Cliente / Contraparte</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{receiptTransaction.clientName}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Tipo de Operación</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{TYPE_CONFIG[receiptTransaction.type].label}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Inmueble Vinculado</span>
                <p className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {receiptTransaction.propertyTitle}
                </p>
              </div>

              <div className="border-t border-b border-slate-100 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Monto Total Operación:</span>
                  <span className="font-bold text-slate-800">{receiptTransaction.currency} ${receiptTransaction.amount.toLocaleString()}</span>
                </div>
                {receiptTransaction.commission > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Honorarios / Comisión Inmobiliaria:</span>
                    <span className="font-bold text-emerald-600">{receiptTransaction.currency} ${receiptTransaction.commission.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {receiptTransaction.notes && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Observaciones</span>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{receiptTransaction.notes}"
                  </p>
                </div>
              )}

              {/* Botones del Modal */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => window.print()}
                  className="w-1/2 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl h-11 font-semibold text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer size={18} />
                  Imprimir Recibo
                </Button>
                <Button
                  onClick={() => setReceiptTransaction(null)}
                  className="w-1/2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
