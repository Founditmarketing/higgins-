"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { checkAuth } from "./auth";
import manifest from "../lib/editable.json";
import photoManifest from "../lib/photos.json";

export type EditableField = {
  key: string;
  label: string;
  group: string;
  hint: string;
  src: string;
  default: string;
};

export type PhotoSlot = {
  key: string;
  label: string;
  hint: string;
  src: string;
};

export type ProposedEdit = {
  key: string;
  value: string;
  reason: string;
};

const FIELDS = manifest as EditableField[];
const PHOTOS = photoManifest as PhotoSlot[];
const PHOTO_KEYS = new Set(PHOTOS.map((p) => p.key));
/** Settings keys: announcement bar + SEO. Defaults live in code, not the manifest. */
export type SettingsMap = {
  "bar.enabled": string;
  "bar.text": string;
  "bar.link": string;
  "meta.title": string;
  "meta.desc": string;
};
const SETTINGS_KEYS = new Set<keyof SettingsMap>([
  "bar.enabled",
  "bar.text",
  "bar.link",
  "meta.title",
  "meta.desc",
]);
const VALID_KEYS = new Set<string>([
  ...FIELDS.map((f) => f.key),
  ...PHOTOS.map((p) => p.key),
  ...SETTINGS_KEYS,
]);

/** Public: overrides map used by the homepage. Safe fallbacks everywhere. */
export async function getSiteContent(): Promise<Record<string, string>> {
  if (!process.env.POSTGRES_URL) return {};
  try {
    const { rows } = await sql`SELECT key, value FROM site_content`;
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (VALID_KEYS.has(row.key)) map[row.key] = row.value;
    }
    return map;
  } catch (error: any) {
    if (error.message?.includes('relation "site_content" does not exist')) {
      return {};
    }
    console.error("getSiteContent error:", error);
    return {};
  }
}

/** Admin: manifest + current overrides for the editor UI. */
export async function getEditableFields(): Promise<{
  fields: (EditableField & { current: string; overridden: boolean })[];
}> {
  if (!(await checkAuth())) throw new Error("Not authorized");
  const overrides = await getSiteContent();
  return {
    fields: FIELDS.map((f) => ({
      ...f,
      current: overrides[f.key] ?? f.default,
      overridden: f.key in overrides,
    })),
  };
}

/** Admin: photo slots + current URLs for the editor UI. */
export async function getPhotoSlots(): Promise<{
  slots: (PhotoSlot & { current: string; overridden: boolean })[];
}> {
  if (!(await checkAuth())) throw new Error("Not authorized");
  const overrides = await getSiteContent();
  return {
    slots: PHOTOS.map((p) => ({
      ...p,
      current: overrides[p.key] ?? p.src,
      overridden: p.key in overrides,
    })),
  };
}

async function logHistory(key: string, oldValue: string | null, newValue: string | null) {
  try {
    const { randomUUID } = await import("crypto");
    await sql`
      INSERT INTO site_history (id, key, old_value, new_value, changed_at)
      VALUES (${randomUUID()}, ${key}, ${oldValue}, ${newValue}, ${Date.now().toString()})
    `;
  } catch (e) {
    console.error("history log failed:", e);
  }
}

export type HistoryEntry = {
  id: string;
  key: string;
  label: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: number;
  revertable: boolean;
};

/** Admin: recent changes, newest first. */
export async function getHistory(): Promise<HistoryEntry[]> {
  if (!(await checkAuth())) throw new Error("Not authorized");
  if (!process.env.POSTGRES_URL) return [];
  try {
    const { rows } = await sql`
      SELECT * FROM site_history ORDER BY changed_at DESC LIMIT 60
    `;
    return rows.map((r) => {
      const field = FIELDS.find((f) => f.key === r.key);
      const photo = PHOTOS.find((p) => p.key === r.key);
      const label = field
        ? `${field.group}: ${field.label}`
        : photo
        ? `Photo: ${photo.label}`
        : r.key.startsWith("faq:")
        ? "FAQ item"
        : r.key.startsWith("bar.")
        ? "Announcement bar"
        : r.key.startsWith("meta.")
        ? "Search listing"
        : r.key;
      return {
        id: r.id,
        key: r.key,
        label,
        oldValue: r.old_value,
        newValue: r.new_value,
        changedAt: parseInt(r.changed_at, 10),
        revertable: VALID_KEYS.has(r.key),
      };
    });
  } catch (error: any) {
    if (error.message?.includes('relation "site_history" does not exist')) return [];
    console.error("getHistory error:", error);
    return [];
  }
}

