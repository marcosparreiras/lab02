import { DomainException } from "./domain-exception";

export class UserRepositoryNotRegisteredException extends DomainException {
  public constructor() {
    super("UserRepository not registered exception");
  }
}
