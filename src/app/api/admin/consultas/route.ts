import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSessionPayload } from "@/lib/auth";

const CONSULTAS_PATH = path.join(process.cwd(), "admin_consultas.json");

export function readConsultas(): any[] {
  try {
    if (fs.existsSync(CONSULTAS_PATH)) {
      return JSON.parse(fs.readFileSync(CONSULTAS_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading consultas file:", e);
  }
  return [];
}

export function writeConsultas(consultas: any[]): void {
  try {
    fs.writeFileSync(CONSULTAS_PATH, JSON.stringify(consultas, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing consultas file:", e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get("status"); // PENDING | ANSWERED | FOLLOWING_UP
    const propertyId = req.nextUrl.searchParams.get("propertyId");

    let consultas = readConsultas();

    if (status) {
      consultas = consultas.filter((c: any) => c.status === status);
    }

    if (propertyId) {
      consultas = consultas.filter((c: any) => c.propertyId === propertyId);
    }

    // Ordenar: más recientes primero
    consultas.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(consultas);
  } catch (error) {
    console.error("Error fetching consultas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
