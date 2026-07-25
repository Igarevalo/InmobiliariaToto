"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFilterStore } from "@/stores/filterStore";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export function PropertyFilters() {
  const { operation, type, minPrice, maxPrice, bedrooms, city, setFilter, resetFilters } = useFilterStore();
  const searchParams = useSearchParams();

  // Sincronizar parámetros de la URL con el store de filtros
  useEffect(() => {
    const op = searchParams.get("operation");
    const ct = searchParams.get("city");
    const ty = searchParams.get("type");
    const mx = searchParams.get("maxPrice");

    if (op !== null) setFilter("operation", op);
    if (ct !== null) setFilter("city", ct);
    if (ty !== null) setFilter("type", ty);
    if (mx !== null) setFilter("maxPrice", mx ? Number(mx) : null);
  }, [searchParams, setFilter]);

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 self-start sticky top-24">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-lg font-display text-[#1a365d]">Filtros</h3>
        <button 
          onClick={resetFilters}
          className="text-sm text-slate-500 hover:text-[#d69e2e] transition-colors"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-6">
        {/* Ubicación */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Ubicación</h4>
          <input 
            type="text" 
            placeholder="Zona o barrio..." 
            value={city || ''}
            onChange={(e) => setFilter('city', e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a365d] text-slate-800"
          />
        </div>

        {/* Operación */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Operación</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('operation', 'SALE')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${operation === 'SALE' ? 'bg-[#1a365d] border-[#1a365d] text-white' : 'border-slate-200 text-slate-600 hover:border-[#1a365d]'}`}
            >
              Comprar
            </button>
            <button 
              onClick={() => setFilter('operation', 'RENT')}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${operation === 'RENT' ? 'bg-[#1a365d] border-[#1a365d] text-white' : 'border-slate-200 text-slate-600 hover:border-[#1a365d]'}`}
            >
              Alquilar
            </button>
          </div>
        </div>

        {/* Tipo */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Tipo de Propiedad</h4>
          <Select 
            value={type}
            onChange={(val) => setFilter('type', val)}
            options={[
              { value: "", label: "Todos los tipos" },
              { value: "HOUSE", label: "Casa" },
              { value: "APARTMENT", label: "Departamento" },
              { value: "COMMERCIAL", label: "Local Comercial" },
              { value: "LAND", label: "Terreno" },
            ]}
            placeholder="Todos los tipos"
            className="h-10 text-sm bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-[#1a365d]"
          />
        </div>

        {/* Habitaciones */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Habitaciones</h4>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setFilter('bedrooms', num === bedrooms ? null : num)}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${bedrooms === num ? 'bg-[#1a365d] border-[#1a365d] text-white' : 'border-slate-200 text-slate-600 hover:border-[#1a365d]'}`}
              >
                {num}{num === 5 && '+'}
              </button>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Rango de Precio (USD)</h4>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Mínimo" 
              value={minPrice || ''}
              onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-[#1a365d]"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="number" 
              placeholder="Máximo" 
              value={maxPrice || ''}
              onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-[#1a365d]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
