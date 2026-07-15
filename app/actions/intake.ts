"use server";

import { sql } from "@vercel/postgres";
import { randomUUID } from "crypto";
import { checkAuth } from "./auth";

export type Intake = {
  id: string;
  name: string;
  tel: string;
  email?: string;
  message?: string;
  createdAt: number;
  seen: boolean;
};

/** Public: consultation form submissions land here. */
export async function submitIntake(input: {
  name?: unknown;
  tel?: unknown;
  email?: unknown;
  message?: unknown;
}): Promise<{ ok: boolean }> {
  const name = String(input.name ?? "").trim().slice(0, 200);
  const tel = String(input.tel ?? "").trim().slice(0, 50);
  const email = String(input.email ?? "").trim().slice(0, 200);
  const message = String(input.message ?? "").trim().slice(0, 4000);

  if (!name || !tel) return { ok: false };
  if (!process.env.POSTGRES_URL) {
    console.warn("Intake received but POSTGRES_URL is missing:", { name, tel });
    return { ok: false };
  }
  try {
    await sql`
      INSERT INTO intakes (id, name, tel, email, message, created_at, seen)
      VALUES (${randomUUID()}, ${name}, ${tel}, ${email}, ${message}, ${Date.now().toString()}, false)
    `;
    return { ok: true };
  } catch (error) {
    console.error("submitIntake error:", error);
    return { ok: false };
  }
}

/** Admin: newest first. */
export async function getIntakes(): Promise<Intake[]> {
  if (!(await checkAuth())) throw new Error("Not authorized");
  if (!process.env.POSTGRES_URL) return [];
  try {
    const { rows } = await sql`
      SELECT * FROM intakes ORDER BY created_at DESC LIMIT 200
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      tel: r.tel,
      email: r.email || undefined,
      message: r.message || undefined,
      createdAt: parseInt(r.created_at, 10),
      seen: !!r.seen,
    }));
  } catch (error: any) {
    if (error.message?.includes('relation "intakes" does not exist')) return [];
    console.error("getIntakes error:", error);
    return [];
  }
}

export async function markIntakeSeen(
  id: string,
  seen: boolean
): Promise<{ ok: boolean }> {
  if (!(await checkAuth())) return { ok: false };
  if (!process.env.POSTGRES_URL) return { ok: false };
  try {
    await sql`UPDATE intakes SET seen = ${seen} WHERE id = ${id}`;
    return { ok: true };
  } catch (error) {
    console.error("markIntakeSeen error:", error);
    return { ok: false };
  }
}
