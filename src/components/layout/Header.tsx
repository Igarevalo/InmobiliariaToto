"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Building } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg transition-colors", isScrolled ? "bg-[#1a365d] text-white" : "bg-white text-[#1a365d]")}>
              <Building size={24} />
            </div>
            <span className={cn("text-xl font-bold font-display tracking-tight", isScrolled ? "text-[#1a365d]" : "text-white")}>
              InmobiliariaToto
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/propiedades" className={cn("font-medium transition-colors hover:text-[#d69e2e]", isScrolled ? "text-slate-700" : "text-white/90")}>
              Propiedades
            </Link>
            <Link href="/nosotros" className={cn("font-medium transition-colors hover:text-[#d69e2e]", isScrolled ? "text-slate-700" : "text-white/90")}>
              Nosotros
            </Link>
            <Link href="/contacto" className={cn("font-medium transition-colors hover:text-[#d69e2e]", isScrolled ? "text-slate-700" : "text-white/90")}>
              Contacto
            </Link>
            <Button variant={isScrolled ? "primary" : "secondary"}>
              Publicar Propiedad
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className={isScrolled ? "text-slate-800" : "text-white"} />
            ) : (
              <Menu size={24} className={isScrolled ? "text-slate-800" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 py-4 px-4 flex flex-col gap-4">
          <Link href="/propiedades" className="text-slate-700 font-medium py-2 border-b border-slate-50">
            Propiedades
          </Link>
          <Link href="/nosotros" className="text-slate-700 font-medium py-2 border-b border-slate-50">
            Nosotros
          </Link>
          <Link href="/contacto" className="text-slate-700 font-medium py-2 border-b border-slate-50">
            Contacto
          </Link>
          <Button className="w-full mt-2">Publicar Propiedad</Button>
        </div>
      )}
    </header>
  );
}
