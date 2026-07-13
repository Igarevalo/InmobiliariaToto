"use client";

import { useState } from "react";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SearchBar() {
  const [operation, setOperation] = useState<"SALE" | "RENT">("SALE");

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
      <form className="flex flex-col md:flex-row gap-3">
        {/* Ubicación */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <MapPin size={18} />
          </div>
          <input
            type="text"
            placeholder="Ciudad, barrio o zona..."
            className="w-full h-12 pl-10 pr-4 rounded-xl border-none bg-white focus:ring-2 focus:ring-[#1a365d] text-slate-800"
          />
        </div>

        {/* Tipo de Propiedad */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Home size={18} />
          </div>
          <select className="w-full h-12 pl-10 pr-4 rounded-xl border-none bg-white focus:ring-2 focus:ring-[#1a365d] text-slate-800 appearance-none">
            <option value="">Tipo de Propiedad</option>
            <option value="HOUSE">Casa</option>
            <option value="APARTMENT">Departamento</option>
            <option value="LAND">Terreno</option>
            <option value="COMMERCIAL">Local Comercial</option>
          </select>
        </div>

        {/* Precio Máximo */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <DollarSign size={18} />
          </div>
          <select className="w-full h-12 pl-10 pr-4 rounded-xl border-none bg-white focus:ring-2 focus:ring-[#1a365d] text-slate-800 appearance-none">
            <option value="">Precio Máximo</option>
            <option value="50000">Hasta $50.000</option>
            <option value="100000">Hasta $100.000</option>
            <option value="250000">Hasta $250.000</option>
            <option value="500000">Hasta $500.000</option>
            <option value="1000000">Hasta $1.000.000</option>
          </select>
        </div>

        {/* Submit */}
        <Button size="lg" className="h-12 w-full md:w-auto px-8 rounded-xl shrink-0">
          <Search size={18} className="mr-2" />
          Buscar
        </Button>
      </form>
    </div>
  );
}
