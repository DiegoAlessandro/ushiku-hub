const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const { superEnrich } = require("./ai-editor");

dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

async function rescanAll() {
    console.log("🚀 Rescanning all data to apply Task #3 & #4 (Metadata Extraction)...");
    const stores = await sql`SELECT id, name, content FROM stores WHERE is_published = true`;
    
    for (const store of stores) {
        await superEnrich(store.id, store.name, store.content);
    }
    console.log("🏁 Rescan complete.");
    process.exit(0);
}

rescanAll();
