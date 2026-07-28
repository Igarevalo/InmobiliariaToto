import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionPayload } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: session.user || {
        name: "Juan Pérez",
        email: "juan.perez@inmobiliariatoto.com",
        username: "admin",
        avatar: ""
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor al verificar sesión." },
      { status: 500 }
    );
  }
}
