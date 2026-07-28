"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, Calendar, Users, History, Plus, 
  Trash2, Download, Save, CheckCircle, FilePlus, ClipboardList, Home, Image as ImageIcon, X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";

// Interfaz para Tipos de Datos
interface ContractData {
  clientName: string;
  clientRole: "TENANT" | "OWNER";
  startDate: string;
  endDate: string;
  monthlyAmount: string;
  currency: string;
  notes: string;
}

interface AttachmentFile {
  id: string;
  name: string;
  date: string;
  size?: string;
  status?: "PAGADO" | "IMPAGO" | "NO_APLICA";
}

interface EventLog {
  id: string;
  type: "PAGO_ALQUILER" | "EXPENSAS" | "MANTENIMIENTO" | "VISITA" | "OTRO";
  amount?: string;
  currency?: string;
  date: string;
  description: string;
}

  interface PropertyDetails {
    title: string;
    price: string;
    currency: string;
    type: string;
    operation: string;
    status: string;
    address: string;
    city: string;
    province: string;
    bedrooms: number;
    bathrooms: number;
    totalArea: number;
    coveredArea: number;
    description: string;
    image: string;
    images?: string[];
    barrio?: string;
  }

export default function AdminPropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<"publication" | "contract" | "files" | "history">("publication");

  // --- Estados de Datos ---
  const [contract, setContract] = useState<ContractData>({
    clientName: "María Gómez",
    clientRole: "TENANT",
    startDate: "2026-03-01",
    endDate: "2028-02-29",
    monthlyAmount: "1200",
    currency: "USD",
    notes: "El inquilino abona puntualmente los primeros 5 días del mes. Las expensas corren por cuenta del propietario.",
  });

  const [files, setFiles] = useState<AttachmentFile[]>([
    { id: "1", name: "Contrato_Firmado.pdf", date: "2026-03-02", size: "2.4 MB", status: "NO_APLICA" },
    { id: "2", name: "Plano_Propiedad.pdf", date: "2026-01-15", size: "4.1 MB", status: "NO_APLICA" },
    { id: "3", name: "Boleta_Expensas_Julio.pdf", date: "2026-07-10", size: "1.2 MB", status: "IMPAGO" },
  ]);

  const [history, setHistory] = useState<EventLog[]>([
    { id: "1", type: "PAGO_ALQUILER", amount: "1200", currency: "USD", date: "2026-07-05", description: "Cobro cuota de Alquiler de Julio" },
    { id: "2", type: "EXPENSAS", amount: "150", currency: "USD", date: "2026-07-10", description: "Pago de expensas ordinarias del mes" },
    { id: "3", type: "MANTENIMIENTO", amount: "80", currency: "USD", date: "2026-06-18", description: "Reparación de filtración en baño principal" },
    { id: "4", type: "VISITA", date: "2026-05-12", description: "Visita de inspección de estado general realizada por el agente" },
  ]);

  // --- Estados para nuevos registros ---
  const [newFileName, setNewFileName] = useState("");
  const [newFileDate, setNewFileDate] = useState(new Date().toISOString().split("T")[0]);
  const [newFileStatus, setNewFileStatus] = useState<AttachmentFile["status"]>("NO_APLICA");

  const [newEvent, setNewEvent] = useState<{
    type: EventLog["type"];
    amount: string;
    currency: string;
    date: string;
    description: string;
  }>({
    type: "PAGO_ALQUILER",
    amount: "",
    currency: "USD",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [showNotification, setShowNotification] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState("");

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    title: "",
    price: "",
    currency: "USD",
    type: "HOUSE",
    operation: "SALE",
    status: "AVAILABLE",
    address: "",
    city: "Pico Truncado",
    province: "",
    bedrooms: 0,
    bathrooms: 0,
    totalArea: 0,
    coveredArea: 0,
    description: "",
    image: "",
    images: [],
    barrio: "Centro",
  });

  // --- Cargar de localStorage si existe ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedContract = localStorage.getItem(`contract_${slug}`);
      const storedFiles = localStorage.getItem(`files_${slug}`);
      const storedHistory = localStorage.getItem(`history_${slug}`);
      const storedDetails = localStorage.getItem(`property_details_${slug}`);

      if (storedContract) setContract(JSON.parse(storedContract));
      if (storedFiles) setFiles(JSON.parse(storedFiles));
      if (storedHistory) setHistory(JSON.parse(storedHistory));

      if (storedDetails) {
        setPropertyDetails(JSON.parse(storedDetails));
      } else {
        // Cargar mocks realistas
        if (slug === "casa-moderna-en-palermo") {
          setPropertyDetails({
            title: "Casa Moderna con Jardín en Palermo",
            price: "350000",
            currency: "USD",
            type: "HOUSE",
            operation: "SALE",
            status: "AVAILABLE",
            address: "Calle Falsa 123",
            city: "Pico Truncado",
            province: "Santa Cruz",
            bedrooms: 4,
            bathrooms: 3,
            totalArea: 400,
            coveredArea: 250,
            description: "Hermosa propiedad recién refaccionada con amplio jardín y piscina. Ideal para familias.",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            images: [
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
            ],
            barrio: "Residencial Oeste"
          });
        } else if (slug === "departamento-puerto-madero") {
          setPropertyDetails({
            title: "Lujoso Departamento con Vista al Río",
            price: "2500",
            currency: "USD",
            type: "APARTMENT",
            operation: "RENT",
            status: "RESERVED",
            address: "Av. Alicia Moreau de Justo 1500",
            city: "Pico Truncado",
            province: "Santa Cruz",
            bedrooms: 2,
            bathrooms: 2,
            totalArea: 110,
            coveredArea: 95,
            description: "Exclusivo departamento en Puerto Madero. Vista panorámica al río, amenities de categoría, seguridad 24 horas y cochera doble.",
            image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
            images: [
              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            ],
            barrio: "Parque Industrial"
          });
        } else {
          setPropertyDetails({
            title: "Oficina Moderna en Microcentro",
            price: "1200",
            currency: "USD",
            type: "OFFICE",
            operation: "RENT",
            status: "INACTIVE",
            address: "Florida 400",
            city: "Pico Truncado",
            province: "Santa Cruz",
            bedrooms: 0,
            bathrooms: 1,
            totalArea: 80,
            coveredArea: 80,
            description: "Oficina corporativa en pleno centro financiero. Planta libre, excelente iluminación natural, seguridad y lista para ingresar.",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            images: [
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
            ],
            barrio: "Centro"
          });
        }
      }
    }
  }, [slug]);

  // --- Guardar en localStorage ---
  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage(`contract_${slug}`, contract);
    triggerNotification();
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage(`property_details_${slug}`, propertyDetails);
    triggerNotification();
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newFile: AttachmentFile = {
      id: Date.now().toString(),
      name: newFileName,
      date: newFileDate,
      status: newFileStatus,
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    saveToLocalStorage(`files_${slug}`, updatedFiles);
    
    // Reset Form
    setNewFileName("");
    setNewFileDate(new Date().toISOString().split("T")[0]);
    setNewFileStatus("NO_APLICA");
    triggerNotification();
  };

  const handleDeleteFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    saveToLocalStorage(`files_${slug}`, updatedFiles);
  };

  const handleToggleFileStatus = (id: string) => {
    const updatedFiles = files.map((f): AttachmentFile => {
      if (f.id === id) {
        return {
          ...f,
          status: f.status === "IMPAGO" ? "PAGADO" : f.status === "PAGADO" ? "IMPAGO" : "IMPAGO"
        };
      }
      return f;
    });
    setFiles(updatedFiles);
    saveToLocalStorage(`files_${slug}`, updatedFiles);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.description.trim()) return;

    const newLog: EventLog = {
      id: Date.now().toString(),
      type: newEvent.type,
      amount: newEvent.amount || undefined,
      currency: newEvent.currency,
      date: newEvent.date,
      description: newEvent.description,
    };

    const updatedHistory = [newLog, ...history];
    setHistory(updatedHistory);
    saveToLocalStorage(`history_${slug}`, updatedHistory);

    // Reset Form
    setNewEvent({
      type: "PAGO_ALQUILER",
      amount: "",
      currency: "USD",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    triggerNotification();
  };

  const handleDeleteEvent = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    saveToLocalStorage(`history_${slug}`, updatedHistory);
  };

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Ordenar archivos por fecha (de más reciente a más antiguo)
  const sortedFiles = [...files].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Título legible a partir del slug
  const propertyTitle = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 relative">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 z-50 animate-fade-in">
          <CheckCircle size={18} className="text-green-400 animate-pulse" />
          <span className="text-sm font-semibold">Cambios guardados con éxito</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/propiedades" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-[#1a365d] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">{propertyDetails.title || propertyTitle}</h1>
          <p className="text-sm text-slate-500">Gestión administrativa interna, contratos y registros históricos.</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("publication")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "publication" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <Home size={18} />
          Ficha de Publicación
        </button>
        <button
          onClick={() => setActiveTab("contract")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "contract" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <ClipboardList size={18} />
          Contrato y Cliente
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "files" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <FileText size={18} />
          Archivos y Documentos
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "history" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <History size={18} />
          Historial de Eventos
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* PESTAÑA: FICHA DE PUBLICACIÓN */}
        {activeTab === "publication" && (
          <form onSubmit={handleSaveDetails} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Vista Previa y Foto (Izquierda) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vista Previa de Portada</span>
              
              {propertyDetails.image ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 shadow-inner group">
                  <img
                    src={propertyDetails.image}
                    alt={propertyDetails.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <ImageIcon size={28} className="text-slate-300 mb-1" />
                  Sin imagen de portada
                </div>
              )}

              <div className="space-y-1.5 pb-3 border-b border-slate-100">
                <label className="text-xs font-semibold text-slate-600 block">Imagen de Portada</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPropertyDetails({ ...propertyDetails, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="cover-photo-upload"
                  />
                  <label
                    htmlFor="cover-photo-upload"
                    className="w-full h-11 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-slate-300 transition-all cursor-pointer select-none"
                  >
                    <span>📁</span> Cargar Foto de Portada
                  </label>
                </div>
              </div>

              {/* Galería de Imágenes Adicionales */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Galería de Imágenes</span>
                
                {/* Lista de Imágenes */}
                <div className="grid grid-cols-3 gap-2">
                  {(propertyDetails.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group shadow-sm bg-slate-50">
                      <img src={imgUrl} className="object-cover w-full h-full" alt={`Galería ${idx + 1}`} />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImages = (propertyDetails.images || []).filter((_, i) => i !== idx);
                          setPropertyDetails({ ...propertyDetails, images: updatedImages });
                        }}
                        className="absolute top-1 right-1 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors shadow-md opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                        title="Eliminar imagen"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Formulario Agregar Imagen Local */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-slate-600 block">Subir Imagen a Galería</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const currentImages = propertyDetails.images || [];
                            setPropertyDetails({
                              ...propertyDetails,
                              images: [...currentImages, reader.result as string]
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="gallery-photo-upload"
                    />
                    <label
                      htmlFor="gallery-photo-upload"
                      className="w-full h-11 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-slate-300 transition-all cursor-pointer select-none"
                    >
                      <span>➕</span> Cargar Imagen de mis Archivos
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Detalles (Derecha) */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Información de la Publicación</h3>
              
              <div className="space-y-4">
                {/* Título de la Publicación */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Título del Inmueble</label>
                  <Input
                    required
                    value={propertyDetails.title || ""}
                    onChange={(e) => setPropertyDetails({...propertyDetails, title: e.target.value})}
                    placeholder="Ej. Casa Moderna con Jardín en Palermo"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Precio y Moneda */}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Precio / Valor</label>
                    <div className="flex gap-2">
                      <div className="w-24 shrink-0">
                        <Select
                          value={propertyDetails.currency}
                          onChange={(val) => setPropertyDetails({...propertyDetails, currency: val})}
                          className="h-11 text-sm font-semibold"
                          options={[
                            { value: "USD", label: "USD" },
                            { value: "ARS", label: "ARS" }
                          ]}
                        />
                      </div>
                      <Input
                        type="number"
                        required
                        value={propertyDetails.price || ""}
                        onChange={(e) => setPropertyDetails({...propertyDetails, price: e.target.value})}
                        placeholder="Ej. 350000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Estado de Publicación</label>
                    <Select
                      value={propertyDetails.status}
                      onChange={(val) => setPropertyDetails({...propertyDetails, status: val})}
                      className="h-11 text-xs"
                      options={[
                        { value: "AVAILABLE", label: "🟢 Disponible (Activa)" },
                        { value: "RESERVED", label: "🟡 Reservada" },
                        { value: "SOLD", label: "🔴 Vendida" },
                        { value: "RENTED", label: "🔵 Alquilada" },
                        { value: "INACTIVE", label: "⚪ Inactiva" },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tipo de Inmueble */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Tipo de Inmueble</label>
                    <Select
                      value={propertyDetails.type}
                      onChange={(val) => setPropertyDetails({...propertyDetails, type: val})}
                      className="h-11 text-sm"
                      options={[
                        { value: "HOUSE", label: "Casa" },
                        { value: "APARTMENT", label: "Departamento" },
                        { value: "LAND", label: "Terreno / Lote" },
                        { value: "COMMERCIAL", label: "Local Comercial" },
                        { value: "OFFICE", label: "Oficina" },
                      ]}
                    />
                  </div>

                  {/* Tipo de Operación */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Tipo de Operación</label>
                    <Select
                      value={propertyDetails.operation}
                      onChange={(val) => setPropertyDetails({...propertyDetails, operation: val})}
                      className="h-11 text-sm"
                      options={[
                        { value: "SALE", label: "Venta" },
                        { value: "RENT", label: "Alquiler" },
                        { value: "TEMP_RENT", label: "Alq. Temporario" },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Dormitorios */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Dormitorios</label>
                    <Input
                      type="number"
                      value={propertyDetails.bedrooms ?? 0}
                      onChange={(e) => setPropertyDetails({...propertyDetails, bedrooms: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  {/* Baños */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Baños</label>
                    <Input
                      type="number"
                      value={propertyDetails.bathrooms ?? 0}
                      onChange={(e) => setPropertyDetails({...propertyDetails, bathrooms: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  {/* M2 Totales */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">M² Totales</label>
                    <Input
                      type="number"
                      value={propertyDetails.totalArea ?? 0}
                      onChange={(e) => setPropertyDetails({...propertyDetails, totalArea: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  {/* M2 Cubiertos */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">M² Cubiertos</label>
                    <Input
                      type="number"
                      value={propertyDetails.coveredArea ?? 0}
                      onChange={(e) => setPropertyDetails({...propertyDetails, coveredArea: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Dirección */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Dirección</label>
                    <Input
                      value={propertyDetails.address || ""}
                      onChange={(e) => setPropertyDetails({...propertyDetails, address: e.target.value})}
                      placeholder="Ej. Florida 400"
                    />
                  </div>
                  {/* Barrio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Barrio</label>
                    <Input
                      value={propertyDetails.barrio || ""}
                      onChange={(e) => setPropertyDetails({...propertyDetails, barrio: e.target.value})}
                      placeholder="Ej. Centro"
                    />
                  </div>
                  {/* Ciudad */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Ciudad</label>
                    <div className="h-11 flex items-center bg-slate-100 border border-slate-200 rounded-xl text-sm px-3.5 text-slate-500 font-medium select-none">
                      Pico Truncado
                    </div>
                  </div>
                </div>

                {/* Descripción descriptiva */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Descripción de la Publicación</label>
                  <textarea
                    rows={5}
                    value={propertyDetails.description || ""}
                    onChange={(e) => setPropertyDetails({...propertyDetails, description: e.target.value})}
                    placeholder="Escribe una descripción comercial atractiva para el portal inmobiliario..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl flex items-center gap-2 h-11 px-6 font-semibold text-sm cursor-pointer shadow-md shadow-[#1a365d]/10">
                  <Save size={18} />
                  Guardar Publicación
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* PESTAÑA: CONTRATO Y CLIENTE */}
        {activeTab === "contract" && (
          <form onSubmit={handleSaveContract} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Información del Contrato</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre del Cliente / Contraparte</label>
                <Input 
                  value={contract.clientName} 
                  onChange={(e) => setContract({...contract, clientName: e.target.value})}
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rol del Cliente</label>
                <select 
                  value={contract.clientRole} 
                  onChange={(e) => setContract({...contract, clientRole: e.target.value as any})}
                  className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                >
                  <option value="TENANT">Inquilino (Arrendatario)</option>
                  <option value="OWNER">Propietario</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Monto Mensual del Contrato</label>
                <div className="flex gap-2">
                  <select 
                    value={contract.currency} 
                    onChange={(e) => setContract({...contract, currency: e.target.value})}
                    className="w-24 h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                  <Input 
                    type="number"
                    value={contract.monthlyAmount} 
                    onChange={(e) => setContract({...contract, monthlyAmount: e.target.value})}
                    required
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha de Inicio</label>
                <DatePicker 
                  value={contract.startDate} 
                  onChange={(val) => setContract({...contract, startDate: val})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha de Vencimiento</label>
                <DatePicker 
                  value={contract.endDate} 
                  onChange={(val) => setContract({...contract, endDate: val})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notas y Anotaciones Internas</label>
              <textarea 
                rows={5}
                value={contract.notes}
                onChange={(e) => setContract({...contract, notes: e.target.value})}
                placeholder="Deja anotaciones sobre el estado del contrato, reajustes periódicos, garantías presentadas, etc..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" className="flex items-center gap-2">
                <Save size={16} />
                Guardar Contrato y Notas
              </Button>
            </div>
          </form>
        )}

        {/* PESTAÑA: ARCHIVOS Y DOCUMENTOS */}
        {activeTab === "files" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Formulario Nueva Carga */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
              <h3 className="text-md font-bold text-[#1a365d] mb-4 flex items-center gap-2">
                <FilePlus size={18} className="text-[#d69e2e]" />
                Registrar Documento
              </h3>
              
              <form onSubmit={handleAddFile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Archivo</label>
                  <Input 
                    value={newFileName} 
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Ej. Contrato_Anexo_A.pdf" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha del Archivo</label>
                  <DatePicker 
                    value={newFileDate} 
                    onChange={(val) => setNewFileDate(val)}
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Estado de Pago (si aplica)</label>
                  <select
                    value={newFileStatus}
                    onChange={(e) => setNewFileStatus(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="NO_APLICA">No aplica (General)</option>
                    <option value="IMPAGO">🔴 Pendiente de Pago (Impaga)</option>
                    <option value="PAGADO">🟢 Abonado (Pagada)</option>
                  </select>
                </div>

                <Button type="submit" className="w-full mt-2">
                  <Plus size={16} className="mr-1" />
                  Agregar Archivo
                </Button>
              </form>
            </div>

            {/* Listado de Archivos */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Expediente de Documentos</h3>
              
              {sortedFiles.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No hay documentos registrados para esta propiedad.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sortedFiles.map((file) => (
                    <div key={file.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
                            {file.status && file.status !== "NO_APLICA" && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                file.status === "PAGADO" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                              }`}>
                                {file.status === "PAGADO" ? "Abonado" : "Pendiente de Pago"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">Fecha del archivo: {file.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {file.status && file.status !== "NO_APLICA" && (
                          <button
                            onClick={() => handleToggleFileStatus(file.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                              file.status === "PAGADO" 
                                ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100" 
                                : "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                            }`}
                            title={file.status === "PAGADO" ? "Marcar como pendiente" : "Marcar como pagado"}
                          >
                            {file.status === "PAGADO" ? "Desmarcar" : "Marcar Pago"}
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Descargar">
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA: HISTORIAL Y LOG DE EVENTOS */}
        {activeTab === "history" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Registrar Evento */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
              <h3 className="text-md font-bold text-[#1a365d] mb-4 flex items-center gap-2">
                <FilePlus size={18} className="text-[#d69e2e]" />
                Registrar Pago o Acción
              </h3>
              
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Evento</label>
                  <select 
                    value={newEvent.type} 
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="PAGO_ALQUILER">Pago de Alquiler</option>
                    <option value="EXPENSAS">Cobro de Expensas</option>
                    <option value="MANTENIMIENTO">Mantenimiento / Reparación</option>
                    <option value="VISITA">Visita / Inspección</option>
                    <option value="OTRO">Otro Evento</option>
                  </select>
                </div>

                {(newEvent.type === "PAGO_ALQUILER" || newEvent.type === "EXPENSAS" || newEvent.type === "MANTENIMIENTO") && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Monto (Opcional)</label>
                    <div className="flex gap-2">
                      <select 
                        value={newEvent.currency} 
                        onChange={(e) => setNewEvent({...newEvent, currency: e.target.value})}
                        className="w-24 h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                      >
                        <option value="USD">USD</option>
                        <option value="ARS">ARS</option>
                      </select>
                      <Input 
                        type="number" 
                        value={newEvent.amount} 
                        onChange={(e) => setNewEvent({...newEvent, amount: e.target.value})}
                        placeholder="Monto" 
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
                  <DatePicker 
                    value={newEvent.date} 
                    onChange={(val) => setNewEvent({...newEvent, date: val})}
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción / Nota</label>
                  <textarea 
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Detalles sobre el pago o la acción..."
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-2">
                  <Plus size={16} className="mr-1" />
                  Agregar al Registro
                </Button>
              </form>
            </div>

            {/* Listado del Log */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Registro de Actividad</h3>
              
              {history.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No hay registros de eventos aún.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((log) => (
                    <div key={log.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-start hover:border-slate-200 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.type === "PAGO_ALQUILER" ? "bg-green-50 text-green-700 border border-green-100" :
                            log.type === "EXPENSAS" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            log.type === "MANTENIMIENTO" ? "bg-red-50 text-red-700 border border-red-100" :
                            log.type === "VISITA" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {log.type.replace("_", " ")}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{log.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{log.description}</p>
                        {log.amount && (
                          <p className="text-xs font-bold text-[#1a365d]">
                            Importe registrado: {log.currency} {Number(log.amount).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteEvent(log.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Eliminar del log"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
