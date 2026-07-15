import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

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

    return NextResponse.json(
      {
        message:
          "Database tables 'events', 'site_content', and 'intakes' initialized successfully.",
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
