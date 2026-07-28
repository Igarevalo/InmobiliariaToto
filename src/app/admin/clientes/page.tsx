"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Mail, Phone, Edit, MoreVertical, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

export default function AdminClientesPage() {
  const INITIAL_CLIENTS = [
    { id: "CLI-001", name: "María Gómez", email: "maria.gomez@example.com", phone: "+54 11 1234-5678", type: "Propietario", status: "Ganado", lastContact: "Hace 2 días" },
    { id: "CLI-002", name: "Carlos Rodríguez", email: "carlos.r@gmail.com", phone: "+54 11 8765-4321", type: "Comprador", status: "Calificado", lastContact: "Hoy" },
    { id: "CLI-003", name: "Sofía Etcheverry", email: "sofia.e@hotmail.com", phone: "+54 11 5555-4444", type: "Inquilino", status: "Propuesta", lastContact: "Hace 1 semana" },
    { id: "CLI-004", name: "Juan Ignacio", email: "juan.ig@empresa.com", phone: "-", type: "Lead", status: "Nuevo", lastContact: "Ayer" },
  ];

  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  // Estado del Modal de Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newType, setNewType] = useState("Lead");
  const [newStatus, setNewStatus] = useState("Nuevo");

  // Crear Cliente
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newIdNum = clients.length + 1;
    const newClient = {
      id: `CLI-${String(newIdNum).padStart(3, "0")}`,
      name: newName.trim(),
      email: newEmail.trim() || "-",
      phone: newPhone.trim() || "-",
      type: newType,
      status: newStatus,
      lastContact: "Hoy",
    };

    setClients([newClient, ...clients]);
    
    // Guardar también en localStorage para que la vista de detalle pueda cargar los mocks realistas
    localStorage.setItem(`client_profile_${newClient.id}`, JSON.stringify({
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      type: newClient.type,
      status: newClient.status,
      observations: "Cliente registrado recientemente mediante el CRM.",
    }));

    // Resetear formulario
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewType("Lead");
    setNewStatus("Nuevo");
    setIsModalOpen(false);
  };

  // Filtrado de Clientes
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    const matchesType = selectedType === "Todos" || client.type === selectedType;
    const matchesStatus = selectedStatus === "Todos" || client.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Clientes (CRM)</h1>
          <p className="text-sm text-slate-500">Gestiona tus prospectos, compradores y propietarios.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[#1a365d] hover:bg-[#2c5282] rounded-xl flex items-center gap-2 h-11 px-5 font-semibold text-sm cursor-pointer shadow-md shadow-[#1a365d]/10">
          <Plus size={18} />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tarjetas de Resumen CRM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total Clientes</p>
          <p className="text-2xl font-bold text-[#1a365d]">{clients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Nuevos Leads (Mes)</p>
          <p className="text-2xl font-bold text-blue-600">42</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">En Negociación</p>
          <p className="text-2xl font-bold text-amber-600">18</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Cerrados (Mes)</p>
          <p className="text-2xl font-bold text-green-600">7</p>
        </div>
      </div>

      {/* Tabla y Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center z-20">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono..." 
              className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] transition-all text-slate-800"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filtro de Tipo */}
            <div className="w-full sm:w-44">
              <Select
                value={selectedType}
                onChange={(val) => setSelectedType(val)}
                className="h-11 text-xs"
                placeholder="Filtrar por Tipo"
                options={[
                  { value: "Todos", label: "Tipo: Todos" },
                  { value: "Propietario", label: "Propietario" },
                  { value: "Comprador", label: "Comprador" },
                  { value: "Inquilino", label: "Inquilino" },
                  { value: "Lead", label: "Lead" },
                ]}
              />
            </div>
            {/* Filtro de Estado */}
            <div className="w-full sm:w-44">
              <Select
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
                className="h-11 text-xs"
                placeholder="Filtrar por Estado"
                options={[
                  { value: "Todos", label: "Estado: Todos" },
                  { value: "Nuevo", label: "Nuevo" },
                  { value: "Contactado", label: "Contactado" },
                  { value: "Calificado", label: "Calificado" },
                  { value: "Propuesta", label: "Propuesta" },
                  { value: "Ganado", label: "Ganado" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto z-10">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Últ. Interacción</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <Link href={`/admin/clientes/${client.id}`} className="block">
                      <p className="font-semibold text-slate-800 group-hover:text-[#1a365d] transition-colors">{client.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{client.id}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/clientes/${client.id}`} className="block">
                      <div className="flex flex-col gap-1 text-slate-600">
                        {client.email && client.email !== "-" && (
                          <div className="flex items-center gap-1.5">
                            <Mail size={14} className="text-slate-400" />
                            <span className="text-xs">{client.email}</span>
                          </div>
                        )}
                        {client.phone && client.phone !== "-" && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-slate-400" />
                            <span className="text-xs">{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/clientes/${client.id}`} className="block">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {client.type}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/clientes/${client.id}`} className="block">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Nuevo' ? 'bg-blue-50 text-blue-700' :
                        client.status === 'Calificado' ? 'bg-indigo-50 text-indigo-700' :
                        client.status === 'Propuesta' ? 'bg-amber-50 text-amber-700' :
                        client.status === 'Ganado' ? 'bg-green-50 text-green-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {client.status}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <Link href={`/admin/clientes/${client.id}`} className="block">
                      {client.lastContact}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href={`/admin/clientes/${client.id}?tab=interactions`} 
                        className="p-2 text-slate-400 hover:text-[#1a365d] hover:bg-blue-50 rounded-xl transition-all" 
                        title="Añadir interacción"
                      >
                        <MessageSquare size={18} />
                      </Link>
                      <Link 
                        href={`/admin/clientes/${client.id}?tab=info`} 
                        className="p-2 text-slate-400 hover:text-[#d69e2e] hover:bg-yellow-50 rounded-xl transition-all" 
                        title="Editar información"
                      >
                        <Edit size={18} />
                      </Link>
                      <Link 
                        href={`/admin/clientes/${client.id}`} 
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all" 
                        title="Ver ficha completa"
                      >
                        <MoreVertical size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR NUEVO CLIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-visible">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 font-display">Registrar Nuevo Cliente</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              {/* Nombre completo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. María Gómez"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="maria.gomez@example.com"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Teléfono (Opcional)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+54 11 1234-5678"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a365d] transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tipo de cliente */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Tipo</label>
                  <Select
                    value={newType}
                    onChange={(val) => setNewType(val)}
                    className="h-11 text-sm"
                    options={[
                      { value: "Propietario", label: "Propietario" },
                      { value: "Comprador", label: "Comprador" },
                      { value: "Inquilino", label: "Inquilino" },
                      { value: "Lead", label: "Lead" },
                    ]}
                  />
                </div>

                {/* Estado del cliente */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Estado</label>
                  <Select
                    value={newStatus}
                    onChange={(val) => setNewStatus(val)}
                    className="h-11 text-sm"
                    options={[
                      { value: "Nuevo", label: "Nuevo" },
                      { value: "Contactado", label: "Contactado" },
                      { value: "Calificado", label: "Calificado" },
                      { value: "Propuesta", label: "Propuesta" },
                      { value: "Ganado", label: "Ganado" },
                    ]}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-[#1a365d] hover:bg-[#2c5282] rounded-xl h-11 font-semibold text-sm cursor-pointer"
                >
                  Registrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
