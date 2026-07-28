"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value: string; // Esperado formato "YYYY-MM-DD" o vacío
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export function DatePicker({
  value,
  onChange,
  required = false,
  className,
  placeholder = "Seleccione una fecha",
  disabled = false
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializar mes y año del calendario
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day || 1);
    }
    return new Date();
  });

  const selectedDate = value ? (() => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  })() : null;

  // Actualizar mes y año cuando cambie el valor externo
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      setCurrentDate(new Date(year, month - 1, day || 1));
    }
  }, [value]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calcular días a mostrar
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    // Ajustar para que el primer día de la semana sea Lunes (0=Domingo -> 6=Lunes)
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number, isCurrentMonth = true) => {
    if (disabled) return;
    
    let targetYear = year;
    let targetMonth = month;

    if (!isCurrentMonth) {
      if (day > 20) { // Pertenece al mes anterior
        targetMonth = month - 1;
        if (targetMonth < 0) {
          targetMonth = 11;
          targetYear = year - 1;
        }
      } else { // Pertenece al mes siguiente
        targetMonth = month + 1;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear = year + 1;
        }
      }
    }

    const formattedMonth = String(targetMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedDate = `${targetYear}-${formattedMonth}-${formattedDay}`;

    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // Renderizar la fecha seleccionada en formato legible
  const getDisplayValue = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const isToday = (dayNum: number) => {
    const today = new Date();
    return today.getDate() === dayNum && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (dayNum: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === dayNum && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  // Generar grid de celdas
  const calendarDays = [];

  // Días del mes anterior para rellenar
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      dayNum: prevMonthDays - i,
      isCurrentMonth: false,
    });
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: true,
    });
  }

  // Rellenar con los días del mes siguiente hasta completar múltiplos de 7
  const totalSlots = 42; // Grid estándar de 6 semanas
  const remainingSlots = totalSlots - calendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: false,
    });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Input */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus-within:ring-2 focus-within:ring-[#1a365d] transition-all cursor-pointer",
          disabled && "cursor-not-allowed opacity-50 bg-slate-50",
          isOpen && "border-[#1a365d] ring-2 ring-[#1a365d]/10",
          className
        )}
      >
        <span className={cn("truncate flex items-center gap-2", !value && "text-slate-400 font-normal")}>
          <CalendarIcon size={16} className="text-slate-400 shrink-0" />
          {getDisplayValue() || placeholder}
        </span>
        {value && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <span className="text-slate-400 text-xs">▼</span>
        )}
      </div>

      {/* Calendario Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-100 shadow-2xl p-4 z-[999] animate-in fade-in slide-in-from-top-1 duration-250 select-none">
          {/* Navegación Mes/Año */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="text-xs font-bold text-slate-700 font-sans">
              {MONTHS[month]} de {year}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Días de la Semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((day) => (
              <span key={day} className="text-[11px] font-bold text-slate-400 uppercase font-sans">
                {day}
              </span>
            ))}
          </div>

          {/* Días del Mes */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              const { dayNum, isCurrentMonth } = cell;
              const today = isCurrentMonth && isToday(dayNum);
              const selected = isCurrentMonth && isSelected(dayNum);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(dayNum, isCurrentMonth)}
                  className={cn(
                    "h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer",
                    !isCurrentMonth && "text-slate-300 hover:bg-slate-50",
                    isCurrentMonth && !selected && !today && "text-slate-600 hover:bg-slate-100",
                    today && !selected && "bg-slate-100 text-[#1a365d] ring-1 ring-inset ring-slate-200",
                    selected && "bg-[#1a365d] text-white font-bold shadow-md shadow-[#1a365d]/20 scale-105"
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer del calendario */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const formattedMonth = String(today.getMonth() + 1).padStart(2, "0");
                const formattedDay = String(today.getDate()).padStart(2, "0");
                onChange(`${today.getFullYear()}-${formattedMonth}-${formattedDay}`);
                setIsOpen(false);
              }}
              className="hover:text-[#1a365d] font-bold transition-colors cursor-pointer"
            >
              Hoy
            </button>

            {required && !value && (
              <span className="text-red-500 font-semibold text-[9px] uppercase tracking-wider">Requerido</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
