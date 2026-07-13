import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedProperties() {
  // Datos mockeados para la Landing Page hasta que conectemos con DB
  const MOCK_PROPERTIES = [
    {
      slug: "casa-moderna-en-palermo",
      title: "Casa Moderna con Jardín en Palermo",
      price: 350000,
      currency: "USD",
      operation: "SALE" as const,
      city: "Capital Federal",
      province: "Buenos Aires",
      bedrooms: 4,
      bathrooms: 3,
      totalArea: 400,
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "departamento-puerto-madero",
      title: "Lujoso Departamento con Vista al Río",
      price: 2500,
      currency: "USD",
      operation: "RENT" as const,
      city: "Puerto Madero",
      province: "Buenos Aires",
      bedrooms: 2,
      bathrooms: 2,
      totalArea: 120,
      imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "casa-country-pilar",
      title: "Residencia Premium en Country Club",
      price: 850000,
      currency: "USD",
      operation: "SALE" as const,
      city: "Pilar",
      province: "Buenos Aires",
      bedrooms: 5,
      bathrooms: 4,
      totalArea: 800,
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <span className="text-[#d69e2e] font-bold tracking-wider uppercase text-sm mb-2 block">Propiedades Destacadas</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#1a365d]">
              Encuentra tu próximo hogar
            </h2>
            <p className="text-slate-500 mt-4 text-lg text-balance">
              Hemos seleccionado las mejores propiedades del mercado para ti. Descubre espacios diseñados para vivir experiencias únicas.
            </p>
          </div>
          <Link href="/propiedades" className="hidden md:block">
            <Button variant="outline" className="group">
              Ver todas
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROPERTIES.map((prop) => (
            <PropertyCard key={prop.slug} property={prop} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/propiedades">
            <Button variant="outline" className="w-full">
              Ver todas las propiedades
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
