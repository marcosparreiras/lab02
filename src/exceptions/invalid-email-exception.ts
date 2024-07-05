import { DomainException } from "./domain-exception";

export class InvalidEmailException extends DomainException {
  public constructor() {
    super("Invalid email exception");
  }
}
