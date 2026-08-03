import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CONSULTAS_PATH = path.join(process.cwd(), "admin_consultas.json");

function readConsultas(): any[] {
  try {
    if (fs.existsSync(CONSULTAS_PATH)) {
      return JSON.parse(fs.readFileSync(CONSULTAS_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading consultas file:", e);
  }
  return [];
}

function writeConsultas(consultas: any[]): void {
  try {
    fs.writeFileSync(CONSULTAS_PATH, JSON.stringify(consultas, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing consultas file:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, propertyId, propertyTitle, propertyUrl } =
      await req.json();

    // Validaciones básicas
    if (!name?.trim() || !email?.trim() || !message?.trim() || !propertyId?.trim()) {
      return NextResponse.json(
        { error: "Nombre, email, mensaje y propiedad son obligatorios." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "El email no es válido." }, { status: 400 });
    }

    const consultas = readConsultas();

    // Buscar si ya existe un lead/cliente con ese email para vincularlo
    const existingClientRef = consultas.find(
      (c: any) => c.guestEmail?.toLowerCase() === email.toLowerCase()
    );

    const newConsulta = {
      id: crypto.randomUUID(),
      // Datos del visitante (lead)
      guestName: name.trim(),
      guestEmail: email.trim().toLowerCase(),
      guestPhone: phone?.trim() || null,
      // Referencia del cliente existente si aplica
      existingClientEmail: existingClientRef?.guestEmail || null,
      // Datos de la propiedad
      propertyId: propertyId.trim(),
      propertyTitle: propertyTitle?.trim() || null,
      propertyUrl: propertyUrl?.trim() || null,
      // Contenido
      message: message.trim(),
      // Estado inicial
      status: "PENDING", // PENDING | ANSWERED | FOLLOWING_UP
      isPublic: false,
      // Respuesta
      answeredAt: null,
      answeredBy: null,
      // Hilo de mensajes
      messages: [
        {
          id: crypto.randomUUID(),
          sender: "CLIENT",
          senderName: name.trim(),
          content: message.trim(),
          isPublic: false,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    consultas.push(newConsulta);
    writeConsultas(consultas);

    // Simulación de notificación (en producción: enviar email/webhook)
    console.log(
      `[CONSULTA RECIBIDA] Nueva consulta de ${name} <${email}> para propiedad "${propertyTitle}" (ID: ${newConsulta.id})`
    );

    return NextResponse.json(
      { success: true, inquiryId: newConsulta.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating consulta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Endpoint público para Q&A — devuelve solo mensajes públicos de una propiedad
  const propertyId = req.nextUrl.searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId requerido" }, { status: 400 });
  }

  try {
    const consultas = readConsultas();

    const publicQA = consultas
      .filter(
        (c: any) =>
          c.propertyId === propertyId && c.status === "ANSWERED" && c.isPublic === true
      )
      .map((c: any) => ({
        id: c.id,
        question: c.message,
        guestName: c.guestName,
        answer: c.messages.find((m: any) => m.sender === "AGENT" && m.isPublic)?.content || null,
        answeredAt: c.answeredAt,
      }))
      .filter((qa: any) => qa.answer !== null);

    return NextResponse.json(publicQA);
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
