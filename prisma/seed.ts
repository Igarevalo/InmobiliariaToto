import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpiar base de datos (opcional, cuidado en producción)
  // await prisma.property.deleteMany()
  // await prisma.client.deleteMany()
  // await prisma.user.deleteMany()

  // 1. Crear un Agente de prueba
  const agent = await prisma.user.upsert({
    where: { email: 'agente@toto.com' },
    update: {},
    create: {
      email: 'agente@toto.com',
      name: 'Juan Pérez (Agente)',
      role: 'AGENT',
    },
  })
  console.log(`👤 Agente creado: ${agent.name}`)

  // 2. Crear un Cliente (Owner) de prueba en CRM
  const ownerClient = await prisma.client.create({
    data: {
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria.gomez@example.com',
      phone: '+54 11 1234-5678',
      type: 'OWNER',
      status: 'WON',
      agentId: agent.id,
    },
  })
  console.log(`👥 Cliente propietario creado: ${ownerClient.firstName}`)

  // 3. Crear una propiedad de prueba
  const property = await prisma.property.upsert({
    where: { slug: 'casa-moderna-en-palermo' },
    update: {},
    create: {
      title: 'Casa Moderna con Jardín en Palermo',
      slug: 'casa-moderna-en-palermo',
      description: 'Hermosa propiedad recién refaccionada con amplio jardín y piscina. Ideal para familias.',
      type: 'HOUSE',
      operation: 'SALE',
      status: 'AVAILABLE',
      price: 350000.00,
      currency: 'USD',
      address: 'Calle Falsa 123',
      city: 'Capital Federal',
      province: 'Buenos Aires',
      zipCode: '1414',
      bedrooms: 4,
      bathrooms: 3,
      totalArea: 400.0,
      coveredArea: 250.0,
      agentId: agent.id,
      ownerId: ownerClient.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
            alt: 'Fachada',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80',
            alt: 'Living',
            order: 1,
          }
        ]
      }
    },
  })
  
  console.log(`🏠 Propiedad creada: ${property.title}`)
  console.log('✅ Seed finalizado correctamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
