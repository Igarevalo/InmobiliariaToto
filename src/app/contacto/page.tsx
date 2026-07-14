"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      tempErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "El formato de correo no es válido.";
    }
    if (!formData.message.trim()) tempErrors.message = "El mensaje no puede estar vacío.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simular envío de datos
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Header */}
      <div className="bg-[#1a365d] pb-32">
        <Header />
        <div className="container mx-auto px-4 md:px-6 mt-32 text-center text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold tracking-wider mb-4 border border-white/20 uppercase">
            Contacto
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6 text-balance max-w-4xl mx-auto">
            Estamos para <span className="text-[#d69e2e]">ayudarte</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto text-balance font-light">
            ¿Tienes alguna consulta sobre una propiedad o te gustaría que tasemos tu inmueble? Ponte en contacto con nosotros hoy mismo.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-16 mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold font-display text-[#1a365d]">
                Información de contacto
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Elige la forma más cómoda para ti. Responderemos a la brevedad posible.
              </p>
            </div>

            <div className="space-y-6">
              {/* Dirección */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#d69e2e] shrink-0 shadow-inner">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Oficina Central</h4>
                  <p className="text-slate-500 text-sm mt-1">
                    Av. del Libertador 1000, CABA<br />Buenos Aires, Argentina
                  </p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#d69e2e] shrink-0 shadow-inner">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Teléfono</h4>
                  <p className="text-slate-500 text-sm mt-1 hover:text-[#1a365d] transition-colors">
                    <a href="tel:+541143211234">+54 11 4321-1234</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#d69e2e] shrink-0 shadow-inner">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Correo Electrónico</h4>
                  <p className="text-slate-500 text-sm mt-1 hover:text-[#1a365d] transition-colors">
                    <a href="mailto:contacto@inmobiliariatoto.com">contacto@inmobiliariatoto.com</a>
                  </p>
                </div>
              </div>

              {/* Horario */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#d69e2e] shrink-0 shadow-inner">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Horario de Atención</h4>
                  <p className="text-slate-500 text-sm mt-1">
                    Lunes a Viernes: 9:00 - 18:00 hs<br />Sábados: 9:00 - 13:00 hs
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-3">Síguenos en Redes</h4>
              <div className="flex gap-3">
                {["Facebook", "Instagram", "LinkedIn"].map((net, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-[#1a365d] hover:text-[#1a365d] transition-all cursor-pointer"
                  >
                    {net}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-md">
                  <CheckCircle2 size={42} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 font-display">Mensaje enviado con éxito</h3>
                <p className="text-slate-500 max-w-sm text-sm">
                  Gracias por comunicarte con InmobiliariaToto. Uno de nuestros asesores procesará tu solicitud y se pondrá en contacto contigo en breve.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 bg-[#1a365d] hover:bg-[#2c5282]"
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display text-[#1a365d] flex items-center gap-2">
                    <MessageSquare size={22} className="text-[#d69e2e]" />
                    Escríbenos
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Completa el formulario y responderemos a tus dudas lo antes posible.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Juan Pérez"
                      className={`w-full h-11 px-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Teléfono (Opcional)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ej. +54 9 11 9876 5432"
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ej. juan.perez@email.com"
                    className={`w-full h-11 px-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Mensaje */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Mensaje o Consulta</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escribe tu consulta detallada aquí..."
                    rows={5}
                    className={`w-full p-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 resize-none ${errors.message ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-0.5">{errors.message}</p>}
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
