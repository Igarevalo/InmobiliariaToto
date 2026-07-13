"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function NuevaPropiedadPage() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/propiedades" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-[#1a365d] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Nueva Propiedad</h1>
          <p className="text-sm text-slate-500">Completa los datos para publicar un nuevo inmueble.</p>
        </div>
      </div>

      <form className="space-y-8">
        {/* Información Principal */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Información Principal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Título de la Publicación *</label>
              <Input placeholder="Ej: Casa Moderna con Piscina en San Isidro" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Propiedad *</label>
              <select className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]">
                <option value="HOUSE">Casa</option>
                <option value="APARTMENT">Departamento</option>
                <option value="LAND">Terreno</option>
                <option value="COMMERCIAL">Local Comercial</option>
                <option value="OFFICE">Oficina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Operación *</label>
              <select className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]">
                <option value="SALE">Venta</option>
                <option value="RENT">Alquiler</option>
                <option value="TEMP_RENT">Alquiler Temporal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Precio *</label>
              <div className="flex gap-2">
                <select className="w-24 h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]">
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
                <Input type="number" placeholder="Ej: 150000" className="flex-1" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expensas (Opcional)</label>
              <Input type="number" placeholder="Monto de expensas" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descripción Detallada *</label>
              <textarea 
                className="w-full min-h-[150px] p-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] resize-y"
                placeholder="Describe los detalles, el estado, la luminosidad..."
              />
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Ubicación</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Calle y Número *</label>
              <Input placeholder="Ej: Av. del Libertador 1234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Barrio / Localidad *</label>
              <Input placeholder="Ej: Palermo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Provincia / Ciudad *</label>
              <Input placeholder="Ej: CABA" />
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Características Físicas</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Superficie Total (m²)</label>
              <Input type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sup. Cubierta (m²)</label>
              <Input type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dormitorios</label>
              <Input type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Baños</label>
              <Input type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cocheras</label>
              <Input type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Año Construcción</label>
              <Input type="number" />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Imágenes</h3>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#2b6cb0] shadow-sm mb-4">
              <UploadCloud size={28} />
            </div>
            <p className="font-medium text-slate-700 mb-1">Haz clic para subir imágenes o arrástralas aquí</p>
            <p className="text-xs text-slate-500">Formatos soportados: JPG, PNG, WEBP (Max. 5MB por imagen)</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/propiedades">
            <Button variant="ghost" type="button">Cancelar</Button>
          </Link>
          <Button type="button" variant="outline">
            Guardar como Borrador
          </Button>
          <Button type="submit">
            <Save size={18} className="mr-2" />
            Publicar Propiedad
          </Button>
        </div>
      </form>
    </div>
  );
}