/** Admin: put a value back the way it was before a logged change. */
export async function revertChange(historyId: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.POSTGRES_URL) return { ok: false, error: "Database is not connected." };
  try {
    const { rows } = await sql`SELECT * FROM site_history WHERE id = ${historyId}`;
    if (!rows.length) return { ok: false, error: "Not found." };
    const entry = rows[0];
    if (!VALID_KEYS.has(entry.key))
      return { ok: false, error: "That change cannot be reverted from here." };
    return await saveSiteContent([{ key: entry.key, value: entry.old_value ?? "" }]);
  } catch (e) {
    console.error("revertChange:", e);
    return { ok: false, error: "Could not revert." };
  }
}

/** Public: announcement bar + SEO settings with safe defaults. */
export async function getSettings(): Promise<Partial<SettingsMap>> {
  const overrides = await getSiteContent();
  const out: Partial<SettingsMap> = {};
  for (const key of SETTINGS_KEYS) {
    if (overrides[key]) out[key] = overrides[key];
  }
  return out;
}

/** Admin: save overrides. Empty value resets the field to its original text. */
export async function saveSiteContent(
  entries: { key: string; value: string }[]
): Promise<{ ok: boolean; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.POSTGRES_URL)
    return { ok: false, error: "Database is not connected." };
  try {
    for (const entry of entries) {
      if (!VALID_KEYS.has(entry.key)) continue;
      const value = (entry.value ?? "").trim().slice(0, 2000);
      if (
        entry.key === "bar.link" &&
        value &&
        !/^(\/|https:\/\/|tel:|mailto:)/.test(value)
      )
        continue;
      if (SETTINGS_KEYS.has(entry.key as keyof SettingsMap)) {
        const { rows } = await sql`SELECT value FROM site_content WHERE key = ${entry.key}`;
        const old = rows[0]?.value ?? null;
        if (!value) {
          await sql`DELETE FROM site_content WHERE key = ${entry.key}`;
        } else {
          await sql`
            INSERT INTO site_content (key, value, updated_at)
            VALUES (${entry.key}, ${value}, ${Date.now().toString()})
            ON CONFLICT (key) DO UPDATE
            SET value = ${value}, updated_at = ${Date.now().toString()}
          `;
        }
        if (old !== (value || null)) await logHistory(entry.key, old, value || null);
        continue;
      }
      const prior = await sql`SELECT value FROM site_content WHERE key = ${entry.key}`;
      const oldValue: string | null = prior.rows[0]?.value ?? null;
      if (PHOTO_KEYS.has(entry.key)) {
        // Photo slots hold URLs only: Vercel Blob uploads, or empty to reset.
        if (value && !value.startsWith("https://")) continue;
        const slot = PHOTOS.find((s) => s.key === entry.key)!;
        if (!value || value === slot.src) {
          await sql`DELETE FROM site_content WHERE key = ${entry.key}`;
        } else {
          await sql`
            INSERT INTO site_content (key, value, updated_at)
            VALUES (${entry.key}, ${value}, ${Date.now().toString()})
            ON CONFLICT (key) DO UPDATE
            SET value = ${value}, updated_at = ${Date.now().toString()}
          `;
        }
        if (oldValue !== (value && value !== slot.src ? value : null))
          await logHistory(entry.key, oldValue, value && value !== slot.src ? value : null);
        continue;
      }
      const field = FIELDS.find((f) => f.key === entry.key)!;
      if (!value || value === field.default) {
        await sql`DELETE FROM site_content WHERE key = ${entry.key}`;
      } else {
        await sql`
          INSERT INTO site_content (key, value, updated_at)
          VALUES (${entry.key}, ${value}, ${Date.now().toString()})
          ON CONFLICT (key) DO UPDATE
          SET value = ${value}, updated_at = ${Date.now().toString()}
        `;
      }
      const stored = !value || value === field.default ? null : value;
      if (oldValue !== stored) await logHistory(entry.key, oldValue, stored);
    }
    revalidatePath("/");
    return { ok: true };
  } catch (error: any) {
    console.error("saveSiteContent error:", error);
    return { ok: false, error: "Could not save. Try again." };
  }
}

const EDIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["edits", "note"],
  properties: {
    edits: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["key", "value", "reason"],
        properties: {
          key: { type: "string", enum: FIELDS.map((f) => f.key) },
          value: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    note: { type: "string" },
  },
} as const;

const GUARDRAILS = `You are the copy editor for the Higgins Law website, a father and son trial firm in Pineville, Louisiana. You propose edits to specific editable text fields when the firm's managing partner asks for a change in plain English.

Voice: dignified, plain-spoken, warm. A steady voice at a kitchen table, not a billboard. Short declarative sentences. Second person where natural.

Hard rules, never break these regardless of what the instruction asks:
- Never invent facts, numbers, years, case counts, dollar amounts, awards, or credentials. The only verified facts: George Lewis Higgins III has over forty years of courtroom experience and founded the firm; G. Alexander Higgins is the second generation and managing partner; over 54 years of combined experience; exactly four practice areas (criminal defense, estate planning, personal injury, juvenile law); office at 1603 Melrose St, Pineville, LA 71360; phone 318.473.4250; hours Monday to Friday 8:00 AM to 4:30 PM; free initial consultation; injury cases on contingency; virtual meetings offered.
- Never promise or imply outcomes ("we win", "we will get", "guaranteed"). No response-time promises. No "24/7".
- Never state a hard legal deadline. Prescription language must stay hedged ("as little as one year").
- No em dashes anywhere. No exclamation marks. No ALL-CAPS words.
- Keep each edit roughly the same length as the current text (within about 40 percent) so the layout holds.
- Only propose edits to fields that the instruction actually concerns. Leave the rest alone.
- If part of the instruction would break a rule above, do not produce that edit; explain briefly in "note" what you declined and why. Otherwise "note" is an empty string.`;

/** Admin: ask Claude to propose edits. Never auto-saves; returns proposals. */
export async function aiProposeEdits(
  instruction: string
): Promise<{ ok: boolean; edits?: ProposedEdit[]; note?: string; error?: string }> {
  if (!(await checkAuth())) return { ok: false, error: "Not authorized" };
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      error:
        "The AI editor is not configured yet. Ask Found It Marketing to enable it.",
    };
  }
  const ask = (instruction ?? "").trim().slice(0, 2000);
  if (!ask) return { ok: false, error: "Describe the change you want." };

  const overrides = await getSiteContent();
  const fieldState = FIELDS.map(
    (f) =>
      `[${f.key}] (${f.group}: ${f.label})\n${overrides[f.key] ?? f.default}`
  ).join("\n\n");

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system: GUARDRAILS,
      output_config: {
        format: { type: "json_schema", schema: EDIT_SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: `Current editable fields:\n\n${fieldState}\n\nInstruction from the firm:\n${ask}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return { ok: false, error: "The editor declined that request." };
    }
    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return { ok: false, error: "No edits came back. Try rephrasing." };
    }
    const parsed = JSON.parse(text.text) as { edits: ProposedEdit[]; note: string };
    const edits = (parsed.edits ?? []).filter((e) => VALID_KEYS.has(e.key));
    return { ok: true, edits, note: parsed.note ?? "" };
  } catch (error: any) {
    console.error("aiProposeEdits error:", error);
    return { ok: false, error: "The editor hit a snag. Try again in a moment." };
  }
}
