import { readFileSync } from "node:fs";
import { Client } from "pg";

const file = readFileSync("./database/user.sql");
console.log(file.toString());

async function migrate() {
  const file = readFileSync("./database/user.sql");
  const client = new Client("postgres://admin:admin@localhost:5432/my_db");
  await client.connect();
  await client.query(file.toString());
  await client.end();
  console.log("User table created ✅");
}

migrate();
