"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Loader2 } from "lucide-react";

interface QAItem {
  id: string;
  question: string;
  guestName: string;
  answer: string;
  answeredAt: string;
}

export function PropertyQA({ propertyId }: { propertyId: string }) {
  const [items, setItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQA() {
      try {
        const res = await fetch(`/api/consultas?propertyId=${encodeURIComponent(propertyId)}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (e) {
        // silently fail on public page
      } finally {
        setLoading(false);
      }
    }
    fetchQA();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
        <Loader2 size={16} className="animate-spin" />
        Cargando preguntas frecuentes...
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-slate-100" id="property-qa">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={22} className="text-[#1a365d]" />
        <h3 className="text-xl font-bold font-display text-[#1a365d]">
          Preguntas Frecuentes sobre esta Propiedad
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                id={`qa-toggle-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors group"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#1a365d]/10 text-[#1a365d] text-xs font-bold flex items-center justify-center">
                    P
                  </span>
                  <span className="font-medium text-slate-800 text-sm leading-snug">
                    {item.question}
                  </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-3">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 bg-slate-50/60">
                  <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#d69e2e]/20 text-[#d69e2e] text-xs font-bold flex items-center justify-center">
                      R
                    </span>
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed">{item.answer}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Respondido el{" "}
                        {new Intl.DateTimeFormat("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(item.answeredAt))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
