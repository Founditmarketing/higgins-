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

    return NextResponse.json(
      { message: "Database table 'events' initialized successfully." },
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
