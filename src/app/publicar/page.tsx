"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { 
  Building, UploadCloud, Info, MapPin, 
  SlidersHorizontal, CheckCircle2, ChevronRight, ChevronLeft, Image as ImageIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicarPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Estados del formulario
  const [operation, setOperation] = useState("SALE");
  const [propertyType, setPropertyType] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("General");
  const [province, setProvince] = useState("General");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const tempErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!title.trim()) tempErrors.title = "El título es obligatorio.";
      if (!propertyType) tempErrors.propertyType = "El tipo de propiedad es obligatorio.";
      if (!price.trim()) tempErrors.price = "El precio es obligatorio.";
    } else if (currentStep === 2) {
      if (!address.trim()) tempErrors.address = "La dirección aproximada o zona es obligatoria.";
    } else if (currentStep === 3) {
      if (!area.trim()) tempErrors.area = "La superficie es obligatoria.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Simular arrastrar y soltar archivos
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simular carga de archivos
    setUploadedFiles(["propiedad_frontal.jpg", "sala_de_estar.jpg", "cocina_equipada.jpg"]);
  };

  const simulateUpload = () => {
    setUploadedFiles(["propiedad_frontal.jpg", "sala_de_estar.jpg", "cocina_equipada.jpg"]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Header */}
      <div className="bg-[#1a365d] pb-32">
        <Header />
        <div className="container mx-auto px-4 md:px-6 mt-32 text-center text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold tracking-wider mb-4 border border-white/20 uppercase">
            Propietarios
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6 text-balance max-w-4xl mx-auto">
            Publica tu propiedad de forma <span className="text-[#d69e2e]">simple</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto text-balance font-light font-sans">
            Llega a miles de compradores y arrendatarios potenciales con nuestra plataforma optimizada.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-16 mb-20 relative z-10 max-w-3xl">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-100">
          
          {isSuccess ? (
            /* Pantalla de Éxito */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-md">
                <CheckCircle2 size={42} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 font-display">¡Propiedad Recibida con Éxito!</h3>
              <p className="text-slate-500 max-w-md text-sm leading-relaxed">
                Tu publicación ha sido enviada a revisión. En un plazo máximo de 24 horas hábiles, nuestro equipo validará la información y tu propiedad estará activa en nuestro catálogo general.
              </p>
              <Button 
                onClick={() => {
                  setIsSuccess(false);
                  setStep(1);
                  setTitle("");
                  setPrice("");
                  setAddress("");
                  setCity("General");
                  setProvince("General");
                  setBedrooms("");
                  setBathrooms("");
                  setArea("");
                  setDescription("");
                  setUploadedFiles([]);
                }}
                className="mt-6 px-6 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl"
              >
                Publicar otra propiedad
              </Button>
            </motion.div>
          ) : (
            /* Formulario Paso a Paso */
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Indicador de Pasos */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= num ? 'bg-[#1a365d] text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                      {num}
                    </div>
                    {num < 3 && (
                      <div className={`h-1 flex-1 mx-2 rounded transition-all ${step > num ? 'bg-[#1a365d]' : 'bg-slate-100'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Paso 1: Información Básica */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a365d] font-display flex items-center gap-2">
                    <Info size={20} className="text-[#d69e2e]" />
                    Información Básica
                  </h3>
                  
                  {/* Tipo de Operación */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 block">Tipo de Operación</label>
                    <div className="flex gap-3 max-w-sm">
                      <button
                        type="button"
                        onClick={() => setOperation("SALE")}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${operation === "SALE" ? "bg-[#1a365d] border-[#1a365d] text-white shadow-md" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"}`}
                      >
                        Venta
                      </button>
                      <button
                        type="button"
                        onClick={() => setOperation("RENT")}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${operation === "RENT" ? "bg-[#1a365d] border-[#1a365d] text-white shadow-md" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"}`}
                      >
                        Alquiler
                      </button>
                    </div>
                  </div>

                  {/* Título de la propiedad */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Título de la publicación</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Casa de diseño con jardín y piscina en Pilar"
                      className={`w-full h-11 px-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${errors.title ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-0.5">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo de Propiedad */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Tipo de Propiedad</label>
                      <Select
                        value={propertyType}
                        onChange={setPropertyType}
                        options={[
                          { value: "HOUSE", label: "Casa" },
                          { value: "APARTMENT", label: "Departamento" },
                          { value: "LAND", label: "Terreno" },
                          { value: "COMMERCIAL", label: "Local Comercial" },
                        ]}
                        placeholder="Seleccionar..."
                        className="bg-slate-50 border border-slate-200"
                      />
                      {errors.propertyType && <p className="text-xs text-red-500 mt-0.5">{errors.propertyType}</p>}
                    </div>

                    {/* Precio */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Precio (USD)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ej. 120000"
                        className={`w-full h-11 px-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${errors.price ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                      />
                      {errors.price && <p className="text-xs text-red-500 mt-0.5">{errors.price}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Ubicación */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a365d] font-display flex items-center gap-2">
                    <MapPin size={20} className="text-[#d69e2e]" />
                    Ubicación del Inmueble
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Zona / Ubicación Aproximada</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Zona Centro, a 2 cuadras de la plaza principal"
                      className={`w-full h-11 px-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 placeholder:text-slate-400 ${errors.address ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                    />
                    <p className="text-xs text-slate-400">Por razones de seguridad y privacidad, no está permitido ingresar la dirección exacta del inmueble.</p>
                    {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Detalles */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-xl font-bold text-[#1a365d] font-display flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-[#d69e2e]" />
                    Detalles y Dimensiones
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Habitaciones */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Habitaciones</label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        placeholder="Ej. 3"
                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                      />
                    </div>

                    {/* Baños */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Baños</label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        placeholder="Ej. 2"
                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                      />
                    </div>

                    {/* Superficie */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Superficie Total (m²)</label>
                      <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Ej. 140"
                        className={`w-full h-11 px-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 ${errors.area ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:border-[#1a365d]'}`}
                      />
                      {errors.area && <p className="text-xs text-red-500 mt-0.5">{errors.area}</p>}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Descripción detallada</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe los aspectos destacados de tu propiedad..."
                      rows={5}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800 resize-none"
                    />
                  </div>
                </motion.div>
              )}
              {/* Botones de Navegación */}
              <div className="flex gap-3 pt-6 border-t border-slate-100">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="h-12 px-6 rounded-xl flex items-center gap-2 font-semibold text-sm border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    Atrás
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-12 px-6 rounded-xl ml-auto flex items-center gap-2 font-semibold text-sm bg-[#1a365d] hover:bg-[#2c5282] cursor-pointer"
                  >
                    Siguiente
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-xl ml-auto flex items-center gap-2 font-semibold text-sm bg-[#1a365d] hover:bg-[#2c5282] shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Publicando...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Enviar Publicación
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
