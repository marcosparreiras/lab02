import { randomUUID } from "node:crypto";
import { InvalidEmailException } from "../exceptions/invalid-email-exception";

export class User {
  private id: string;
  private name: string;
  private email: string;

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  private constructor(id: string, name: string, email: string) {
    if (email.match(/^.*@.*$/) === null) {
      throw new InvalidEmailException();
    }

    this.id = id;
    this.name = name;
    this.email = email;
  }

  public static load(id: string, name: string, email: string): User {
    return new User(id, name, email);
  }

  public static create(name: string, email: string): User {
    const id = randomUUID();
    return new User(id, name, email);
  }
}
