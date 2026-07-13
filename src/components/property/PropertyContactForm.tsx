"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, User, Send } from "lucide-react";

export function PropertyContactForm({ propertyId, agentName }: { propertyId: string, agentName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío a API (Aquí conectaremos con Server Action para crear Lead)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} />
        </div>
        <h4 className="text-lg font-bold text-green-800 mb-2 font-display">¡Mensaje enviado!</h4>
        <p className="text-green-700 text-sm">
          {agentName} se pondrá en contacto contigo a la brevedad.
        </p>
        <Button 
          variant="outline" 
          className="mt-6 w-full"
          onClick={() => setIsSuccess(false)}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
      <h3 className="font-bold text-xl text-[#1a365d] mb-2 font-display">Contactar al Agente</h3>
      <p className="text-sm text-slate-500 mb-6">Completa tus datos y {agentName} te responderá lo antes posible.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <User size={18} />
          </div>
          <Input placeholder="Tu nombre completo" className="pl-10" required />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Mail size={18} />
          </div>
          <Input type="email" placeholder="Correo electrónico" className="pl-10" required />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Phone size={18} />
          </div>
          <Input type="tel" placeholder="Teléfono" className="pl-10" required />
        </div>

        <textarea
          placeholder="Hola, me interesa esta propiedad..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a365d] min-h-[100px] resize-none"
          required
        ></textarea>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </Button>
        <p className="text-xs text-center text-slate-400 mt-4">
          Al enviar aceptas nuestros Términos de Privacidad.
        </p>
      </form>
    </div>
  );
}
