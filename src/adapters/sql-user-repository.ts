import type { UserRepository } from "../bondaries/user-repository";
import { User } from "../entities/user";
import postgres from "postgres";

export class SqlUserRepository implements UserRepository {
  private connectionUrl = "postgres://admin:admin@localhost:5432/my_db";

  async findById(id: string): Promise<User | null> {
    const sql = postgres(this.connectionUrl);
    const result = await sql`SELECT * FROM users WHERE id = ${id}`;
    sql.end();
    if (result.length === 0) {
      return null;
    }
    return User.load(result[0]["id"], result[0]["name"], result[0]["email"]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = postgres(this.connectionUrl);
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    sql.end();
    if (result.length === 0) {
      return null;
    }
    return User.load(result[0]["id"], result[0]["name"], result[0]["email"]);
  }

  async save(user: User): Promise<void> {
    const sql = postgres(this.connectionUrl);
    await sql`INSERT INTO users(id, name, email) VALUES(${user.getId()}, ${user.getName()}, ${user.getEmail()})`;
    sql.end();
  }
}
