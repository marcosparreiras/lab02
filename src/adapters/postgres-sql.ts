import { Client } from "pg";
import type { Sql } from "./sql-user-repository";

export class PostgresSQL implements Sql {
  async query(instruction: string, params: any[]): Promise<any> {
    const client = new Client("postgres://admin:admin@localhost:5432/my_db");
    await client.connect();
    const result = await client.query(instruction, params);
    await client.end();
    return result.rows;
  }
}
