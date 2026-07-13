import Image from "next/image";
import { Star } from "lucide-react";

export function Testimonials() {
  const TESTIMONIALS = [
    {
      id: 1,
      name: "Laura Martínez",
      role: "Compradora",
      content: "La experiencia de comprar mi primera casa fue increíblemente fluida. El equipo se encargó de todo el papeleo y me guiaron en cada paso. Totalmente recomendados.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Propietario",
      content: "Vendieron mi departamento en tiempo récord y al mejor precio del mercado. La plataforma para seguir el estado de la venta es muy transparente.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      name: "Sofía Etcheverry",
      role: "Inquilina",
      content: "Encontré el alquiler perfecto en menos de una semana. Los filtros del buscador son súper precisos y el contacto con el agente fue inmediato.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#d69e2e] font-bold tracking-wider uppercase text-sm mb-2 block">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-[#1a365d]">
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-[#d69e2e] text-[#d69e2e]" />
                ))}
              </div>
              <p className="text-slate-600 mb-8 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1a365d]">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
