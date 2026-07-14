"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFilterStore } from "@/stores/filterStore";
import { Select } from "@/components/ui/Select";

export function SearchBar() {
  const router = useRouter();
  const { setFilter } = useFilterStore();
  
  const [operation, setOperation] = useState<"SALE" | "RENT">("SALE");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Actualizar store global
    setFilter("operation", operation);
    setFilter("city", city);
    setFilter("type", type);
    setFilter("maxPrice", maxPrice ? Number(maxPrice) : null);
    
    // Crear parámetros para la URL
    const params = new URLSearchParams();
    params.set("operation", operation);
    if (city.trim()) params.set("city", city.trim());
    if (type) params.set("type", type);
    if (maxPrice) params.set("maxPrice", maxPrice);
    
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 glassmorphism rounded-2xl p-2 md:p-4 shadow-2xl animate-fade-in-up">
      {/* Tabs Operación */}
      <div className="flex gap-2 mb-4 px-2">
        <button
          onClick={() => setOperation("SALE")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            operation === "SALE"
              ? "bg-[#1a365d] text-white shadow-md"
              : "bg-white/50 text-slate-700 hover:bg-white"
          }`}
        >
          Comprar
        </button>
        <button
          onClick={() => setOperation("RENT")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            operation === "RENT"
              ? "bg-[#1a365d] text-white shadow-md"
              : "bg-white/50 text-slate-700 hover:bg-white"
          }`}
        >
          Alquilar
        </button>
      </div>

      {/* Buscador Fields */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Ubicación */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 z-10">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ciudad, barrio o zona..."
            className="w-full h-12 pl-10 pr-4 rounded-xl border-none bg-white focus:ring-2 focus:ring-[#1a365d] text-slate-800"
          />
        </div>

        {/* Tipo de Propiedad */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 z-10">
            <Home size={18} />
          </div>
          <Select
            value={type}
            onChange={setType}
            options={[
              { value: "HOUSE", label: "Casa" },
              { value: "APARTMENT", label: "Departamento" },
              { value: "LAND", label: "Terreno" },
              { value: "COMMERCIAL", label: "Local Comercial" },
            ]}
            placeholder="Tipo de Propiedad"
            className="pl-10 border-none focus:ring-2 focus:ring-[#1a365d] bg-white h-12 rounded-xl"
          />
        </div>

        {/* Precio Máximo */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 z-10">
            <DollarSign size={18} />
          </div>
          <Select
            value={maxPrice}
            onChange={setMaxPrice}
            options={[
              { value: "50000", label: "Hasta $50.000" },
              { value: "100000", label: "Hasta $100.000" },
              { value: "250000", label: "Hasta $250.000" },
              { value: "500000", label: "Hasta $500.000" },
              { value: "1000000", label: "Hasta $1.000.000" },
            ]}
            placeholder="Precio Máximo"
            className="pl-10 border-none focus:ring-2 focus:ring-[#1a365d] bg-white h-12 rounded-xl"
          />
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="h-12 w-full md:w-auto px-8 rounded-xl shrink-0">
          <Search size={18} className="mr-2" />
          Buscar
        </Button>
      </form>
    </div>
  );
}
