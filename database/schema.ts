import postgres from "postgres";

async function migrate() {
  const sql = postgres("postgres://admin:admin@localhost:5432/my_db");
  await sql`
  CREATE TABLE IF NOT EXISTS users(
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
  )
  `;
  console.log("User table created ✅");
  await sql.end();
}

migrate();
