"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, User, Send, MessageCircleQuestion, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

// Número de WhatsApp del dueño de la inmobiliaria
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5492974044525";

type TabMode = "whatsapp" | "consulta";

interface Props {
  propertyId: string;
  agentName: string;
  propertyTitle?: string;
}

export function PropertyContactForm({ propertyId, agentName, propertyTitle }: Props) {
  const [activeTab, setActiveTab] = useState<TabMode>("whatsapp");

  // WhatsApp state
  const [waName, setWaName] = useState("");
  const [waEmail, setWaEmail] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("Hola, me interesa esta propiedad...");
  const [waSuccess, setWaSuccess] = useState(false);
  const [waSubmitting, setWaSubmitting] = useState(false);

  // Consulta state
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cMessage, setCMessage] = useState("");
  const [cStatus, setCStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [cError, setCError] = useState("");

  // ── WhatsApp Handler ──────────────────────────────────────────────────────
  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setWaSubmitting(true);
    const propertyUrl = typeof window !== "undefined" ? window.location.href : "";
    const whatsappMessage = `Hola! Me interesa la propiedad publicada en este enlace: ${propertyUrl}\n\nMis datos de contacto:\n- Nombre: ${waName}\n- Email: ${waEmail}\n- Teléfono: ${waPhone}\n\nMensaje:\n${waMessage}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    setWaSubmitting(false);
    setWaSuccess(true);
  };

  // ── Consulta Handler ──────────────────────────────────────────────────────
  const handleConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    setCStatus("submitting");
    setCError("");

    try {
      const propertyUrl = typeof window !== "undefined" ? window.location.href : "";
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cName,
          email: cEmail,
          phone: cPhone,
          message: cMessage,
          propertyId,
          propertyTitle: propertyTitle || propertyId,
          propertyUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCError(data.error || "Ocurrió un error al enviar tu consulta.");
        setCStatus("error");
        return;
      }
      setCStatus("success");
    } catch {
      setCError("No se pudo conectar con el servidor. Intenta de nuevo.");
      setCStatus("error");
    }
  };

  // ── Success States ────────────────────────────────────────────────────────
  if (waSuccess) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} />
          </div>
          <h4 className="text-lg font-bold text-green-800 mb-2 font-display">¡Redirigiendo a WhatsApp!</h4>
          <p className="text-green-700 text-sm">Se ha abierto una nueva ventana para iniciar tu conversación de WhatsApp con nosotros.</p>
          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => { setWaSuccess(false); setWaName(""); setWaEmail(""); setWaPhone(""); setWaMessage("Hola, me interesa esta propiedad..."); }}
          >
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-24 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          id="tab-whatsapp"
          onClick={() => setActiveTab("whatsapp")}
          className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "whatsapp"
              ? "bg-[#25D366]/10 text-[#075E54] border-b-2 border-[#25D366]"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Send size={15} />
          WhatsApp
        </button>
        <button
          id="tab-consulta"
          onClick={() => setActiveTab("consulta")}
          className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "consulta"
              ? "bg-[#1a365d]/10 text-[#1a365d] border-b-2 border-[#1a365d]"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <MessageCircleQuestion size={15} />
          Hacer Consulta
        </button>
      </div>

      <div className="p-6">
        {/* ── WhatsApp Tab ── */}
        {activeTab === "whatsapp" && (
          <>
            <h3 className="font-bold text-xl text-[#1a365d] mb-2 font-display">Contactar al Agente</h3>
            <p className="text-sm text-slate-500 mb-6">Completa tus datos y te responderemos por WhatsApp a la brevedad.</p>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <Input placeholder="Tu nombre completo" className="pl-10" value={waName} onChange={(e) => setWaName(e.target.value)} required />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <Input type="email" placeholder="Correo electrónico" className="pl-10" value={waEmail} onChange={(e) => setWaEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <Input type="tel" placeholder="Teléfono" className="pl-10" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} required />
              </div>
              <textarea
                placeholder="Hola, me interesa esta propiedad..."
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a365d] min-h-[100px] resize-none"
                required
              />
              <Button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold transition-colors"
                disabled={waSubmitting}
              >
                {waSubmitting ? "Redirigiendo..." : "Contactar por WhatsApp"}
              </Button>
              <p className="text-xs text-center text-slate-400 mt-4">Al enviar aceptas nuestros Términos de Privacidad.</p>
            </form>
          </>
        )}

        {/* ── Consulta Tab ── */}
        {activeTab === "consulta" && (
          <>
            <h3 className="font-bold text-xl text-[#1a365d] mb-2 font-display">Hacer una Consulta</h3>
            <p className="text-sm text-slate-500 mb-6">Tu pregunta quedará registrada y te responderemos a la brevedad por email.</p>

            {cStatus === "success" ? (
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-lg font-bold text-green-800 mb-2 font-display">¡Consulta enviada!</h4>
                <p className="text-green-700 text-sm mb-4">
                  Recibimos tu pregunta. Un agente te responderá pronto a <strong>{cEmail}</strong>.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setCStatus("idle"); setCName(""); setCEmail(""); setCPhone(""); setCMessage(""); }}
                >
                  Enviar otra consulta
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConsulta} className="space-y-4" id="consulta-form">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <Input
                    id="consulta-name"
                    placeholder="Tu nombre completo"
                    className="pl-10"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    required
                    disabled={cStatus === "submitting"}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="consulta-email"
                    type="email"
                    placeholder="Correo electrónico"
                    className="pl-10"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    required
                    disabled={cStatus === "submitting"}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={18} />
                  </div>
                  <Input
                    id="consulta-phone"
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    className="pl-10"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    disabled={cStatus === "submitting"}
                  />
                </div>
                <textarea
                  id="consulta-message"
                  placeholder="¿Cuál es tu pregunta sobre esta propiedad?"
                  value={cMessage}
                  onChange={(e) => setCMessage(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a365d] min-h-[110px] resize-none disabled:opacity-50"
                  required
                  disabled={cStatus === "submitting"}
                />

                {cStatus === "error" && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">
                    <AlertCircle size={16} className="shrink-0" />
                    {cError}
                  </div>
                )}

                <Button
                  id="consulta-submit"
                  type="submit"
                  className="w-full bg-[#1a365d] hover:bg-[#2b4a7a] text-white font-semibold transition-colors"
                  disabled={cStatus === "submitting"}
                >
                  {cStatus === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando consulta...
                    </span>
                  ) : (
                    "Enviar Consulta"
                  )}
                </Button>
                <p className="text-xs text-center text-slate-400">Al enviar aceptas nuestros Términos de Privacidad.</p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
