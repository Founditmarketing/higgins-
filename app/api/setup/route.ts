import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import faqSeed from "../../lib/faq-seed.json";

export async function GET() {
  try {
    // Create the events table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date_str VARCHAR(50),
        time_str VARCHAR(50),
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        media_url TEXT,
        media_type VARCHAR(50),
        created_at VARCHAR(50) NOT NULL
      );
    `;

    // Ensure the time_str column exists for older tables
    await sql`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS time_str VARCHAR(50);
    `;

    // Site content overrides (the Site Editor writes here)
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at VARCHAR(50) NOT NULL
      );
    `;

    // Consultation form submissions
    await sql`
      CREATE TABLE IF NOT EXISTS intakes (
        id UUID PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        tel VARCHAR(50) NOT NULL,
        email VARCHAR(200),
        message TEXT,
        created_at VARCHAR(50) NOT NULL,
        seen BOOLEAN NOT NULL DEFAULT false
      );
    `;

    // FAQ items, managed from the Site Editor
    await sql`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(40) PRIMARY KEY,
        grp VARCHAR(100) NOT NULL,
        question VARCHAR(400) NOT NULL,
        answer TEXT NOT NULL,
        locked BOOLEAN NOT NULL DEFAULT false,
        position INTEGER NOT NULL
      );
    `;

    // Change log for the Site Editor (text, photos, settings, FAQ)
    await sql`
      CREATE TABLE IF NOT EXISTS site_history (
        id UUID PRIMARY KEY,
        key VARCHAR(120) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_at VARCHAR(50) NOT NULL
      );
    `;

    // Seed the FAQ from the site's launch content, once
    const existing = await sql`SELECT COUNT(*)::int AS n FROM faqs`;
    let seeded = 0;
    if (existing.rows[0].n === 0) {
      for (let i = 0; i < (faqSeed as any[]).length; i++) {
        const it = (faqSeed as any[])[i];
        await sql`
          INSERT INTO faqs (id, grp, question, answer, locked, position)
          VALUES (${it.id}, ${it.grp}, ${it.q}, ${it.a}, ${it.locked}, ${i})
        `;
        seeded++;
      }
    }

    return NextResponse.json(
      {
        message: `Database initialized: events, site_content, intakes, faqs (${seeded} seeded), site_history.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database table." },
      { status: 500 }
    );
  }
}
