import Image from "next/image";
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Modern House"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a202c]/70 via-[#1a202c]/40 to-[#1a202c]/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center mt-16">
        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium tracking-wider mb-6 border border-white/30 uppercase">
          Excelencia Inmobiliaria
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white tracking-tight mb-6 text-balance max-w-5xl mx-auto drop-shadow-lg">
          Encuentra el lugar donde <br className="hidden md:block" />
          empieza tu <span className="text-[#d69e2e]">nueva historia</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light text-balance">
          Descubre propiedades exclusivas, asesoramiento personalizado y la experiencia más transparente del mercado inmobiliario.
        </p>

        <SearchBar />
      </div>
    </section>
  );
}
