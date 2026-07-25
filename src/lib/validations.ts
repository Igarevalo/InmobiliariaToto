import { z } from 'zod';

// === Auth Schemas ===
export const LoginSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// === Property Schemas ===
export const PropertySchema = z.object({
  title: z.string().min(5, "El título es muy corto").max(100),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  type: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OFFICE']),
  operation: z.enum(['SALE', 'RENT', 'TEMP_RENT']),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  currency: z.string().default("USD"),
  
  address: z.string().min(5, "La dirección o zona es obligatoria"),
  city: z.string().default("General"),
  province: z.string().default("General"),
  
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  totalArea: z.coerce.number().positive().optional(),
  coveredArea: z.coerce.number().positive().optional(),
});

// === Lead / Client Schemas ===
export const LeadSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  phone: z.string().min(8, "Teléfono inválido").optional().or(z.literal('')),
}).refine(data => data.email || data.phone, {
  message: "Debe proveer al menos un email o teléfono de contacto",
  path: ["email"]
});

export const InquirySchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
});
