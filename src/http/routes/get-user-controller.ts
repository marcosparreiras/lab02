import z from "zod";
import type { FastifyInstance } from "fastify";
import { GetUserUseCase } from "../../use-cases/get-user-use-case";

export async function getUserController(app: FastifyInstance) {
  app.get("/users/:id", async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string(),
    });
    const { id } = requestParamsSchema.parse(request.params);
    const getUserUseCase = new GetUserUseCase();
    const user = await getUserUseCase.execute({ userId: id });
    return reply.status(201).send({ user });
  });
}
