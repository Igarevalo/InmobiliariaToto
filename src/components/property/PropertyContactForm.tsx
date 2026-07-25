"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, User, Send } from "lucide-react";

// Número de WhatsApp del dueño de la inmobiliaria
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5492974044525";

export function PropertyContactForm({ propertyId, agentName }: { propertyId: string, agentName: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Hola, me interesa esta propiedad...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Obtener la URL actual de la publicación
    const propertyUrl = typeof window !== "undefined" ? window.location.href : "";

    // Construir el mensaje de WhatsApp
    const whatsappMessage = `Hola! Me interesa la propiedad publicada en este enlace: ${propertyUrl}

Mis datos de contacto:
- Nombre: ${name}
- Email: ${email}
- Teléfono: ${phone}

Mensaje:
${message}`;

    // Codificar mensaje y redireccionar a WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp en pestaña nueva
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} />
        </div>
        <h4 className="text-lg font-bold text-green-800 mb-2 font-display">¡Redirigiendo a WhatsApp!</h4>
        <p className="text-green-700 text-sm">
          Se ha abierto una nueva ventana para iniciar tu conversación de WhatsApp con nosotros.
        </p>
        <Button 
          variant="outline" 
          className="mt-6 w-full"
          onClick={() => {
            setIsSuccess(false);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("Hola, me interesa esta propiedad...");
          }}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
      <h3 className="font-bold text-xl text-[#1a365d] mb-2 font-display">Contactar al Agente</h3>
      <p className="text-sm text-slate-500 mb-6">Completa tus datos y te responderemos por WhatsApp a la brevedad.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <User size={18} />
          </div>
          <Input 
            placeholder="Tu nombre completo" 
            className="pl-10" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Mail size={18} />
          </div>
          <Input 
            type="email" 
            placeholder="Correo electrónico" 
            className="pl-10" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Phone size={18} />
          </div>
          <Input 
            type="tel" 
            placeholder="Teléfono" 
            className="pl-10" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
          />
        </div>

        <textarea
          placeholder="Hola, me interesa esta propiedad..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a365d] min-h-[100px] resize-none"
          required
        ></textarea>

        <Button 
          type="submit" 
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Redirigiendo..." : "Contactar por WhatsApp"}
        </Button>
        <p className="text-xs text-center text-slate-400 mt-4">
          Al enviar aceptas nuestros Términos de Privacidad.
        </p>
      </form>
    </div>
  );
}
