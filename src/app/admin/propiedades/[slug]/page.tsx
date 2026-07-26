"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, Calendar, Users, History, Plus, 
  Trash2, Download, Save, CheckCircle, FilePlus, ClipboardList 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

export default function AdminPropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<"contract" | "files" | "history">("contract");

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

  // --- Cargar de localStorage si existe ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedContract = localStorage.getItem(`contract_${slug}`);
      const storedFiles = localStorage.getItem(`files_${slug}`);
      const storedHistory = localStorage.getItem(`history_${slug}`);

      if (storedContract) setContract(JSON.parse(storedContract));
      if (storedFiles) setFiles(JSON.parse(storedFiles));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
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
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/propiedades" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-[#1a365d] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">{propertyTitle}</h1>
          <p className="text-sm text-slate-500">Gestión administrativa interna, contratos y registros históricos.</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200">
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
                <Input 
                  type="date"
                  value={contract.startDate} 
                  onChange={(e) => setContract({...contract, startDate: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha de Vencimiento</label>
                <Input 
                  type="date"
                  value={contract.endDate} 
                  onChange={(e) => setContract({...contract, endDate: e.target.value})}
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
                  <Input 
                    type="date" 
                    value={newFileDate} 
                    onChange={(e) => setNewFileDate(e.target.value)}
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
                  <Input 
                    type="date" 
                    value={newEvent.date} 
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
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
