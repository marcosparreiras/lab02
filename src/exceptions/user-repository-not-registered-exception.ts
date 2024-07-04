export class UserRepositoryNotRegisteredException extends Error {
  public constructor() {
    super("UserRepository not registered exception");
  }
}
