import Link from "next/link";
import { Building, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a202c] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#d69e2e] text-[#1a202c] p-2 rounded-lg">
                <Building size={24} />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-white">
                InmobiliariaToto
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs text-balance">
              Transformando la forma en que encuentras tu próximo hogar. Innovación, transparencia y el mejor servicio.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-display">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/propiedades" className="hover:text-[#d69e2e] transition-colors">Propiedades en Venta</Link></li>
              <li><Link href="/propiedades?op=rent" className="hover:text-[#d69e2e] transition-colors">Alquileres</Link></li>
              <li><Link href="/nosotros" className="hover:text-[#d69e2e] transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/blog" className="hover:text-[#d69e2e] transition-colors">Blog de Noticias</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-display">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-display">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#d69e2e] shrink-0 mt-0.5" />
                <span>Av. del Libertador 1000<br />Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#d69e2e] shrink-0" />
                <span>+54 11 4321-1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#d69e2e] shrink-0" />
                <span>contacto@inmobiliariatoto.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} InmobiliariaToto. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Diseñado con <span className="text-red-500">♥</span> para la mejor experiencia.</p>
        </div>
      </div>
    </footer>
  );
}
