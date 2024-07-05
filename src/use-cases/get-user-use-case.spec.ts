import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { User } from "../entities/user";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { Registry } from "../registry/registry";
import { GetUserUseCase } from "./get-user-use-case";

describe("GetUserUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let getUserUseCase: GetUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    Registry.getInstance().setUserRepository(userRepository);
    getUserUseCase = new GetUserUseCase();
  });

  it("Should be able to get a user by id", async () => {
    const user = User.create("John Doe", "johndoe@example.com");
    userRepository.items.push(user);

    const input = {
      userId: user.getId(),
    };

    const output = await getUserUseCase.execute(input);

    expect(output).toEqual(
      expect.objectContaining({
        name: user.getName(),
        email: user.getEmail(),
        id: user.getId(),
      })
    );
  });

  it("Should not be able to get an unregistered user", async () => {
    const input = {
      userId: "some-fake-id",
    };

    await expect(() => getUserUseCase.execute(input)).rejects.toBeInstanceOf(
      UserNotFoundException
    );
  });
});
