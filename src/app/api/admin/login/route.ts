import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { verifyPassword, generateSessionToken } from "@/lib/auth";

const CONFIG_PATH = path.join(process.cwd(), "admin_config.json");
const ADMINS_PATH = path.join(process.cwd(), "admin_users.json");
const SESSION_DURATION = 60 * 60 * 4; // 4 horas en segundos

export async function POST(req: NextRequest) {
  try {
    const { usernameOrEmail, password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Por favor, ingrese la contraseña." },
        { status: 400 }
      );
    }

    // 1. Intentar validar contra admin_users.json si existe
    if (fs.existsSync(ADMINS_PATH)) {
      try {
        const admins = JSON.parse(fs.readFileSync(ADMINS_PATH, "utf-8"));
        
        // Si no se proporcionó usuario/email, asumimos el "admin" por defecto
        const searchKey = usernameOrEmail ? usernameOrEmail.toLowerCase().trim() : "admin";
        
        const matchedAdmin = admins.find(
          (u: any) => 
            u.username.toLowerCase() === searchKey || 
            u.email.toLowerCase() === searchKey
        );

        if (matchedAdmin && verifyPassword(password, matchedAdmin.password)) {
          const cookieStore = await cookies();
          
          const userDetails = {
            name: matchedAdmin.name,
            email: matchedAdmin.email,
            username: matchedAdmin.username,
            avatar: matchedAdmin.avatar || ""
          };

          const sessionToken = generateSessionToken(SESSION_DURATION, userDetails);

          cookieStore.set("admin_session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: SESSION_DURATION,
          });

          return NextResponse.json({ success: true, user: userDetails });
        }
      } catch (e) {
        console.error("Error al procesar admin_users.json:", e);
      }
    }

    // 2. Fallback de compatibilidad usando admin_config.json o env
    let correctPassword = process.env.ADMIN_PASSWORD || "TotoAdmin2026!";
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

    // Si no se especificó un usuario o es "admin", validamos con el password general
    const isDefaultAdmin = !usernameOrEmail || usernameOrEmail.toLowerCase().trim() === "admin" || usernameOrEmail.toLowerCase().trim() === "juan.perez@inmobiliariatoto.com";
    if (isDefaultAdmin && verifyPassword(password, correctPassword)) {
      const cookieStore = await cookies();
      
      const userDetails = {
        name: "Juan Pérez",
        email: "juan.perez@inmobiliariatoto.com",
        username: "admin",
        avatar: ""
      };

      const sessionToken = generateSessionToken(SESSION_DURATION, userDetails);

      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_DURATION,
      });

      return NextResponse.json({ success: true, user: userDetails });
    }

    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor al intentar autenticar." },
      { status: 500 }
    );
  }
}
