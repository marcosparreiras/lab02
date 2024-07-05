import z from "zod";
import type { FastifyInstance } from "fastify";
import { CreateUserUseCase } from "../../use-cases/create-user-use-case";

export async function createUserController(app: FastifyInstance) {
  app.post("/users", async (request, reply) => {
    const requestBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    });
    const { email, name } = requestBodySchema.parse(request.body);
    const createUserUseCase = new CreateUserUseCase();
    const { userId } = await createUserUseCase.execute({ name, email });
    return reply.status(201).send({ userId });
  });
}
