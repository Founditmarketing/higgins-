"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

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

// Map database row to AppEvent
function mapRowToEvent(row: any): AppEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.date_str || undefined,
    description: row.description,
    type: row.type,
    mediaUrl: row.media_url || undefined,
    mediaType: row.media_type || undefined,
    createdAt: parseInt(row.created_at, 10),
  };
}

export async function getEvents(): Promise<AppEvent[]> {
  if (!process.env.POSTGRES_URL) {
    console.warn("POSTGRES_URL is missing. Returning empty events array.");
    return [];
  }

  try {
    const { rows } = await sql`SELECT * FROM events`;
    return rows.map(mapRowToEvent);
  } catch (error: any) {
    console.error("Database Error:", error);
    // Return empty array if table doesn't exist yet to prevent crashes
    if (error.message?.includes('relation "events" does not exist')) {
      return [];
    }
    throw new Error("Failed to fetch events from the database.");
  }
}

export async function addEvent(event: Omit<AppEvent, "id" | "createdAt">): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Vercel Postgres is not connected. Please create a database in Vercel.");
  }

  const id = crypto.randomUUID();
  const createdAt = Date.now().toString();

  try {
    await sql`
      INSERT INTO events (id, title, date_str, description, type, media_url, media_type, created_at)
      VALUES (
        ${id}, 
        ${event.title}, 
        ${event.date || null}, 
        ${event.description}, 
        ${event.type}, 
        ${event.mediaUrl || null}, 
        ${event.mediaType || null}, 
        ${createdAt}
      )
    `;
    revalidatePath("/updates");
    revalidatePath("/admin");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add event to the database.");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Vercel Postgres is not connected. Please create a database in Vercel.");
  }

  try {
    await sql`DELETE FROM events WHERE id = ${id}`;
    revalidatePath("/updates");
    revalidatePath("/admin");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete event from the database.");
  }
}
