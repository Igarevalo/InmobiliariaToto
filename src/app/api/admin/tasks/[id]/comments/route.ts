import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSessionPayload } from "@/lib/auth";
import crypto from "crypto";

const TASKS_PATH = path.join(process.cwd(), "admin_tasks.json");

function readTasks(): any[] {
  try {
    if (fs.existsSync(TASKS_PATH)) {
      return JSON.parse(fs.readFileSync(TASKS_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading tasks file:", e);
  }
  return [];
}

function writeTasks(tasks: any[]): void {
  try {
    fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing tasks file:", e);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "El contenido no puede estar vacío" }, { status: 400 });
    }

    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t: any) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    const newComment = {
      id: crypto.randomUUID(),
      author: session.user?.username || "admin",
      authorName: session.user?.name || "Juan Pérez",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!tasks[taskIndex].comments) {
      tasks[taskIndex].comments = [];
    }

    tasks[taskIndex].comments.push(newComment);
    tasks[taskIndex].updatedAt = new Date().toISOString();
    
    writeTasks(tasks);

    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
