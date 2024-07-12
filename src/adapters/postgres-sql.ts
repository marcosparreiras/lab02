import { Client } from "pg";
import type { Sql } from "./sql-user-repository";

export class PostgresSQL implements Sql {
  public constructor(private urlConnection: string) {}

  async query(instruction: string, params: any[]): Promise<any> {
    const client = new Client(this.urlConnection);
    await client.connect();
    const result = await client.query(instruction, params);
    await client.end();
    return result.rows;
  }
}
