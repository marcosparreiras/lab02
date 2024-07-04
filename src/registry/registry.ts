import type { UserRepository } from "../bondaries/user-repository";
import { UserRepositoryNotRegisteredException } from "../exceptions/user-repository-not-registered-exception";

interface Registries {
  userRepository: UserRepository | null;
}

export class Registry {
  private registries: Registries;
  private static instance: Registry;

  private constructor() {
    this.registries = {
      userRepository: null,
    };
  }

  public static getInstance(): Registry {
    if (!this.instance) {
      this.instance = new Registry();
    }
    return this.instance;
  }

  public setUserRepository(userRepository: UserRepository): void {
    this.registries.userRepository = userRepository;
  }

  public getUserRepository(): UserRepository {
    if (!this.registries.userRepository) {
      throw new UserRepositoryNotRegisteredException();
    }
    return this.registries.userRepository;
  }
}
