"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  ArrowLeft,
  User,
  Building2,
  Clock,
  CheckCircle2,
  RefreshCw,
  Send,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useAdminStore } from "@/stores/adminStore";

type InquiryStatus = "PENDING" | "ANSWERED" | "FOLLOWING_UP";

interface Message {
  id: string;
  sender: "CLIENT" | "AGENT";
  senderName: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

interface Consulta {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  propertyId: string;
  propertyTitle?: string;
  propertyUrl?: string;
  message: string;
  status: InquiryStatus;
  isPublic: boolean;
  answeredAt?: string;
  answeredBy?: string;
  messages: Message[];
  createdAt: string;
}

const STATUS_LABELS: Record<InquiryStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "text-amber-700 bg-amber-50 border-amber-200" },
  ANSWERED: { label: "Respondida", color: "text-green-700 bg-green-50 border-green-200" },
  FOLLOWING_UP: { label: "En Seguimiento", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export default function ConsultaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { name: adminName } = useAdminStore();

  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [reply, setReply] = useState("");
  const [replyPublic, setReplyPublic] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [newStatus, setNewStatus] = useState<InquiryStatus>("ANSWERED");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const fetchConsulta = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/consultas?status=`);
      if (res.ok) {
        const all: Consulta[] = await res.json();
        const found = all.find((c) => c.id === id);
        if (found) {
          setConsulta(found);
          setNewStatus(found.status === "PENDING" ? "ANSWERED" : found.status);
        } else {
          setNotFound(true);
        }
      }
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchConsulta(); }, [fetchConsulta]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitState("submitting");
    setSubmitError("");

    try {
      const res = await fetch(`/api/admin/consultas/${id}/responder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: reply.trim(),
          isPublic: replyPublic,
          sendNotification,
          newStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Error al enviar la respuesta.");
        setSubmitState("error");
        return;
      }
      setConsulta(data.consulta);
      setReply("");
      setSubmitState("success");
      setTimeout(() => setSubmitState("idle"), 3000);
    } catch {
      setSubmitError("No se pudo conectar con el servidor.");
      setSubmitState("error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400 gap-3">
        <RefreshCw size={22} className="animate-spin" />
        <span>Cargando consulta...</span>
      </div>
    );
  }

  if (notFound || !consulta) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <AlertCircle size={40} className="text-slate-300" />
        <p className="font-medium">Consulta no encontrada</p>
        <Link href="/admin/consultas" className="text-sm text-[#2b6cb0] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Volver a la lista
        </Link>
      </div>
    );
  }

  const { label, color } = STATUS_LABELS[consulta.status];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/admin/consultas"
          id="back-to-consultas"
          className="mt-1 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl font-bold text-slate-800 font-display">Consulta de {consulta.guestName}</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
              {label}
            </span>
            {consulta.isPublic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Eye size={11} /> Pública
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Recibida el{" "}
            {new Intl.DateTimeFormat("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(consulta.createdAt))}
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cliente */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <User size={14} /> Datos del Cliente
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-slate-800">{consulta.guestName}</p>
            <p className="text-sm text-slate-600">{consulta.guestEmail}</p>
            {consulta.guestPhone && (
              <p className="text-sm text-slate-600">{consulta.guestPhone}</p>
            )}
          </div>
        </div>
        {/* Propiedad */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Building2 size={14} /> Propiedad Consultada
          </div>
          <p className="font-bold text-slate-800">{consulta.propertyTitle || consulta.propertyId}</p>
          {consulta.propertyUrl && (
            <a
              href={consulta.propertyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#2b6cb0] hover:underline mt-1 block truncate"
            >
              Ver ficha pública ↗
            </a>
          )}
        </div>
      </div>

      {/* Hilo de Mensajes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <MessageCircle size={18} className="text-[#1a365d]" />
          <h2 className="font-bold text-slate-800">Hilo de Conversación</h2>
          <span className="ml-auto text-xs text-slate-400 font-medium">
            {consulta.messages.length} mensaje{consulta.messages.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-6 space-y-4">
          {consulta.messages.map((msg) => {
            const isAgent = msg.sender === "AGENT";
            return (
              <div
                key={msg.id}
                className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] ${isAgent ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isAgent ? "text-[#1a365d]" : "text-slate-500"}`}>
                      {isAgent ? (msg.senderName || "Agente") : msg.senderName}
                    </span>
                    {msg.isPublic && (
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                        <Eye size={9} /> Pública
                      </span>
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isAgent
                        ? "bg-[#1a365d] text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Intl.DateTimeFormat("es-AR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(msg.createdAt))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulario de Respuesta */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Send size={18} className="text-[#1a365d]" />
          <h2 className="font-bold text-slate-800">Escribir Respuesta</h2>
        </div>

        <form onSubmit={handleReply} id="reply-form" className="p-6 space-y-4">
          <textarea
            id="reply-message"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            rows={4}
            required
            disabled={submitState === "submitting"}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] resize-none disabled:opacity-50 transition-all"
          />

          {/* Opciones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Estado destino */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                Estado tras responder
              </label>
              <select
                id="new-status-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as InquiryStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d]"
              >
                <option value="ANSWERED">Respondida</option>
                <option value="FOLLOWING_UP">En Seguimiento</option>
                <option value="PENDING">Mantener Pendiente</option>
              </select>
            </div>

            {/* Visibilidad pública */}
            <div className="flex items-start gap-3 sm:items-center">
              <button
                type="button"
                id="toggle-public"
                onClick={() => setReplyPublic(!replyPublic)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors w-full ${
                  replyPublic
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {replyPublic ? <Eye size={15} /> : <EyeOff size={15} />}
                {replyPublic ? "Respuesta Pública" : "Respuesta Privada"}
              </button>
            </div>

            {/* Notificar cliente */}
            <div>
              <button
                type="button"
                id="toggle-notification"
                onClick={() => setSendNotification(!sendNotification)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors w-full ${
                  sendNotification
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {sendNotification ? <Bell size={15} /> : <BellOff size={15} />}
                {sendNotification ? "Notificar Cliente" : "Sin Notificación"}
              </button>
            </div>
          </div>

          {sendNotification && (
            <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              📬 La notificación al cliente está <strong>simulada</strong> (log en servidor). Se integrará con email/webhook en la próxima etapa.
            </p>
          )}

          {submitState === "error" && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} className="shrink-0" />
              {submitError}
            </div>
          )}

          {submitState === "success" && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-100">
              <CheckCircle2 size={16} className="shrink-0" />
              Respuesta enviada exitosamente.
            </div>
          )}

          <div className="flex justify-end">
            <button
              id="submit-reply"
              type="submit"
              disabled={submitState === "submitting" || !reply.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1a365d] text-white text-sm font-bold rounded-xl hover:bg-[#2b4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitState === "submitting" ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Enviar Respuesta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
