"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Users, Home, DollarSign, MessageSquare, Plus, 
  Trash2, Save, CheckCircle, ExternalLink, Calendar, Info 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";

// interfaces
interface ClientProfile {
  name: string;
  email: string;
  phone: string;
  type: "Propietario" | "Comprador" | "Inquilino" | "Lead";
  status: "Nuevo" | "Contactado" | "Calificado" | "Propuesta" | "Ganado";
  observations: string;
}

interface AssociatedProperty {
  id: string;
  slug: string;
  title: string;
  relationship: "Alquilando" | "Propietario" | "Interesado";
  startDate?: string;
  endDate?: string;
  monthlyRent?: string;
}

interface FinancialRecord {
  id: string;
  date: string;
  concept: string;
  amount: string;
  currency: string;
  type: "COBRO" | "PAGO";
}

interface InteractionLog {
  id: string;
  date: string;
  channel: "Llamada" | "Email" | "Reunión" | "WhatsApp";
  details: string;
}

export default function AdminClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<"info" | "properties" | "finances" | "interactions">("info");

  // --- Estados de Datos ---
  const [profile, setProfile] = useState<ClientProfile>({
    name: "María Gómez",
    email: "maria.gomez@example.com",
    phone: "+54 11 1234-5678",
    type: "Propietario",
    status: "Ganado",
    observations: "Cliente recurrente de la inmobiliaria. Posee múltiples departamentos en la zona de Palermo y los tiene asignados a nuestra administración de alquileres.",
  });

  const [properties, setProperties] = useState<AssociatedProperty[]>([
    { 
      id: "1", 
      slug: "casa-moderna-en-palermo", 
      title: "Casa Moderna con Jardín en Palermo", 
      relationship: "Propietario", 
      startDate: "2026-03-01", 
      endDate: "2028-02-29",
      monthlyRent: "1200"
    }
  ]);

  const [finances, setFinances] = useState<FinancialRecord[]>([
    { id: "1", date: "2026-07-05", concept: "Cobro Alquiler - Casa Palermo", amount: "1200", currency: "USD", type: "COBRO" },
    { id: "2", date: "2026-06-05", concept: "Cobro Alquiler - Casa Palermo", amount: "1200", currency: "USD", type: "COBRO" },
    { id: "3", date: "2026-05-05", concept: "Cobro Alquiler - Casa Palermo", amount: "1200", currency: "USD", type: "COBRO" }
  ]);

  const [interactions, setInteractions] = useState<InteractionLog[]>([
    { id: "1", date: "2026-07-23", channel: "WhatsApp", details: "Cliente consulta por fecha de pago de expensas del inquilino." },
    { id: "2", date: "2026-07-02", channel: "Llamada", details: "Llamada de coordinación de firmas del anexo del contrato." }
  ]);

  // --- Estados para nuevos registros ---
  const [newPropertySlug, setNewPropertySlug] = useState("");
  const [newPropertyTitle, setNewPropertyTitle] = useState("");
  const [newPropRelationship, setNewPropRelationship] = useState<AssociatedProperty["relationship"]>("Alquilando");
  const [newPropStart, setNewPropStart] = useState("");
  const [newPropEnd, setNewPropEnd] = useState("");
  const [newPropRent, setNewPropRent] = useState("");

  const [newFinDate, setNewFinDate] = useState(new Date().toISOString().split("T")[0]);
  const [newFinConcept, setNewFinConcept] = useState("");
  const [newFinAmount, setNewFinAmount] = useState("");
  const [newFinCurrency, setNewFinCurrency] = useState("USD");
  const [newFinType, setNewFinType] = useState<FinancialRecord["type"]>("COBRO");

  const [newIntDate, setNewIntDate] = useState(new Date().toISOString().split("T")[0]);
  const [newIntChannel, setNewIntChannel] = useState<InteractionLog["channel"]>("WhatsApp");
  const [newIntDetails, setNewIntDetails] = useState("");

  const [showNotification, setShowNotification] = useState(false);

  // --- Cargar de localStorage y Query Params ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (tabParam && ["info", "properties", "finances", "interactions"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem(`client_profile_${id}`);
      const storedProps = localStorage.getItem(`client_props_${id}`);
      const storedFin = localStorage.getItem(`client_fin_${id}`);
      const storedInt = localStorage.getItem(`client_int_${id}`);

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedProps) setProperties(JSON.parse(storedProps));
      if (storedFin) setFinances(JSON.parse(storedFin));
      if (storedInt) setInteractions(JSON.parse(storedInt));

      // Ajustar mocks por defecto según el ID del cliente para que sea realista
      if (!storedProfile && id === "CLI-003") {
        setProfile({
          name: "Sofía Etcheverry",
          email: "sofia.e@hotmail.com",
          phone: "+54 11 5555-4444",
          type: "Inquilino",
          status: "Propuesta",
          observations: "Interesada en alquilar departamento de 2 ambientes. Solicitó cochera opcional.",
        });
        setProperties([
          { 
            id: "2", 
            slug: "departamento-puerto-madero", 
            title: "Lujoso Departamento con Vista al Río", 
            relationship: "Alquilando", 
            startDate: "2026-04-01", 
            endDate: "2028-03-31",
            monthlyRent: "2500" 
          }
        ]);
        setFinances([
          { id: "1", date: "2026-07-06", concept: "Pago Alquiler - Depto Puerto Madero", amount: "2500", currency: "USD", type: "PAGO" }
        ]);
      }
    }
  }, [id]);

  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage(`client_profile_${id}`, profile);
    triggerNotification();
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropertyTitle.trim()) return;

    // Generar slug del título si no está especificado
    const slugGen = newPropertySlug.trim() || newPropertyTitle.toLowerCase().trim().replace(/[\s_-]+/g, "-");

    const newProp: AssociatedProperty = {
      id: Date.now().toString(),
      slug: slugGen,
      title: newPropertyTitle,
      relationship: newPropRelationship,
      startDate: newPropStart || undefined,
      endDate: newPropEnd || undefined,
      monthlyRent: newPropRent || undefined
    };

    const updated = [...properties, newProp];
    setProperties(updated);
    saveToLocalStorage(`client_props_${id}`, updated);

    // Reset
    setNewPropertyTitle("");
    setNewPropertySlug("");
    setNewPropStart("");
    setNewPropEnd("");
    setNewPropRent("");
    triggerNotification();
  };

  const handleDeleteProperty = (propId: string) => {
    const updated = properties.filter(p => p.id !== propId);
    setProperties(updated);
    saveToLocalStorage(`client_props_${id}`, updated);
  };

  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFinConcept.trim() || !newFinAmount) return;

    const newRec: FinancialRecord = {
      id: Date.now().toString(),
      date: newFinDate,
      concept: newFinConcept,
      amount: newFinAmount,
      currency: newFinCurrency,
      type: newFinType
    };

    const updated = [newRec, ...finances];
    setFinances(updated);
    saveToLocalStorage(`client_fin_${id}`, updated);

    setNewFinConcept("");
    setNewFinAmount("");
    triggerNotification();
  };

  const handleDeleteFinance = (recId: string) => {
    const updated = finances.filter(f => f.id !== recId);
    setFinances(updated);
    saveToLocalStorage(`client_fin_${id}`, updated);
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntDetails.trim()) return;

    const newInt: InteractionLog = {
      id: Date.now().toString(),
      date: newIntDate,
      channel: newIntChannel,
      details: newIntDetails
    };

    const updated = [newInt, ...interactions];
    setInteractions(updated);
    saveToLocalStorage(`client_int_${id}`, updated);

    setNewIntDetails("");
    triggerNotification();
  };

  const handleDeleteInteraction = (intId: string) => {
    const updated = interactions.filter(i => i.id !== intId);
    setInteractions(updated);
    saveToLocalStorage(`client_int_${id}`, updated);
  };

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

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
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/clientes" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-[#1a365d] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">{profile.name}</h1>
          <p className="text-sm text-slate-500">Expediente de cliente en CRM: {id} | Rol: {profile.type}</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "info" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <Info size={18} />
          Ficha General
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "properties" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <Home size={18} />
          Propiedades y Contratos
        </button>
        <button
          onClick={() => setActiveTab("finances")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "finances" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <DollarSign size={18} />
          Historial Financiero
        </button>
        <button
          onClick={() => setActiveTab("interactions")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === "interactions" ? "border-[#1a365d] text-[#1a365d]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          <MessageSquare size={18} />
          Interacciones (Log)
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 gap-6">

        {/* TAB 1: FICHA GENERAL */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Datos del Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre Completo</label>
                <Input 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email de Contacto</label>
                <Input 
                  type="email"
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teléfono</label>
                <Input 
                  value={profile.phone} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo de Perfil</label>
                  <select 
                    value={profile.type} 
                    onChange={(e) => setProfile({...profile, type: e.target.value as any})}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="Propietario">Propietario</option>
                    <option value="Inquilino">Inquilino</option>
                    <option value="Comprador">Comprador</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Estado del Lead</label>
                  <select 
                    value={profile.status} 
                    onChange={(e) => setProfile({...profile, status: e.target.value as any})}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Calificado">Calificado</option>
                    <option value="Propuesta">Propuesta en Curso</option>
                    <option value="Ganado">Cerrado (Ganado)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Observaciones y Anotaciones</label>
              <textarea 
                rows={5}
                value={profile.observations}
                onChange={(e) => setProfile({...profile, observations: e.target.value})}
                placeholder="Datos adicionales del cliente, horarios preferidos de visita, etc..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit">
                <Save size={16} className="mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: PROPIEDADES Y CONTRATOS */}
        {activeTab === "properties" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Formulario Asignar */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
              <h3 className="text-md font-bold text-[#1a365d] mb-4 flex items-center gap-2">
                <Home size={18} className="text-[#d69e2e]" />
                Asociar Propiedad
              </h3>
              
              <form onSubmit={handleAddProperty} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Título de la Propiedad</label>
                  <Input 
                    value={newPropertyTitle} 
                    onChange={(e) => setNewPropertyTitle(e.target.value)} 
                    placeholder="Ej. Casa en Palermo" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Slug (Link Directo)</label>
                  <Input 
                    value={newPropertySlug} 
                    onChange={(e) => setNewPropertySlug(e.target.value)} 
                    placeholder="Ej. casa-moderna-en-palermo" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Relación</label>
                  <select 
                    value={newPropRelationship}
                    onChange={(e) => setNewPropRelationship(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="Alquilando">Alquilando (Inquilino)</option>
                    <option value="Propietario">Es Propietario (Dueño)</option>
                    <option value="Interesado">Interesado (Visitante)</option>
                  </select>
                </div>

                {newPropRelationship !== "Interesado" && (
                  <div className="space-y-4 border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold text-slate-400">DATOS DE CONTRATO (OPCIONAL)</p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Monto Mensual (USD)</label>
                      <Input 
                        type="number"
                        value={newPropRent} 
                        onChange={(e) => setNewPropRent(e.target.value)} 
                        placeholder="1200" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Inicio Contrato</label>
                        <DatePicker 
                          value={newPropStart} 
                          onChange={(val) => setNewPropStart(val)} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Vencimiento</label>
                        <DatePicker 
                          value={newPropEnd} 
                          onChange={(val) => setNewPropEnd(val)} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <Plus size={16} className="mr-1" />
                  Asociar Propiedad
                </Button>
              </form>
            </div>

            {/* Listado de Propiedades */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Propiedades Vinculadas</h3>
              
              {properties.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">El cliente no tiene propiedades asociadas.</p>
              ) : (
                <div className="space-y-4">
                  {properties.map((prop) => (
                    <div key={prop.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-start hover:border-slate-200 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prop.relationship === "Propietario" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                            prop.relationship === "Alquilando" ? "bg-green-50 text-green-700 border border-green-100" :
                            "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {prop.relationship}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{prop.title}</h4>
                        
                        {prop.startDate && (
                          <div className="text-xs text-slate-500 space-y-1 font-medium bg-white p-2.5 rounded-lg border border-slate-100">
                            <p>Vigencia: {prop.startDate} hasta {prop.endDate}</p>
                            {prop.monthlyRent && <p className="font-bold text-[#1a365d]">Canon Mensual: USD {Number(prop.monthlyRent).toLocaleString()}</p>}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/admin/propiedades/${prop.slug}`} 
                          className="p-1.5 text-slate-400 hover:text-[#1a365d] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="Ver Administración de Inmueble"
                        >
                          <ExternalLink size={14} />
                          Gestionar
                        </Link>
                        <button 
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Quitar vínculo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORIAL FINANCIERO */}
        {activeTab === "finances" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Formulario Registrar Transacción */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
              <h3 className="text-md font-bold text-[#1a365d] mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-[#d69e2e]" />
                Registrar Movimiento
              </h3>
              
              <form onSubmit={handleAddFinance} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Concepto</label>
                  <Input 
                    value={newFinConcept} 
                    onChange={(e) => setNewFinConcept(e.target.value)} 
                    placeholder="Ej. Pago Alquiler Julio" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Movimiento</label>
                  <select 
                    value={newFinType}
                    onChange={(e) => setNewFinType(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="COBRO">Cobro (Dinero Recibido)</option>
                    <option value="PAGO">Pago (Dinero Entregado)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Importe</label>
                  <div className="flex gap-2">
                    <select 
                      value={newFinCurrency}
                      onChange={(e) => setNewFinCurrency(e.target.value)}
                      className="w-24 h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                    <Input 
                      type="number"
                      value={newFinAmount} 
                      onChange={(e) => setNewFinAmount(e.target.value)} 
                      placeholder="Monto"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
                  <DatePicker 
                    value={newFinDate} 
                    onChange={(val) => setNewFinDate(val)} 
                    required 
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus size={16} className="mr-1" />
                  Agregar Registro
                </Button>
              </form>
            </div>

            {/* Listado de Pagos */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Libro Contable de Cliente</h3>
              
              {finances.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No hay transacciones registradas aún.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {finances.map((rec) => (
                    <div key={rec.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          rec.type === "COBRO" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {rec.type === "COBRO" ? "+" : "-"}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{rec.concept}</p>
                          <p className="text-xs text-slate-400">Fecha: {rec.date} | Tipo: {rec.type === "COBRO" ? "Cobro Recibido" : "Pago Realizado"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold text-sm ${rec.type === "COBRO" ? "text-green-600" : "text-blue-600"}`}>
                          {rec.currency} {Number(rec.amount).toLocaleString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteFinance(rec.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HISTORIAL DE INTERACCIONES */}
        {activeTab === "interactions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Registrar Interacción */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
              <h3 className="text-md font-bold text-[#1a365d] mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#d69e2e]" />
                Registrar Contacto
              </h3>
              
              <form onSubmit={handleAddInteraction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Canal</label>
                  <select 
                    value={newIntChannel}
                    onChange={(e) => setNewIntChannel(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Llamada">Llamada Telefónica</option>
                    <option value="Email">Correo Electrónico</option>
                    <option value="Reunión">Reunión Presencial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
                  <DatePicker 
                    value={newIntDate} 
                    onChange={(val) => setNewIntDate(val)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Detalles de la Conversación</label>
                  <textarea 
                    value={newIntDetails}
                    onChange={(e) => setNewIntDetails(e.target.value)}
                    placeholder="Escribe brevemente de qué hablaron..."
                    rows={4}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus size={16} className="mr-1" />
                  Agregar Interacción
                </Button>
              </form>
            </div>

            {/* Listado Interacciones */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#1a365d] border-b border-slate-100 pb-2">Bitácora de Interacciones</h3>
              
              {interactions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No hay interacciones registradas aún.</p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((int) => (
                    <div key={int.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-start hover:border-slate-200 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                            {int.channel}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{int.date}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-sans">{int.details}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteInteraction(int.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Quitar interacción"
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
