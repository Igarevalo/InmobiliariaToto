"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/adminStore";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";
import Link from "next/link";
import { 
  ClipboardList, Plus, AlertCircle, Clock, CheckCircle2, 
  CornerDownRight, MessageSquare, Send, Trash2, Calendar, 
  User as UserIcon, MoreVertical, X, Check, ShieldAlert
} from "lucide-react";

interface TaskComment {
  id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "POSTPONED" | "SUSPENDED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedTo: string;
  createdBy: string;
  dueDate: string | null;
  completedAt: string | null;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
  propertySlug: string | null;
}

const PROPERTIES = [
  { slug: "casa-moderna-en-palermo", title: "Casa Moderna con Jardín en Palermo" },
  { slug: "departamento-puerto-madero", title: "Lujoso Departamento con Vista al Río" },
  { slug: "oficina-microcentro", title: "Oficina Moderna en Microcentro" },
];

const STATUS_CONFIG = {
  PENDING: { label: "Pendiente", color: "bg-amber-50 text-amber-700 border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.2)] animate-pulse" },
  IN_PROGRESS: { label: "En Progreso", color: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Realizada", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  POSTPONED: { label: "Pospuesta", color: "bg-purple-50 text-purple-700 border-purple-200" },
  SUSPENDED: { label: "Suspendida", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

const PRIORITY_CONFIG = {
  LOW: { label: "Baja", color: "bg-slate-100 text-slate-700" },
  MEDIUM: { label: "Media", color: "bg-indigo-50 text-indigo-700" },
  HIGH: { label: "Alta", color: "bg-orange-50 text-orange-700" },
};

export default function AdminTareasPage() {
  const { name: currentAdminName, email: currentAdminEmail } = useAdminStore();
  const currentUsername = currentAdminEmail.includes("marta") ? "marta" : "admin";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  
  // Detalle de tarea
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Creación de tarea
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [newAssignedTo, setNewAssignedTo] = useState("admin");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPropertySlug, setNewPropertySlug] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Cargar tareas
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error("Error al cargar tareas:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(); // Carga inicial

    // Polling silencioso cada 4 segundos para actualizaciones en tiempo real
    const interval = setInterval(() => {
      fetch("/api/admin/tasks")
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          if (data) {
            setTasks(data);
            
            // Actualizar la tarea abierta en el modal en segundo plano
            setSelectedTask((prevSelected) => {
              if (!prevSelected) return null;
              const match = data.find((t: Task) => t.id === prevSelected.id);
              return match || prevSelected;
            });
          }
        })
        .catch((err) => console.error("Error en polling:", err));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Recargar tarea seleccionada para ver nuevos comentarios/estados
  const refreshSelectedTask = (updatedTasks: Task[]) => {
    if (selectedTask) {
      const match = updatedTasks.find(t => t.id === selectedTask.id);
      if (match) setSelectedTask(match);
    }
  };

  // Crear Tarea
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreatingTask(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          priority: newPriority,
          assignedTo: newAssignedTo,
          dueDate: newDueDate || null,
          propertySlug: newPropertySlug || null,
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewPriority("MEDIUM");
        setNewAssignedTo("admin");
        setNewDueDate("");
        setNewPropertySlug("");
        await fetchTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Actualizar Estado o Prioridad
  const handleUpdateTaskStatus = async (taskId: string, field: "status" | "priority" | "assignedTo", value: string) => {
    try {
      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        const nextTasks = tasks.map(t => t.id === taskId ? updatedTask : t);
        setTasks(nextTasks);
        refreshSelectedTask(nextTasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar Tarea
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta tarea?")) return;

    try {
      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
        setSelectedTask(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Enviar Comentario
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/admin/tasks/${selectedTask.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        const updatedTask = {
          ...selectedTask,
          comments: [...(selectedTask.comments || []), comment],
        };
        const nextTasks = tasks.map(t => t.id === selectedTask.id ? updatedTask : t);
        setTasks(nextTasks);
        setSelectedTask(updatedTask);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Filtrar tareas por estado
  const filteredTasks = tasks.filter(task => {
    if (activeTab === "ALL") return true;
    return task.status === activeTab;
  });

  const getAdminDisplayName = (username: string) => {
    return username === "marta" ? "Marta" : "Toto (Admin)";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return "Sin fecha límite";
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long"
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1a365d] text-white rounded-xl flex items-center justify-center shadow-lg">
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">Tareas Administrativas</h1>
            <p className="text-slate-500 text-sm">Organización interna y chat colaborativo para la gestión diaria.</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl flex items-center gap-2 h-11 px-5 font-semibold text-sm cursor-pointer shadow-md shadow-[#1a365d]/10 self-start sm:self-auto"
        >
          <Plus size={18} />
          Nueva Tarea
        </Button>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "ALL" ? "bg-[#1a365d] text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          Todas ({tasks.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = tasks.filter(t => t.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${activeTab === key ? "bg-[#1a365d] text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Listado de Tareas */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Cargando tareas...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-medium shadow-sm">
          No hay tareas en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="bg-white hover:border-[#1a365d]/40 rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col space-y-4 group relative"
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CONFIG[task.status].color}`}>
                  {STATUS_CONFIG[task.status].label}
                </span>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${PRIORITY_CONFIG[task.priority].color}`}>
                  Prioridad {PRIORITY_CONFIG[task.priority].label}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-[#1a365d] transition-colors">
                  {task.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">
                  {task.description || "Sin descripción."}
                </p>
              </div>

              {task.propertySlug && (
                <div className="text-[10px] text-blue-600 bg-blue-50/50 border border-blue-100 rounded-lg px-2.5 py-1 font-medium w-fit flex items-center gap-1 shrink-0">
                  <span>🏠</span>
                  <span className="truncate max-w-[180px]">{PROPERTIES.find(p => p.slug === task.propertySlug)?.title || task.propertySlug}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-auto">
                <div className="flex items-center gap-1.5">
                  <UserIcon size={12} className="text-slate-400" />
                  <span>Asignado: <strong>{getAdminDisplayName(task.assignedTo)}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={12} className="text-slate-400" />
                  <span>{(task.comments || []).length}</span>
                </div>
              </div>

              {task.dueDate && (
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar size={10} />
                  <span>Límite: {formatDueDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL DETALLE Y COMUNICACIÓN INTERNA */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_CONFIG[selectedTask.status].color}`}>
                    {STATUS_CONFIG[selectedTask.status].label}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${PRIORITY_CONFIG[selectedTask.priority].color}`}>
                    {PRIORITY_CONFIG[selectedTask.priority].label}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 font-display">{selectedTask.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo Modal */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Relación con la Tarea Banner */}
              {(() => {
                const isCreator = selectedTask.createdBy === currentUsername;
                const isAssignee = selectedTask.assignedTo === currentUsername;

                return (
                  <>
                    {isAssignee && !isCreator && (
                      <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
                        <span>📋</span>
                        <span>Esta tarea te fue asignada por <strong>{getAdminDisplayName(selectedTask.createdBy)}</strong>.</span>
                      </div>
                    )}
                    {isCreator && !isAssignee && (
                      <div className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
                        <span>📤</span>
                        <span>Creaste esta tarea y la asignaste a <strong>{getAdminDisplayName(selectedTask.assignedTo)}</strong>.</span>
                      </div>
                    )}
                    {isCreator && isAssignee && (
                      <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
                        <span>✏️</span>
                        <span>Tarea auto-asignada por ti.</span>
                      </div>
                    )}

                    {/* Información y Controles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Descripción</span>
                          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{selectedTask.description || "Sin descripción."}</p>
                        </div>
                        {selectedTask.dueDate && (
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Fecha Límite</span>
                            <p className="text-sm text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                              <Calendar size={14} className="text-slate-400" />
                              {formatDueDate(selectedTask.dueDate)}
                            </p>
                          </div>
                        )}
                        {selectedTask.propertySlug && (
                          <div className="pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Inmueble Vinculado</span>
                            <Link
                              href={`/admin/propiedades/${selectedTask.propertySlug}`}
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-xl px-3 py-2 transition-all cursor-pointer"
                            >
                              <span>🏠</span>
                              <span className="max-w-[180px] truncate">{PROPERTIES.find(p => p.slug === selectedTask.propertySlug)?.title || selectedTask.propertySlug}</span>
                              <span className="text-[9px]">↗</span>
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Cambiar Estado */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Cambiar Estado</label>
                          <Select
                            value={selectedTask.status}
                            onChange={(val) => handleUpdateTaskStatus(selectedTask.id, "status", val)}
                            className="h-10 text-xs"
                            options={[
                              { value: "PENDING", label: "Pendiente" },
                              { value: "IN_PROGRESS", label: "En Progreso" },
                              { value: "COMPLETED", label: "Realizada" },
                              { value: "POSTPONED", label: "Pospuesta" },
                              { value: "SUSPENDED", label: "Suspendida" },
                            ]}
                          />
                        </div>

                        {/* Cambiar Asignación */}
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Asignado a</label>
                          {isCreator ? (
                            <Select
                              value={selectedTask.assignedTo}
                              onChange={(val) => handleUpdateTaskStatus(selectedTask.id, "assignedTo", val)}
                              className="h-10 text-xs"
                              options={[
                                { value: "admin", label: "Toto (Admin)" },
                                { value: "marta", label: "Marta" },
                              ]}
                            />
                          ) : (
                            <div className="h-10 flex items-center bg-slate-100 border border-slate-200 rounded-xl text-xs px-2.5 text-slate-600 font-semibold">
                              {getAdminDisplayName(selectedTask.assignedTo)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones Rápidas para el Asignado */}
                    {isAssignee && selectedTask.status !== "COMPLETED" && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Acciones de Progreso</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.status !== "IN_PROGRESS" && (
                            <button
                              onClick={() => handleUpdateTaskStatus(selectedTask.id, "status", "IN_PROGRESS")}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Clock size={12} />
                              Comenzar Tarea
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateTaskStatus(selectedTask.id, "status", "COMPLETED")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check size={12} />
                            Completar Tarea
                          </button>
                          {selectedTask.status !== "POSTPONED" && (
                            <button
                              onClick={() => handleUpdateTaskStatus(selectedTask.id, "status", "POSTPONED")}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>⏳</span>
                              Posponer
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Chat de comentarios */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#1a365d]" />
                  Chat / Notas de la Tarea
                </h3>

                {/* Historial de Comentarios */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {(selectedTask.comments || []).length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">No hay mensajes. Envía un mensaje a continuación para iniciar la comunicación.</p>
                  ) : (
                    selectedTask.comments.map((comment) => {
                      const isMe = comment.author === currentUsername;
                      return (
                        <div 
                          key={comment.id}
                          className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs space-y-1 shadow-sm border ${
                            isMe 
                              ? "bg-slate-50 border-slate-100 text-slate-800 ml-auto" 
                              : "bg-blue-50/60 border-blue-100 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 font-semibold text-[10px] text-slate-400">
                            <span>{comment.authorName}</span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Formulario de Comentarios */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un mensaje para Marta/Toto..."
                    className="flex-1 h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer shadow-md shadow-[#1a365d]/10"
                  >
                    <Send size={14} className="text-white" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Footer Modal Acciones */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              {selectedTask.createdBy === currentUsername ? (
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
                >
                  <Trash2 size={15} />
                  Eliminar Tarea
                </button>
              ) : (
                <div />
              )}

              <Button
                onClick={() => setSelectedTask(null)}
                className="bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl px-4 h-9 font-semibold text-xs cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR TAREA */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 font-display">Crear Nueva Tarea</h2>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              {/* Título */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Revisar el cobro de alquiler del Depto 3B"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Descripción (Opcional)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Instrucciones o detalles de la tarea..."
                  rows={3}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Prioridad */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Prioridad</label>
                  <Select
                    value={newPriority}
                    onChange={(val) => setNewPriority(val as any)}
                    className="h-11 text-sm"
                    options={[
                      { value: "LOW", label: "Baja" },
                      { value: "MEDIUM", label: "Media" },
                      { value: "HIGH", label: "Alta" },
                    ]}
                  />
                </div>

                {/* Asignar a */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Asignar a</label>
                  <Select
                    value={newAssignedTo}
                    onChange={(val) => setNewAssignedTo(val)}
                    className="h-11 text-sm"
                    options={[
                      { value: "admin", label: "Toto (Admin)" },
                      { value: "marta", label: "Marta" },
                    ]}
                  />
                </div>
              </div>

              {/* Fecha Límite */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Fecha Límite (Opcional)</label>
                <DatePicker 
                  value={newDueDate}
                  onChange={(val) => setNewDueDate(val)}
                />
              </div>

              {/* Vincular a Inmueble */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Vincular a Inmueble (Opcional)</label>
                <Select
                  value={newPropertySlug}
                  onChange={(val) => setNewPropertySlug(val)}
                  className="h-11 text-sm"
                  placeholder="Ninguno - Tarea General"
                  options={[
                    { value: "", label: "Ninguno - Tarea General" },
                    ...PROPERTIES.map(p => ({ value: p.slug, label: p.title }))
                  ]}
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingTask}
                  className="w-1/2 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  {isCreatingTask ? "Creando..." : "Crear Tarea"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
