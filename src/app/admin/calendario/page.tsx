"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const PROPERTIES = [
  { slug: "casa-moderna-en-palermo", title: "Casa Moderna con Jardín en Palermo" },
  { slug: "departamento-puerto-madero", title: "Lujoso Departamento con Vista al Río" },
  { slug: "oficina-microcentro", title: "Oficina Moderna en Microcentro" },
];

interface CalendarEvent {
  id: string;
  day: number; // Día del mes (1-31)
  title: string;
  type: "COBRO_ALQUILER" | "PAGO_SERVICIOS" | "VISITA" | "RENOVACION" | "OTRO";
  recurrence: "MONTHLY" | "ONCE";
  property: string;
  description: string;
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", day: 5, title: "Cobro Alquiler - Dpto 3A", type: "COBRO_ALQUILER", recurrence: "MONTHLY", property: "Dpto Vista al Río Puerto Madero", description: "Cobro del canon mensual acordado." },
    { id: "2", day: 5, title: "Cobro Alquiler - Casa Palermo", type: "COBRO_ALQUILER", recurrence: "MONTHLY", property: "Casa Moderna en Palermo", description: "Abono puntual primer quinquenio." },
    { id: "3", day: 10, title: "Pago Expensas - Oficina Centro", type: "PAGO_SERVICIOS", recurrence: "MONTHLY", property: "Oficina Microcentro", description: "Pago de expensas del consorcio." },
    { id: "4", day: 15, title: "Visita Inspección - Casa Pilar", type: "VISITA", recurrence: "ONCE", property: "Casa Country Pilar", description: "Verificar el estado del parque y pileta." },
    { id: "5", day: 28, title: "Vencimiento Contrato - Dpto 3A", type: "RENOVACION", recurrence: "ONCE", property: "Dpto Vista al Río Puerto Madero", description: "Fin de contrato de 24 meses. Programar renovación o entrega." },
  ]);

  // --- Estados de Formulario ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDay, setNewDay] = useState<number>(5);
  const [newType, setNewType] = useState<CalendarEvent["type"]>("COBRO_ALQUILER");
  const [newRecurrence, setNewRecurrence] = useState<CalendarEvent["recurrence"]>("MONTHLY");
  const [newProperty, setNewProperty] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // --- Persistencia localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEvents = localStorage.getItem("admin_calendar_events");
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    }
  }, []);

  const saveEvents = (updatedEvents: CalendarEvent[]) => {
    setEvents(updatedEvents);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_calendar_events", JSON.stringify(updatedEvents));
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      day: Number(newDay),
      title: newTitle,
      type: newType,
      recurrence: newRecurrence,
      property: newProperty || "General",
      description: newDescription,
    };

    const updated = [...events, newEvent];
    saveEvents(updated);

    // Reset Form
    setNewTitle("");
    setNewProperty("");
    setNewDescription("");
    setShowAddForm(false);

    // Update selected day view if applicable
    if (selectedDay === newEvent.day) {
      setSelectedDayEvents(updated.filter(ev => ev.day === selectedDay));
    }
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
    if (selectedDay) {
      setSelectedDayEvents(updated.filter(ev => ev.day === selectedDay));
    }
  };

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(dayNum);
    setSelectedDayEvents(events.filter(ev => ev.day === dayNum));
  };

  // Generar cuadrícula de calendario (31 días fijos del mes actual)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Calendario de Tareas</h1>
          <p className="text-sm text-slate-500">Coordina cobros, pagos de servicios y actividades recurrentes del mes.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} className="mr-2" />
          Nueva Tarea Mensual
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Izquierdo: Cuadrícula del Calendario */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Formulario Agregar Tarea */}
          {showAddForm && (
            <form onSubmit={handleAddEvent} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4 animate-fade-in">
              <h3 className="text-md font-bold text-[#1a365d] border-b border-slate-100 pb-2">Programar Tarea de Calendario</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Título de la Acción *</label>
                  <Input 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="Ej. Cobro de Alquiler" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Día Programado (1-31) *</label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={31} 
                    value={newDay} 
                    onChange={(e) => setNewDay(Number(e.target.value))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Categoría</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="COBRO_ALQUILER">Cobro de Alquiler</option>
                    <option value="PAGO_SERVICIOS">Pago de Servicios/Expensas</option>
                    <option value="VISITA">Visita / Inspección</option>
                    <option value="RENOVACION">Renovación Contrato</option>
                    <option value="OTRO">Otro Evento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Frecuencia</label>
                  <select
                    value={newRecurrence}
                    onChange={(e) => setNewRecurrence(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
                  >
                    <option value="MONTHLY">Todos los meses (Recurrente)</option>
                    <option value="ONCE">Solo este mes</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Propiedad Asociada</label>
                  <Select
                    value={PROPERTIES.find(p => p.title === newProperty)?.slug || ""}
                    onChange={(val) => {
                      const match = PROPERTIES.find(p => p.slug === val);
                      setNewProperty(match ? match.title : "");
                    }}
                    className="h-11 text-sm"
                    placeholder="Ninguna - Evento General"
                    options={[
                      { value: "", label: "Ninguna - Evento General" },
                      ...PROPERTIES.map(p => ({ value: p.slug, label: p.title }))
                    ]}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción corta</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalles específicos..."
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] text-slate-800 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                <Button type="submit">Guardar Tarea</Button>
              </div>
            </form>
          )}

          {/* Cuadrícula */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              <div>Lun</div>
              <div>Mar</div>
              <div>Mié</div>
              <div>Jue</div>
              <div>Vie</div>
              <div>Sáb</div>
              <div>Dom</div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((dayNum) => {
                const dayEvents = events.filter((e) => e.day === dayNum);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDay === dayNum;

                return (
                  <div
                    key={dayNum}
                    onClick={() => handleDayClick(dayNum)}
                    className={`min-h-[85px] border border-slate-100 rounded-xl p-2 flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-50 ${isSelected ? "ring-2 ring-[#1a365d] bg-slate-50/50" : "bg-white"}`}
                  >
                    <span className={`text-xs font-bold ${isSelected ? "text-[#1a365d]" : "text-slate-500"}`}>{dayNum}</span>
                    
                    {/* Indicadores de Eventos */}
                    {hasEvents && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                              ev.type === "COBRO_ALQUILER" ? "bg-green-50 text-green-700" :
                              ev.type === "PAGO_SERVICIOS" ? "bg-blue-50 text-blue-700" :
                              ev.type === "VISITA" ? "bg-amber-50 text-amber-700" :
                              ev.type === "RENOVACION" ? "bg-purple-50 text-purple-700" :
                              "bg-slate-100 text-slate-700"
                            }`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[8px] text-slate-400 font-semibold text-center">
                            +{dayEvents.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Detalle de Eventos del Día */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start min-h-[300px]">
          {selectedDay === null ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-12 text-slate-400 space-y-3">
              <CalendarIcon size={40} className="stroke-1" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">Selecciona un día</p>
                <p className="text-xs">Haz clic en cualquier celda para ver o gestionar sus tareas asignadas.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-[#1a365d] text-lg font-display">Día {selectedDay}</h3>
                <span className="text-xs text-slate-400 font-medium">Tareas del día</span>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <AlertCircle size={28} className="mx-auto text-slate-300" />
                  <p className="text-sm font-medium">Sin tareas programadas</p>
                  <p className="text-xs">No hay cobros ni visitas registradas para este día del mes.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map((ev) => (
                    <div key={ev.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex items-start justify-between hover:border-slate-200 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            ev.type === "COBRO_ALQUILER" ? "bg-green-50 text-green-700 border border-green-100" :
                            ev.type === "PAGO_SERVICIOS" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            ev.type === "VISITA" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            ev.type === "RENOVACION" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {ev.type.replace("_", " ")}
                          </span>
                          {ev.recurrence === "MONTHLY" && (
                            <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-500 font-bold uppercase">Mensual</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{ev.title}</h4>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Home size={12} className="text-[#d69e2e]" />
                          {ev.property}
                        </p>
                        {ev.description && (
                          <p className="text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-100 leading-relaxed">{ev.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Eliminar tarea"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
