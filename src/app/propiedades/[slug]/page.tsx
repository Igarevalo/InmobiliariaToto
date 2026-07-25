import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyContactForm } from "@/components/property/PropertyContactForm";
import { MapPin, BedDouble, Bath, Square, Calendar, Car, Check } from "lucide-react";
import { notFound } from "next/navigation";

// MOCK data (hasta conectar con Prisma)
const MOCK_PROPERTY = {
  slug: "casa-moderna-en-palermo",
  title: "Casa Moderna con Jardín en Palermo",
  description: "Exclusiva residencia recién refaccionada con materiales de primera calidad. Cuenta con un amplio jardín de diseño, piscina climatizada y quincho con parrilla. En la planta baja encontramos un gran living comedor con pisos de roble de Eslavonia, cocina con isla totalmente equipada y toilette de recepción. La planta alta alberga 4 dormitorios, la master suite con gran vestidor y baño con jacuzzi. Excelente luminosidad natural en todos los ambientes. \n\nUbicada en la zona más residencial y cotizada de Palermo, cerca de los principales accesos, colegios y polos gastronómicos.",
  price: 350000,
  currency: "USD",
  operation: "SALE",
  type: "HOUSE",
  address: "Calle Falsa 123",
  city: "Capital Federal",
  province: "Buenos Aires",
  bedrooms: 4,
  bathrooms: 3,
  totalArea: 400,
  coveredArea: 250,
  yearBuilt: 2018,
  parkingSpaces: 2,
  agent: {
    name: "Juan Pérez",
  },
  images: [
    { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80", alt: "Fachada principal" },
    { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80", alt: "Living comedor" },
    { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80", alt: "Cocina" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80", alt: "Dormitorio" }
  ],
  amenities: [
    "Piscina climatizada", "Jardín", "Quincho", "Parrilla", "Seguridad 24hs", "Aire Acondicionado Central", "Calefacción por losa radiante"
  ]
};

// Next.js 15 App Router dynamic params
export default async function PropertyPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  // Simulación de búsqueda en DB
  if (params.slug !== MOCK_PROPERTY.slug) {
    // Si no es el slug de prueba, mostramos la propiedad mock de todas formas
    // para propósitos de UI en esta fase, pero idealmente sería notFound()
  }

  const property = MOCK_PROPERTY;

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "image": property.images.map(i => i.url),
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Usamos un header sólido (no transparente) forzando isScrolled o con fondo oscuro */}
      <div className="bg-[#1a365d] pb-20">
        <Header />
      </div>
      
      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-10 mb-20 relative z-10">
        
        {/* Breadcrumb */}
        <div className="text-white/80 text-sm mb-6 flex gap-2">
          <span>Propiedades</span>
          <span>/</span>
          <span>{property.operation === "SALE" ? "Ventas" : "Alquileres"}</span>
          <span>/</span>
          <span className="text-white font-medium truncate">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Izquierda) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-[#1a365d] text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                    {property.operation === "SALE" ? "En Venta" : "En Alquiler"}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-800 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-500 text-sm">
                    <MapPin size={16} className="mr-1 shrink-0" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold font-display text-[#1a365d]">
                  {formattedPrice}
                </div>
              </div>

              <PropertyGallery images={property.images} />

              {/* Quick Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 py-6 border-y border-slate-100">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl">
                  <Square size={24} className="text-[#d69e2e] mb-2" />
                  <span className="font-bold text-slate-800">{property.totalArea}m²</span>
                  <span className="text-xs text-slate-500">Totales</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl">
                  <BedDouble size={24} className="text-[#d69e2e] mb-2" />
                  <span className="font-bold text-slate-800">{property.bedrooms}</span>
                  <span className="text-xs text-slate-500">Dormitorios</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl">
                  <Bath size={24} className="text-[#d69e2e] mb-2" />
                  <span className="font-bold text-slate-800">{property.bathrooms}</span>
                  <span className="text-xs text-slate-500">Baños</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl">
                  <Car size={24} className="text-[#d69e2e] mb-2" />
                  <span className="font-bold text-slate-800">{property.parkingSpaces}</span>
                  <span className="text-xs text-slate-500">Cocheras</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-xl font-bold font-display text-[#1a365d] mb-4">Descripción</h3>
                <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {property.description}
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold font-display text-[#1a365d] mb-4">Características y Amenities</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {property.amenities.map((amenity, idx) => (
                    <li key={idx} className="flex items-center text-slate-600">
                      <Check size={18} className="text-green-500 mr-2 shrink-0" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Sidebar (Derecha) */}
          <div className="lg:col-span-1">
            <PropertyContactForm propertyId={property.slug} agentName={property.agent.name} />
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
