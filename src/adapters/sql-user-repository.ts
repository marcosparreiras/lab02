import type { UserRepository } from "../bondaries/user-repository";
import { User } from "../entities/user";

export interface Sql {
  query(instruction: string, params: any[]): Promise<any>;
}

export class SqlUserRepository implements UserRepository {
  public constructor(readonly sql: Sql) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.sql.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (result.length === 0) {
      return null;
    }
    return User.load(result[0]["id"], result[0]["name"], result[0]["email"]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.sql.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.length === 0) {
      return null;
    }
    return User.load(result[0]["id"], result[0]["name"], result[0]["email"]);
  }

  async save(user: User): Promise<void> {
    await this.sql.query(
      "INSERT INTO users(id, name, email) VALUES($1, $2, $3)",
      [user.getId(), user.getName(), user.getEmail()]
    );
  }
}
