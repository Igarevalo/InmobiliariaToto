import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "admin_config.json");

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isAuth = cookieStore.get("admin_session")?.value === "authenticated";
    
    if (!isAuth) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Guardar en admin_config.json en la raíz del proyecto
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify({ password: newPassword }, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor al intentar cambiar la contraseña." },
      { status: 500 }
    );
  }
}
