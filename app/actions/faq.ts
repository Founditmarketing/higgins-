"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { checkAuth } from "./auth";
import seed from "../lib/faq-seed.json";

export type FaqItem = {
  id: string;
  grp: string;
  q: string;
  a: string;
  locked: boolean;
  position: number;
};

export type FaqGroup = { grp: string; items: FaqItem[] };

const SEED = (seed as Omit<FaqItem, "position">[]).map((s, i) => ({
  ...s,
  position: i,
}));
const GROUP_ORDER = [
  "General",
  "Criminal Defense",
  "Estate Planning & Successions",
  "Juvenile Law",
  "Personal Injury",
];

function toGroups(items: FaqItem[]): FaqGroup[] {
  const byGroup = new Map<string, FaqItem[]>();
  for (const g of GROUP_ORDER) byGroup.set(g, []);
  for (const it of items) {
    if (!byGroup.has(it.grp)) byGroup.set(it.grp, []);
    byGroup.get(it.grp)!.push(it);
  }
  return [...byGroup.entries()]
    .filter(([, items]) => items.length > 0)
    .map(([grp, items]) => ({
      grp,
      items: items.sort((a, b) => a.position - b.position),
    }));
}

/** Public: FAQ for the homepage. Falls back to the seed so the page never breaks. */
export async function getFaqs(): Promise<FaqGroup[]> {
  if (!process.env.POSTGRES_URL) return toGroups(SEED);
  try {
    const { rows } = await sql`SELECT * FROM faqs ORDER BY position ASC`;
    if (rows.length === 0) return toGroups(SEED);
    return toGroups(
      rows.map((r) => ({
        id: r.id,
        grp: r.grp,
        q: r.question,
        a: r.answer,
        locked: !!r.locked,
        position: r.position,
      }))
    );
  } catch {
    return toGroups(SEED);
  }
}

async function logChange(key: string, oldValue: string | null, newValue: string | null) {
  try {
    await sql`
      INSERT INTO site_history (id, key, old_value, new_value, changed_at)
      VALUES (${randomUUID()}, ${key}, ${oldValue}, ${newValue}, ${Date.now().toString()})
    `;
  } catch (e) {
    console.error("history log failed:", e);
  }
}

function clean(s: unknown, max: number): string {
  return String(s ?? "").trim().slice(0, max);
}

export async function addFaq(input: {
  grp: string;
  q: string;
  a: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.POSTGRES_URL) return { ok: false, error: "Database is not connected." };
  const grp = clean(input.grp, 100);
  const q = clean(input.q, 300);
  const a = clean(input.a, 2000);
  if (!GROUP_ORDER.includes(grp)) return { ok: false, error: "Unknown section." };
  if (!q || !a) return { ok: false, error: "Both a question and an answer are needed." };
  try {
    const { rows } = await sql`SELECT COALESCE(MAX(position), -1) AS m FROM faqs`;
    const id = `fq-${randomUUID().slice(0, 8)}`;
    await sql`
      INSERT INTO faqs (id, grp, question, answer, locked, position)
      VALUES (${id}, ${grp}, ${q}, ${a}, false, ${Number(rows[0].m) + 1})
    `;
    await logChange(`faq:${id}`, null, `${q} — added`);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("addFaq:", e);
    return { ok: false, error: "Could not add the question." };
  }
}

export async function updateFaq(input: {
  id: string;
  q: string;
  a: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.POSTGRES_URL) return { ok: false, error: "Database is not connected." };
  const q = clean(input.q, 300);
  const a = clean(input.a, 2000);
  if (!q || !a) return { ok: false, error: "Both a question and an answer are needed." };
  try {
    const { rows } = await sql`SELECT * FROM faqs WHERE id = ${input.id}`;
    if (!rows.length) return { ok: false, error: "Not found." };
    if (rows[0].locked)
      return { ok: false, error: "That answer carries required legal wording and is protected." };
    await sql`UPDATE faqs SET question = ${q}, answer = ${a} WHERE id = ${input.id}`;
    await logChange(`faq:${input.id}`, `${rows[0].question}\n${rows[0].answer}`, `${q}\n${a}`);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("updateFaq:", e);
    return { ok: false, error: "Could not save the change." };
  }
}

export async function deleteFaq(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.POSTGRES_URL) return { ok: false, error: "Database is not connected." };
  try {
    const { rows } = await sql`SELECT * FROM faqs WHERE id = ${id}`;
    if (!rows.length) return { ok: false, error: "Not found." };
    if (rows[0].locked)
      return { ok: false, error: "That answer carries required legal wording and is protected." };
    await sql`DELETE FROM faqs WHERE id = ${id}`;
    await logChange(`faq:${id}`, `${rows[0].question}\n${rows[0].answer}`, null);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("deleteFaq:", e);
    return { ok: false, error: "Could not remove it." };
  }
}

/** Swap position with the neighbor above or below, within the same section. */
export async function moveFaq(
  id: string,
  direction: "up" | "down"
): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.POSTGRES_URL) return { ok: false, error: "Database is not connected." };
  try {
    const { rows } = await sql`SELECT id, grp, position FROM faqs ORDER BY position ASC`;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return { ok: false, error: "Not found." };
    const grp = rows[idx].grp;
    let j = idx + (direction === "up" ? -1 : 1);
    while (j >= 0 && j < rows.length && rows[j].grp !== grp)
      j += direction === "up" ? -1 : 1;
    if (j < 0 || j >= rows.length) return { ok: true };
    const a = rows[idx], b = rows[j];
    await sql`UPDATE faqs SET position = ${b.position} WHERE id = ${a.id}`;
    await sql`UPDATE faqs SET position = ${a.position} WHERE id = ${b.id}`;
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("moveFaq:", e);
    return { ok: false, error: "Could not reorder." };
  }
}
