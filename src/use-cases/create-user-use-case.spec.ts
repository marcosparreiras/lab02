import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { User } from "../entities/user";
import { InvalidEmailException } from "../exceptions/invalid-email-exception";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists-exception";
import { Registy } from "../registry/registry";
import { CreateUserUseCase } from "./create-user-use-case";

describe("CreateUserUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    Registy.getInstance().setUserRepository(userRepository);
    createUserUseCase = new CreateUserUseCase();
  });

  it("Should be able to create a user", async () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
    };

    const output = await createUserUseCase.execute(input);

    expect(output.userId).toBeTruthy();

    const userOnRepository = userRepository.items.find(
      (item) => item.getId() === output.userId
    );
    expect(userOnRepository).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    );
  });

  it("Should not be able to register a user with invalid email", async () => {
    const input = {
      name: "John Doe",
      email: "johndoe.com",
    };

    await expect(() => createUserUseCase.execute(input)).rejects.toBeInstanceOf(
      InvalidEmailException
    );
  });

  it("Should not be able to register a user with duplicated email", async () => {
    const email = "johndoe@example.com";
    const user = User.create("Jany Doe", email);
    userRepository.items.push(user);

    const input = {
      name: "John Doe",
      email,
    };

    await expect(() => createUserUseCase.execute(input)).rejects.toBeInstanceOf(
      UserAlreadyExistsException
    );
  });
});
