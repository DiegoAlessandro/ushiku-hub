const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

const databaseUrl = "postgresql://neondb_owner:npg_ZqUzkxCX4c5i@ep-solitary-fog-ainb6oba-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(databaseUrl);

async function initDb() {
  try {
    console.log("🚀 Initializing database...");
    
    // Create stores table
    await sql`
      CREATE TABLE IF NOT EXISTS stores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('food', 'beauty', 'shop', 'event', 'other')),
        source VARCHAR(50) NOT NULL CHECK (source IN ('instagram', 'twitter', 'web')),
        source_url TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        image_url TEXT,
        posted_at TIMESTAMP WITH TIME ZONE,
        collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        address TEXT,
        phone VARCHAR(50),
        instagram_account VARCHAR(255),
        is_published BOOLEAN DEFAULT true
      )
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_stores_collected_at ON stores(collected_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_stores_source ON stores(source)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_stores_is_published ON stores(is_published)`;
    
    console.log("✅ Database initialized successfully.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  } finally {
    process.exit(0);
  }
}

initDb();
