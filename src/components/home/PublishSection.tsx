import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export function PublishSection() {
  return (
    <section className="py-24 bg-[#1a365d] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#2b6cb0] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#d69e2e] opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d69e2e] text-[#1a365d] mb-6">
            <Home size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
            ¿Quieres vender o alquilar tu propiedad?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto text-balance">
            Únete a cientos de propietarios que confían en nosotros. Te ofrecemos tasación sin cargo, fotografía profesional y publicación destacada en los principales portales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 text-lg">
              Publicar mi propiedad
            </Button>
            <Button size="lg" className="bg-white/20 text-white hover:bg-white/30 px-8 text-lg border-none">
              Solicitar tasación
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
