"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { publishProperty } from "./actions";

export default function NuevaPropiedadPage() {
  const router = useRouter();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    title: "",
    type: "HOUSE",
    operation: "SALE",
    currency: "USD",
    price: "",
    expenses: "",
    description: "",
    address: "",
    city: "",
    province: "",
    bedrooms: "",
    bathrooms: "",
    totalArea: "",
    coveredArea: "",
  });

  // State for loaded media files
  const [mediaFiles, setMediaFiles] = useState<{ file: File; url: string; type: "image" | "video" }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (filesList: FileList | null) => {
    if (!filesList) return;
    setErrorMsg(null);
    const newFiles = Array.from(filesList);
    const validFiles: typeof mediaFiles = [];

    newFiles.forEach((file) => {
      // Validate file size: 20MB in bytes = 20 * 1024 * 1024
      if (file.size > 20 * 1024 * 1024) {
        setErrorMsg("Uno o más archivos superan el límite de 20MB.");
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type === "video/mp4";

      if (!isImage && !isVideo) {
        setErrorMsg("Solo se admiten fotos y videos en formato MP4.");
        return;
      }

      validFiles.push({
        file,
        url: URL.createObjectURL(file),
        type: isImage ? "image" : "video",
      });
    });

    if (validFiles.length > 0) {
      setMediaFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url); // Clean memory URL
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const submitData = new FormData();
      // Append text inputs
      Object.entries(formData).forEach(([key, val]) => {
        submitData.append(key, val);
      });
      // Append files
      mediaFiles.forEach((fileObj) => {
        submitData.append("media", fileObj.file);
      });

      const res = await publishProperty(submitData);
      if (res.success) {
        router.push("/admin/propiedades");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Error al publicar la propiedad.");
      }
    } catch (err: any) {
      setErrorMsg("Ocurrió un error inesperado al enviar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Información Principal */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Información Principal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Título de la Publicación *</label>
              <Input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Casa Moderna con Piscina en San Isidro" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Propiedad *</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
              >
                <option value="HOUSE">Casa</option>
                <option value="APARTMENT">Departamento</option>
                <option value="LAND">Terreno</option>
                <option value="COMMERCIAL">Local Comercial</option>
                <option value="OFFICE">Oficina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Operación *</label>
              <select 
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
              >
                <option value="SALE">Venta</option>
                <option value="RENT">Alquiler</option>
                <option value="TEMP_RENT">Alquiler Temporal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Precio *</label>
              <div className="flex gap-2">
                <select 
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-24 h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
                <Input 
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ej: 150000" 
                  className="flex-1" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expensas (Opcional)</label>
              <Input 
                name="expenses"
                type="number"
                value={formData.expenses}
                onChange={handleChange}
                placeholder="Monto de expensas" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descripción Detallada *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full min-h-[150px] p-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] resize-y"
                placeholder="Describe los detalles, el estado, la luminosidad..."
                required
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
              <Input 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Av. del Libertador 1234" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Barrio / Localidad *</label>
              <Input 
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ej: Palermo" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Provincia / Ciudad *</label>
              <Input 
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="Ej: CABA" 
                required
              />
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Características Físicas</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Superficie Total (m²)</label>
              <Input 
                name="totalArea"
                type="number" 
                value={formData.totalArea}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sup. Cubierta (m²)</label>
              <Input 
                name="coveredArea"
                type="number" 
                value={formData.coveredArea}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dormitorios</label>
              <Input 
                name="bedrooms"
                type="number" 
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Baños</label>
              <Input 
                name="bathrooms"
                type="number" 
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#1a365d] mb-6 border-b border-slate-100 pb-2">Imágenes y Videos</h3>
          
          <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 hover:border-[#1a365d]/50 transition-all cursor-pointer text-center group">
            <input 
              type="file" 
              multiple 
              accept="image/*,video/mp4" 
              className="hidden" 
              onChange={(e) => handleFileChange(e.target.files)} 
            />
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2b6cb0] shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
              <UploadCloud size={26} />
            </div>
            <p className="font-semibold text-slate-800 text-sm mb-1">Haz clic para subir imágenes o arrástralas aquí</p>
            <p className="text-xs text-slate-500">Formatos soportados: Imágenes (JPG, PNG, WEBP) y Videos (MP4) (Máx. 20MB por archivo)</p>
          </label>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-sm text-red-500 font-medium mt-3 bg-red-50 p-3 rounded-xl border border-red-100">
              {errorMsg}
            </p>
          )}

          {/* Previews Grid */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
              {mediaFiles.map((fileObj, idx) => (
                <div key={idx} className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 group shadow-sm hover:shadow-md transition-shadow">
                  {fileObj.type === "video" ? (
                    <video src={fileObj.url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img src={fileObj.url} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                  )}
                  {/* Indicator for video */}
                  {fileObj.type === "video" && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Video (MP4)
                    </div>
                  )}
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Eliminar archivo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/propiedades">
            <Button variant="ghost" type="button" disabled={isSubmitting}>Cancelar</Button>
          </Link>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Guardar como Borrador
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Publicar Propiedad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
