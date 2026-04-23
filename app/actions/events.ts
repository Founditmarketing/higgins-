"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const dataPath = path.join(process.cwd(), "data", "events.json");

export type AppEvent = {
  id: string;
  title: string;
  date?: string; // YYYY-MM-DD
  description: string;
  type: "update" | "event";
  mediaUrl?: string;
  mediaType?: "image" | "video" | "document";
  createdAt: number;
};

// Initialize file if not exists
async function ensureFile() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, "[]", "utf-8");
  }
}

export async function getEvents(): Promise<AppEvent[]> {
  await ensureFile();
  const raw = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function addEvent(event: Omit<AppEvent, "id" | "createdAt">): Promise<void> {
  const events = await getEvents();
  const newEvent: AppEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  events.push(newEvent);
  // Sort chronically by date (or createdAt if no date)
  events.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : a.createdAt;
    const timeB = b.date ? new Date(b.date).getTime() : b.createdAt;
    return timeA - timeB;
  });
  await fs.writeFile(dataPath, JSON.stringify(events, null, 2));
  revalidatePath("/updates");
  revalidatePath("/admin");
}

export async function deleteEvent(id: string): Promise<void> {
  const events = await getEvents();
  const updated = events.filter((e) => e.id !== id);
  await fs.writeFile(dataPath, JSON.stringify(updated, null, 2));
  revalidatePath("/updates");
  revalidatePath("/admin");
}
