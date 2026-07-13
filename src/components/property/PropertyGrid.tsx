"use client";

import { useFilterStore } from "@/stores/filterStore";
import { PropertyCard } from "./PropertyCard";
import { SearchX } from "lucide-react";

// Mock data (la misma que en home, idealmente la moveremos a un lugar común o vendrá de DB)
const MOCK_PROPERTIES = [
  {
    slug: "casa-moderna-en-palermo",
    title: "Casa Moderna con Jardín en Palermo",
    price: 350000,
    currency: "USD",
    operation: "SALE" as const,
    type: "HOUSE",
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
    type: "APARTMENT",
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
    type: "HOUSE",
    city: "Pilar",
    province: "Buenos Aires",
    bedrooms: 5,
    bathrooms: 4,
    totalArea: 800,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "oficina-microcentro",
    title: "Oficina Moderna en Microcentro",
    price: 1200,
    currency: "USD",
    operation: "RENT" as const,
    type: "OFFICE",
    city: "Microcentro",
    province: "Buenos Aires",
    bedrooms: 0,
    bathrooms: 2,
    totalArea: 80,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  }
];

export function PropertyGrid() {
  const { operation, type, minPrice, maxPrice, bedrooms } = useFilterStore();

  const filteredProperties = MOCK_PROPERTIES.filter((p) => {
    if (operation && p.operation !== operation) return false;
    if (type && p.type !== type) return false;
    if (bedrooms && p.bedrooms < bedrooms) return false;
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice && p.price > maxPrice) return false;
    return true;
  });

  if (filteredProperties.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-slate-100 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
          <SearchX size={28} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-[#1a365d] mb-2 font-display">No hay resultados</h3>
        <p className="text-slate-500 max-w-sm">
          Intenta ajustar los filtros de búsqueda para encontrar lo que estás buscando.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-slate-600 font-medium">
          Mostrando <span className="text-[#1a365d] font-bold">{filteredProperties.length}</span> propiedades
        </p>
        <select className="p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#1a365d]">
          <option value="recent">Más recientes</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => (
          <PropertyCard key={prop.slug} property={prop} />
        ))}
      </div>
    </div>
  );
}
