import { DomainException } from "./domain-exception";

export class UserAlreadyExistsException extends DomainException {
  public constructor() {
    super("User already exists exception");
  }
}
