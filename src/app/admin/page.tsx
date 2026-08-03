"use client";

import { useState, useEffect } from "react";
import { 
  Home, Users, DollarSign, ArrowUpRight, MessageSquare, 
  AlertTriangle, Calendar, FileText, CheckCircle2, ClipboardList,
  MessageCircleQuestion, Clock, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useAdminStore } from "@/stores/adminStore";

interface AlertItem {
  id: string;
  type: "CONTRACT_EXPIRING" | "UNPAID_INVOICE" | "PENDING_RENT" | "ASSIGNED_TASK";
  title: string;
  detail: string;
  slug: string;
  severity: "high" | "medium" | "low";
}

export default function AdminDashboard() {
  const { name } = useAdminStore();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [recentConsultas, setRecentConsultas] = useState<any[]>([]);
  const [consultasFilter, setConsultasFilter] = useState<"ALL" | "PENDING" | "ANSWERED">("ALL");

  const isMarta = name ? name.toLowerCase().includes("marta") : false;
  const currentUsername = isMarta ? "marta" : "admin";

  const [stats, setStats] = useState({
    activeProperties: 3,
    newLeads: 1,
    totalClients: 4,
    monthlySalesUSD: 350000,
  });

  const STATS = [
    { label: "Propiedades Activas", value: `${stats.activeProperties}`, icon: Home, trend: "3 en catálogo" },
    { label: "Leads Nuevos", value: `${stats.newLeads}`, icon: MessageSquare, trend: "Prospectos activos" },
    { label: "Clientes (CRM)", value: `${stats.totalClients}`, icon: Users, trend: "En base de datos" },
    { label: "Ventas Totales (USD)", value: `$${stats.monthlySalesUSD >= 1000 ? (stats.monthlySalesUSD / 1000).toFixed(0) + 'K' : stats.monthlySalesUSD}`, icon: DollarSign, trend: "Operaciones Venta" },
  ];

  const RECENT_LEADS = [
    { id: 1, name: "María Gómez", property: "Casa Moderna en Palermo", date: "Hace 2 horas", status: "Nuevo" },
    { id: 2, name: "Carlos Rodríguez", property: "Depto en Puerto Madero", date: "Hace 5 horas", status: "Contactado" },
    { id: 3, name: "Sofía Etcheverry", property: "Oficina Microcentro", date: "Ayer", status: "Nuevo" },
  ];

  // --- Cargar y calcular alertas y métricas reales ---
  useEffect(() => {
    const fetchUserAlerts = async () => {
      const computedAlerts: AlertItem[] = [];

      // 0. Calcular métricas reales del sistema
      if (typeof window !== "undefined") {
        let clientCount = 4;
        let leadsCount = 1;
        const storedClientKeys = Object.keys(localStorage).filter(k => k.startsWith("client_profile_"));
        if (storedClientKeys.length > 0) {
          clientCount = Math.max(4, storedClientKeys.length);
        }

        let salesTotalUSD = 350000;
        const storedTrx = localStorage.getItem("financial_transactions");
        if (storedTrx) {
          try {
            const trxs = JSON.parse(storedTrx);
            const sales = trxs.filter((t: any) => t.type === "VENTA" && t.status === "COMPLETED" && t.currency === "USD");
            if (sales.length > 0) {
              salesTotalUSD = sales.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
            }
          } catch (e) {}
        }

        setStats({
          activeProperties: 3,
          newLeads: leadsCount,
          totalClients: clientCount,
          monthlySalesUSD: salesTotalUSD,
        });
      }

      // 1. Cargar Tareas Pendientes asignadas al Administrador actual
      try {
        const res = await fetch("/api/admin/tasks");
        if (res.ok) {
          const tasks = await res.json();
          const pendingUserTasks = tasks.filter(
            (t: any) => t.assignedTo === currentUsername && t.status === "PENDING"
          );

          pendingUserTasks.forEach((t: any) => {
            computedAlerts.push({
              id: `task-${t.id}`,
              type: "ASSIGNED_TASK",
              title: `Tarea Asignada Pendiente: ${t.title}`,
              detail: `Prioridad: ${t.priority === 'HIGH' ? 'Alta' : t.priority === 'MEDIUM' ? 'Media' : 'Baja'} (Asignada a ti)`,
              slug: "/admin/tareas",
              severity: t.priority === "HIGH" ? "high" : "medium",
            });
          });
        }
      } catch (err) {
        console.error("Error al cargar tareas para alertas:", err);
      }

      // 1b. Cargar consultas recientes
      try {
        const resC = await fetch("/api/admin/consultas");
        if (resC.ok) {
          const allConsultas = await resC.json();
          setRecentConsultas(allConsultas.slice(0, 5));
          const pendingCount = allConsultas.filter((c: any) => c.status === "PENDING").length;
          if (pendingCount > 0) {
            computedAlerts.push({
              id: "consultas-pending",
              type: "ASSIGNED_TASK",
              title: `${pendingCount} consulta${pendingCount > 1 ? "s" : ""} sin responder`,
              detail: "Preguntas de clientes esperando respuesta desde la web",
              slug: "/admin/consultas",
              severity: pendingCount >= 3 ? "high" : "medium",
            });
          }
        }
      } catch (err) {
        console.error("Error al cargar consultas:", err);
      }

      // 2. Escanear contratos y facturas en localStorage
      if (typeof window !== "undefined") {
        let hasCustomData = false;
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("contract_")) {
            hasCustomData = true;
            const slug = key.replace("contract_", "");
            try {
              const contract = JSON.parse(localStorage.getItem(key) || "");
              if (contract && contract.endDate) {
                const diffTime = new Date(contract.endDate).getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 60 && diffDays > 0) {
                  computedAlerts.push({
                    id: `exp-${slug}`,
                    type: "CONTRACT_EXPIRING",
                    title: `Contrato por vencer en ${diffDays} días`,
                    detail: `Propiedad: ${slug.split("-").join(" ")} (Inquilino: ${contract.clientName})`,
                    slug: `/admin/propiedades/${slug}`,
                    severity: diffDays <= 15 ? "high" : "medium"
                  });
                } else if (diffDays <= 0) {
                  computedAlerts.push({
                    id: `exp-${slug}`,
                    type: "CONTRACT_EXPIRING",
                    title: `Contrato vencido`,
                    detail: `Propiedad: ${slug.split("-").join(" ")} (Venció el: ${contract.endDate})`,
                    slug: `/admin/propiedades/${slug}`,
                    severity: "high"
                  });
                }
              }
            } catch (e) {
              console.error(e);
            }
          }

          if (key.startsWith("files_")) {
            hasCustomData = true;
            const slug = key.replace("files_", "");
            try {
              const files = JSON.parse(localStorage.getItem(key) || "[]");
              files.forEach((file: any) => {
                if (file.status === "IMPAGO") {
                  computedAlerts.push({
                    id: `invoice-${file.id}`,
                    type: "UNPAID_INVOICE",
                    title: `Factura / Expensa pendiente de pago`,
                    detail: `${file.name} (Registrado el ${file.date})`,
                    slug: `/admin/propiedades/${slug}`,
                    severity: "medium"
                  });
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
        });

        if (!hasCustomData && computedAlerts.length === 0) {
          computedAlerts.push({
            id: "mock-1",
            type: "CONTRACT_EXPIRING",
            title: "Contrato por vencer en 34 días",
            detail: "Casa Moderna con Jardín en Palermo (Inquilino: María Gómez)",
            slug: "/admin/propiedades/casa-moderna-en-palermo",
            severity: "medium"
          });
          computedAlerts.push({
            id: "mock-2",
            type: "UNPAID_INVOICE",
            title: "Factura de Expensas pendiente de pago",
            detail: "Boleta_Expensas_Julio.pdf (Casa Palermo)",
            slug: "/admin/propiedades/casa-moderna-en-palermo",
            severity: "medium"
          });
        }
      }

      setAlerts(computedAlerts);
    };

    fetchUserAlerts();
  }, [name]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display mb-2">
          Bienvenido de nuevo, {name || (isMarta ? "Marta" : "Toto")}
        </h1>
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

      {/* Panel de Alertas Críticas (Idea 3) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <AlertTriangle className="text-amber-500 animate-bounce" size={22} />
          <h3 className="font-bold text-lg text-slate-800">Alertas y Vencimientos Críticos</h3>
        </div>

        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl border border-green-100 text-sm font-medium">
            <CheckCircle2 size={18} />
            <span>No hay alertas críticas ni facturas pendientes en este momento. ¡Todo al día!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-shadow hover:shadow-sm ${
                  alert.severity === "high" 
                    ? "bg-red-50/50 border-red-100 text-red-950" 
                    : "bg-amber-50/30 border-amber-100 text-amber-950"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${alert.severity === "high" ? "bg-red-500 animate-ping" : "bg-amber-500"}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {alert.type === "CONTRACT_EXPIRING" ? "Contrato" : alert.type === "UNPAID_INVOICE" ? "Factura Impaga" : "Cobro Alquiler"}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm leading-tight text-slate-800">{alert.title}</h4>
                  <p className="text-xs text-slate-500">{alert.detail}</p>
                </div>
                
                <Link 
                  href={`/admin/propiedades/${alert.slug}`}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0 transition-colors"
                >
                  Gestionar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultas Recientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageCircleQuestion className="text-[#1a365d]" size={22} />
            <h3 className="font-bold text-lg text-slate-800">Consultas Recientes</h3>
            {recentConsultas.filter(c => c.status === "PENDING").length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                {recentConsultas.filter(c => c.status === "PENDING").length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(["ALL", "PENDING", "ANSWERED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setConsultasFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  consultasFilter === f
                    ? "bg-[#1a365d] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "ALL" ? "Todas" : f === "PENDING" ? "Pendientes" : "Respondidas"}
              </button>
            ))}
            <Link href="/admin/consultas" className="text-sm text-[#2b6cb0] hover:underline font-medium ml-2 flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {recentConsultas.length === 0 ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm p-8 justify-center">
            <MessageCircleQuestion size={18} className="text-slate-200" />
            <span>No hay consultas registradas aún.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentConsultas
              .filter(c => consultasFilter === "ALL" || c.status === consultasFilter)
              .slice(0, 5)
              .map((c) => {
                const isPending = c.status === "PENDING";
                return (
                  <div key={c.id} className={`flex items-center justify-between px-6 py-4 gap-4 hover:bg-slate-50/70 transition-colors ${isPending ? "bg-amber-50/20" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isPending ? "bg-amber-400 animate-pulse" : "bg-green-400"}`} />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{c.guestName}</p>
                        <p className="text-xs text-slate-500 truncate">{c.propertyTitle || c.propertyId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-600 truncate max-w-[180px]">{c.message}</p>
                        <p className="text-[11px] text-slate-400">
                          {new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(c.createdAt))}
                        </p>
                      </div>
                      <Link
                        href={`/admin/consultas/${c.id}`}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isPending
                            ? "bg-[#1a365d] text-white hover:bg-[#2b4a7a]"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {isPending ? "Responder" : "Ver"}
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
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
            
            <Link href="/admin/clientes" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#2b6cb0] hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#2b6cb0]/10 text-[#2b6cb0] flex items-center justify-center group-hover:bg-[#2b6cb0] group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Nuevo Cliente</p>
                <p className="text-xs text-slate-500">Registrar en el CRM</p>
              </div>
            </Link>

            <Link href="/admin/finanzas" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#38a169] hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#38a169]/10 text-[#38a169] flex items-center justify-center group-hover:bg-[#38a169] group-hover:text-white transition-colors">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Registrar Operación</p>
                <p className="text-xs text-slate-500">Venta o Alquiler concretado</p>
              </div>
            </Link>

            <Link href="/admin/tareas" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#d69e2e] hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#d69e2e]/10 text-[#d69e2e] flex items-center justify-center group-hover:bg-[#d69e2e] group-hover:text-white transition-colors">
                <ClipboardList size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Nueva Tarea Interna</p>
                <p className="text-xs text-slate-500">Asignar a Marta o Toto</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
