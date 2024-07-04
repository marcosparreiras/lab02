import type { UserRepository } from "../bondaries/user-repository";
import { User } from "../entities/user";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists-exception";
import { Registry } from "../registry/registry";

type Input = {
  name: string;
  email: string;
};

type Output = {
  userId: string;
};

export class CreateUserUseCase {
  private userRepository: UserRepository;

  public constructor() {
    this.userRepository = Registry.getInstance().getUserRepository();
  }

  public async execute({ name, email }: Input): Promise<Output> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);
    if (userAlreadyExists !== null) {
      throw new UserAlreadyExistsException();
    }
    const user = User.create(name, email);
    await this.userRepository.save(user);
    return { userId: user.getId() };
  }
}
