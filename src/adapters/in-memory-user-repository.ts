import type { UserRepository } from "../bondaries/user-repository";
import type { User } from "../entities/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.getId() === id);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.getEmail() === email);
    return user ?? null;
  }

  async save(user: User): Promise<void> {
    this.items.push(user);
  }
}
