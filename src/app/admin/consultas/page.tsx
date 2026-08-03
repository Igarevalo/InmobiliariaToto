"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageCircleQuestion,
  Clock,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowRight,
  ChevronDown,
  User,
  Building2,
  Inbox,
} from "lucide-react";
import Link from "next/link";

type InquiryStatus = "PENDING" | "ANSWERED" | "FOLLOWING_UP";

interface Consulta {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  propertyId: string;
  propertyTitle?: string;
  message: string;
  status: InquiryStatus;
  isPublic: boolean;
  answeredAt?: string;
  answeredBy?: string;
  messages: any[];
  createdAt: string;
}

const STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pendiente", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  ANSWERED: { label: "Respondida", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  FOLLOWING_UP: { label: "En Seguimiento", color: "bg-blue-50 text-blue-700 border-blue-200", icon: RefreshCw },
};

export default function ConsultasAdminPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<InquiryStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== "ALL") params.set("status", activeFilter);
      const res = await fetch(`/api/admin/consultas?${params.toString()}`);
      if (res.ok) {
        setConsultas(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchConsultas(); }, [fetchConsultas]);

  const pendingCount = consultas.filter((c) => c.status === "PENDING").length;

  const filtered = consultas.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.guestName.toLowerCase().includes(q) ||
      c.guestEmail.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q) ||
      (c.propertyTitle || "").toLowerCase().includes(q)
    );
  });

  const FILTERS: { label: string; value: InquiryStatus | "ALL" }[] = [
    { label: "Todas", value: "ALL" },
    { label: "Pendientes", value: "PENDING" },
    { label: "Respondidas", value: "ANSWERED" },
    { label: "En Seguimiento", value: "FOLLOWING_UP" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a365d]/10 text-[#1a365d] flex items-center justify-center">
            <MessageCircleQuestion size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">Consultas de Clientes</h1>
            <p className="text-sm text-slate-500">
              Gestión de preguntas recibidas desde las fichas de propiedades
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
              {pendingCount}
            </span>
          )}
        </div>

        <button
          id="refresh-consultas"
          onClick={fetchConsultas}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={15} />
          Actualizar
        </button>
      </div>

      {/* Filtros + Búsqueda */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              id={`filter-${f.value.toLowerCase()}`}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f.value
                  ? "bg-[#1a365d] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
              {f.value === "PENDING" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-consultas"
            type="text"
            placeholder="Buscar por nombre, email o propiedad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] bg-slate-50"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw size={28} className="animate-spin" />
            <p className="text-sm">Cargando consultas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 flex flex-col items-center gap-3 text-slate-400">
            <Inbox size={40} className="text-slate-200" />
            <p className="text-sm font-medium">No hay consultas para mostrar</p>
            {activeFilter !== "ALL" && (
              <button
                onClick={() => setActiveFilter("ALL")}
                className="text-sm text-[#2b6cb0] hover:underline"
              >
                Ver todas las consultas
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium text-left">Cliente</th>
                  <th className="px-6 py-4 font-medium text-left">Propiedad</th>
                  <th className="px-6 py-4 font-medium text-left">Mensaje</th>
                  <th className="px-6 py-4 font-medium text-left">Fecha</th>
                  <th className="px-6 py-4 font-medium text-left">Estado</th>
                  <th className="px-6 py-4 font-medium text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const { label, color, icon: StatusIcon } = STATUS_CONFIG[c.status];
                  const isPending = c.status === "PENDING";
                  return (
                    <tr
                      key={c.id}
                      className={`transition-colors hover:bg-slate-50/70 ${isPending ? "bg-amber-50/30" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1a365d]/10 text-[#1a365d] flex items-center justify-center shrink-0">
                            <User size={15} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{c.guestName}</p>
                            <p className="text-xs text-slate-500">{c.guestEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Building2 size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {c.propertyTitle || c.propertyId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600 truncate max-w-[200px]" title={c.message}>
                          {c.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {new Intl.DateTimeFormat("es-AR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(c.createdAt))}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
                          <StatusIcon size={12} />
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          id={`view-consulta-${c.id}`}
                          href={`/admin/consultas/${c.id}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            isPending
                              ? "bg-[#1a365d] text-white hover:bg-[#2b4a7a]"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {isPending ? "Responder" : "Ver"}
                          <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
