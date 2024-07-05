export class UserNotFoundException extends Error {
  public constructor() {
    super("User not found exception");
  }
}
