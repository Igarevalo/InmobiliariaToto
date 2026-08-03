import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionPayload } from "@/lib/auth";
import { readConsultas, writeConsultas } from "../../route";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;

    const { message, isPublic, sendNotification, newStatus } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "El mensaje de respuesta es obligatorio." }, { status: 400 });
    }

    const consultas = readConsultas();
    const idx = consultas.findIndex((c: any) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Consulta no encontrada." }, { status: 404 });
    }

    const agentName = session.user?.name || session.user?.username || "Agente";
    const now = new Date().toISOString();

    // Agregar mensaje al hilo
    const newMessage = {
      id: crypto.randomUUID(),
      sender: "AGENT",
      senderName: agentName,
      content: message.trim(),
      isPublic: isPublic ?? false,
      createdAt: now,
    };

    consultas[idx].messages.push(newMessage);

    // Actualizar estado
    const targetStatus = newStatus || "ANSWERED";
    consultas[idx].status = targetStatus;
    consultas[idx].answeredAt = now;
    consultas[idx].answeredBy = agentName;
    consultas[idx].updatedAt = now;

    // Si la respuesta es pública, marcar la consulta como pública también
    if (isPublic) {
      consultas[idx].isPublic = true;
    }

    writeConsultas(consultas);

    // Simulación de notificación al cliente
    if (sendNotification) {
      console.log(
        `[NOTIFICACIÓN SIMULADA] Se notificaría a ${consultas[idx].guestEmail} sobre la respuesta a su consulta (ID: ${id}).`,
        `En una próxima etapa este log disparará un email/webhook real.`
      );
    }

    return NextResponse.json({
      success: true,
      consulta: consultas[idx],
    });
  } catch (error) {
    console.error("Error responding to consulta:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  // Permite actualizar solo el estado (ej: marcar como FOLLOWING_UP sin responder)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;
    const { status, isPublic } = await req.json();

    const consultas = readConsultas();
    const idx = consultas.findIndex((c: any) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Consulta no encontrada." }, { status: 404 });
    }

    if (status) consultas[idx].status = status;
    if (typeof isPublic === "boolean") consultas[idx].isPublic = isPublic;
    consultas[idx].updatedAt = new Date().toISOString();

    writeConsultas(consultas);

    return NextResponse.json({ success: true, consulta: consultas[idx] });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
