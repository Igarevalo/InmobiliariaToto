import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertyGrid } from "@/components/property/PropertyGrid";

export const metadata = {
  title: "Catálogo de Propiedades | InmobiliariaToto",
  description: "Explora nuestra selección exclusiva de casas, departamentos y terrenos en venta y alquiler.",
};

export default function PropiedadesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-[#1a365d] pb-24">
        <Header />
        <div className="container mx-auto px-4 md:px-6 mt-32 text-white">
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4 text-balance">
            Encuentra tu propiedad ideal
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl text-balance">
            Filtra por ubicación, precio y tipo de propiedad para descubrir opciones que se ajusten a tus necesidades.
          </p>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-12 mb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <PropertyFilters />
          <PropertyGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
