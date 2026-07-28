import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSessionPayload, hashPassword } from "@/lib/auth";

const CONFIG_PATH = path.join(process.cwd(), "admin_config.json");
const ADMINS_PATH = path.join(process.cwd(), "admin_users.json");

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);
    
    if (!session) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Hashear la contraseña antes de guardarla
    const passwordHash = hashPassword(newPassword);

    // 1. Si existe admin_users.json, actualizar el usuario correspondiente
    if (fs.existsSync(ADMINS_PATH)) {
      try {
        const admins = JSON.parse(fs.readFileSync(ADMINS_PATH, "utf-8"));
        const username = session.user?.username || "admin";
        
        const userIndex = admins.findIndex((u: any) => u.username.toLowerCase() === username.toLowerCase());
        
        if (userIndex !== -1) {
          admins[userIndex].password = passwordHash;
          fs.writeFileSync(ADMINS_PATH, JSON.stringify(admins, null, 2), "utf-8");
          return NextResponse.json({ success: true });
        }
      } catch (e) {
        console.error("Error al actualizar contraseña en admin_users.json:", e);
      }
    }

    // 2. Fallback a admin_config.json
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify({ password: passwordHash }, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor al intentar cambiar la contraseña." },
      { status: 500 }
    );
  }
}
