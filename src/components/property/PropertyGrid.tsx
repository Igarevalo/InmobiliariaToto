"use client";

import { useState } from "react";
import { useFilterStore } from "@/stores/filterStore";
import { PropertyCard } from "./PropertyCard";
import { SearchX, AlertTriangle, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/Select";

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
  const { operation, type, minPrice, maxPrice, bedrooms, city, setFilter, resetFilters } = useFilterStore();
  const [sortBy, setSortBy] = useState("recent");

  // Validación de filtros contradictorios
  const hasPriceConflict = minPrice !== null && maxPrice !== null && minPrice > maxPrice;

  if (hasPriceConflict) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-amber-50/50 rounded-2xl border border-amber-200 text-center animate-fade-in">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 shadow-sm text-amber-600">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-amber-900 mb-2 font-display">
          Conflicto en rango de precios
        </h3>
        <p className="text-amber-700 max-w-md mb-6 text-sm">
          El precio mínimo seleccionado (<strong className="font-semibold">${minPrice?.toLocaleString()}</strong>) es mayor que el precio máximo (<strong className="font-semibold">${maxPrice?.toLocaleString()}</strong>). Por favor, corrige los valores para continuar.
        </p>
        <button
          onClick={() => {
            setFilter("minPrice", null);
            setFilter("maxPrice", null);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <RefreshCw size={16} />
          Restablecer rango de precios
        </button>
      </div>
    );
  }

  const filteredProperties = MOCK_PROPERTIES.filter((p) => {
    if (operation && p.operation !== operation) return false;
    if (type && p.type !== type) return false;
    if (bedrooms && p.bedrooms < bedrooms) return false;
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice && p.price > maxPrice) return false;
    if (city && city.trim() !== "") {
      const searchStr = city.toLowerCase().trim();
      const matchCity = p.city?.toLowerCase().includes(searchStr);
      const matchProvince = p.province?.toLowerCase().includes(searchStr);
      const matchTitle = p.title?.toLowerCase().includes(searchStr);
      if (!matchCity && !matchProvince && !matchTitle) return false;
    }
    return true;
  });

  // Ordenar propiedades
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    } else if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    // "recent" mantiene el orden por defecto
    return 0;
  });

  if (sortedProperties.length === 0) {
    // Generar tags con los filtros activos para que el usuario entienda qué bloquea los resultados
    const activeFilters: { label: string; value: string }[] = [];
    if (operation) activeFilters.push({ label: "Operación", value: operation === "SALE" ? "Compra" : "Alquiler" });
    if (city) activeFilters.push({ label: "Ubicación", value: `"${city}"` });
    if (type) {
      const typeLabels: Record<string, string> = { HOUSE: "Casa", APARTMENT: "Departamento", COMMERCIAL: "Local Comercial", LAND: "Terreno", OFFICE: "Oficina" };
      activeFilters.push({ label: "Tipo", value: typeLabels[type] || type });
    }
    if (bedrooms) activeFilters.push({ label: "Habitaciones", value: `${bedrooms}+` });
    if (minPrice) activeFilters.push({ label: "Precio Mín", value: `$${minPrice.toLocaleString()}` });
    if (maxPrice) activeFilters.push({ label: "Precio Máx", value: `$${maxPrice.toLocaleString()}` });

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white rounded-2xl border border-slate-100 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
          <SearchX size={28} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-[#1a365d] mb-2 font-display">No hay resultados</h3>
        <p className="text-slate-500 max-w-md mb-6 text-sm">
          No encontramos propiedades que coincidan con los filtros aplicados actualmente.
        </p>

        {activeFilters.length > 0 && (
          <div className="mb-8 w-full max-w-md">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Filtros Activos</p>
            <div className="flex flex-wrap justify-center gap-2">
              {activeFilters.map((filter, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200"
                >
                  <span className="text-slate-400">{filter.label}:</span>
                  <span className="font-semibold">{filter.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a365d] hover:bg-[#2c5282] text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <SlidersHorizontal size={16} />
          Limpiar todos los filtros
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-slate-600 font-medium">
          Mostrando <span className="text-[#1a365d] font-bold">{sortedProperties.length}</span> propiedades
        </p>
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: "recent", label: "Más recientes" },
            { value: "price-asc", label: "Menor precio" },
            { value: "price-desc", label: "Mayor precio" },
          ]}
          placeholder="Ordenar por"
          containerClassName="w-44"
          className="h-10 text-xs font-semibold bg-white border border-slate-200 focus:ring-1 focus:ring-[#1a365d]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedProperties.map((prop) => (
          <PropertyCard key={prop.slug} property={prop} />
        ))}
      </div>
    </div>
  );
}
