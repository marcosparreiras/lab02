import type { UserRepository } from "../bondaries/user-repository";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { Registry } from "../registry/registry";

type Input = {
  userId: string;
};

type Output = {
  name: string;
  email: string;
  id: string;
};

export class GetUserUseCase {
  private userRepository: UserRepository;

  public constructor() {
    this.userRepository = Registry.getInstance().getUserRepository();
  }

  public async execute({ userId }: Input): Promise<Output> {
    const user = await this.userRepository.findById(userId);
    if (user === null) {
      throw new UserNotFoundException();
    }

    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
    };
  }
}
