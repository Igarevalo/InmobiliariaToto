import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Building, Shield, Heart, Award, Users, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sobre Nosotros | InmobiliariaToto",
  description: "Conoce nuestra trayectoria, valores y el equipo de profesionales dedicados a encontrar tu hogar ideal.",
};

const VALUES = [
  {
    icon: <Shield className="w-8 h-8 text-[#d69e2e]" />,
    title: "Transparencia Absoluta",
    description: "Creemos en la honestidad total en cada paso de la negociación. Sin comisiones ocultas ni sorpresas de último momento.",
  },
  {
    icon: <Heart className="w-8 h-8 text-[#d69e2e]" />,
    title: "Atención Humana",
    description: "Cada cliente es único. Brindamos asesoramiento personalizado enfocado en entender realmente tus necesidades.",
  },
  {
    icon: <Award className="w-8 h-8 text-[#d69e2e]" />,
    title: "Excelencia Inmobiliaria",
    description: "Buscamos constantemente la más alta calidad en nuestro catálogo y en la formación de nuestros profesionales.",
  },
  {
    icon: <Building className="w-8 h-8 text-[#d69e2e]" />,
    title: "Innovación y Tecnología",
    description: "Utilizamos las mejores herramientas digitales para simplificar las búsquedas y agilizar los trámites.",
  },
];

const TEAM = [
  {
    name: "Carlos 'Toto' Arevalo",
    role: "Fundador & Director General",
    bio: "Más de 20 años de experiencia en el mercado de bienes raíces en Argentina.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mariana Rodríguez",
    role: "Directora de Ventas Residenciales",
    bio: "Especialista en tasación y comercialización de propiedades premium.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Esteban López",
    role: "Asesor Legal e Inmobiliario",
    bio: "Encargado de asegurar que todas las transacciones sean seguras y transparentes.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Header */}
      <div className="bg-[#1a365d] pb-32">
        <Header />
        <div className="container mx-auto px-4 md:px-6 mt-32 text-center text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold tracking-wider mb-4 border border-white/20 uppercase">
            Nuestra Historia
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6 text-balance max-w-4xl mx-auto">
            Quiénes Somos en <span className="text-[#d69e2e]">InmobiliariaToto</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto text-balance font-light">
            Nacimos con el propósito de revolucionar la experiencia de comprar, vender y alquilar propiedades, combinando calidez humana y excelencia técnica.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-16 mb-20 relative z-10 space-y-24">
        {/* Intro Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-bold font-display text-[#1a365d]">
              Un nuevo estándar en el mercado inmobiliario
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En InmobiliariaToto entendemos que buscar un hogar no es solo una transacción financiera, es el inicio de una nueva etapa de vida. Por eso nos enfocamos en ofrecer un servicio donde la confianza, el profesionalismo y el trato humano sean los pilares.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Desde nuestros comienzos, hemos ayudado a cientos de familias a encontrar su espacio ideal. Nos enorgullece ser un equipo multidisciplinar que acompaña a cada cliente desde la primera visita hasta la firma de las escrituras.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/propiedades" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a365d] hover:bg-[#2c5282] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-sm">
                Ver Propiedades
                <ChevronRight size={16} />
              </Link>
              <Link href="/contacto" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all text-sm">
                Hablar con un Asesor
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-72 lg:h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
              alt="Reunión de equipo"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold font-display text-[#1a365d]">
              Valores que guían nuestro camino
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              Nuestra conducta y dedicación diaria se fundamentan en principios sólidos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                  {val.icon}
                </div>
                <h3 className="font-bold text-lg text-[#1a365d] font-display">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold font-display text-[#1a365d]">
              Nuestro Equipo de Profesionales
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              Conoce a los expertos dedicados a brindarte la mejor experiencia inmobiliaria.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl group transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs font-light">{member.bio}</p>
                  </div>
                </div>
                <div className="p-6 text-center space-y-2 flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-xl text-[#1a365d] font-display">{member.name}</h3>
                  <p className="text-[#d69e2e] text-sm font-semibold">{member.role}</p>
                  <p className="text-slate-500 text-xs font-light line-clamp-2 md:line-clamp-none">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
