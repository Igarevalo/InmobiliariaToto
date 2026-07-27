import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyPassword, generateSessionToken } from "@/lib/auth";

const CONFIG_PATH = path.join(process.cwd(), "admin_config.json");
const SESSION_DURATION = 60 * 60 * 4; // 4 horas en segundos

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // Buscar la contraseña personalizada en el archivo de configuración
    let correctPassword = process.env.ADMIN_PASSWORD;
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
        if (config.password) {
          correctPassword = config.password;
        }
      }
    } catch (e) {
      console.error("Error leyendo configuración personalizada de administrador:", e);
    }

    if (!correctPassword) {
      return NextResponse.json(
        { error: "La contraseña de administrador no está configurada en el servidor." },
        { status: 500 }
      );
    }

    // Comprobar la contraseña usando el helper seguro (soporta texto plano y scrypt)
    if (verifyPassword(password, correctPassword)) {
      const cookieStore = await cookies();
      const sessionToken = generateSessionToken(SESSION_DURATION);

      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_DURATION,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Contraseña incorrecta." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor al intentar autenticar." },
      { status: 500 }
    );
  }
}
