export class UserAlreadyExistsException extends Error {
  public constructor() {
    super("User already exists exception");
  }
}
