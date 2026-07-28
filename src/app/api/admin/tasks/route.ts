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

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const tasks = readTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const session = getSessionPayload(token);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { title, description, priority, assignedTo, dueDate, propertySlug } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const tasks = readTasks();
    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description ? description.trim() : "",
      status: "PENDING", // PENDING, IN_PROGRESS, COMPLETED, POSTPONED, SUSPENDED
      priority: priority || "MEDIUM", // LOW, MEDIUM, HIGH
      assignedTo: assignedTo || "admin",
      createdBy: session.user?.username || "admin",
      dueDate: dueDate || null,
      propertySlug: propertySlug || null,
      completedAt: null,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    writeTasks(tasks);

    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
