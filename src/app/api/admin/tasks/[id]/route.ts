import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSessionPayload } from "@/lib/auth";

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

export async function PUT(
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

    const body = await req.json();
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t: any) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    const task = tasks[taskIndex];

    // Update fields
    if (body.title !== undefined) task.title = body.title.trim();
    if (body.description !== undefined) task.description = body.description.trim();
    if (body.priority !== undefined) task.priority = body.priority;
    if (body.assignedTo !== undefined) task.assignedTo = body.assignedTo;
    if (body.dueDate !== undefined) task.dueDate = body.dueDate;
    if (body.propertySlug !== undefined) task.propertySlug = body.propertySlug;
    
    if (body.status !== undefined) {
      const oldStatus = task.status;
      task.status = body.status;
      if (body.status === "COMPLETED" && oldStatus !== "COMPLETED") {
        task.completedAt = new Date().toISOString();
      } else if (body.status !== "COMPLETED") {
        task.completedAt = null;
      }
    }

    task.updatedAt = new Date().toISOString();
    tasks[taskIndex] = task;
    writeTasks(tasks);

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(
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

    const tasks = readTasks();
    const filteredTasks = tasks.filter((t: any) => t.id !== id);

    if (tasks.length === filteredTasks.length) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }

    writeTasks(filteredTasks);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
