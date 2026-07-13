import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Square, MapPin } from "lucide-react";

interface PropertyCardProps {
  property: {
    slug: string;
    title: string;
    price: number;
    currency: string;
    operation: "SALE" | "RENT" | "TEMP_RENT";
    city: string;
    province: string;
    bedrooms: number;
    bathrooms: number;
    totalArea: number;
    imageUrl: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#1a365d] text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
            {property.operation === "SALE" ? "Venta" : "Alquiler"}
          </span>
        </div>
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-2xl font-bold text-[#1a365d] mb-2 font-display">
          {formattedPrice}
        </div>
        <Link href={`/propiedades/${property.slug}`} className="flex-grow">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 hover:text-[#d69e2e] transition-colors mb-2">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin size={16} className="mr-1 shrink-0" />
          <span className="truncate">{property.city}, {property.province}</span>
        </div>

        {/* Features Footer */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-slate-600 text-sm">
          <div className="flex items-center gap-1.5 justify-center">
            <BedDouble size={18} className="text-[#d69e2e]" />
            <span>{property.bedrooms} Dorm.</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-x border-slate-100">
            <Bath size={18} className="text-[#d69e2e]" />
            <span>{property.bathrooms} Baños</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Square size={18} className="text-[#d69e2e]" />
            <span>{property.totalArea}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
