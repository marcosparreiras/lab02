import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { DomainException } from "../../exceptions/domain-exception";

export async function errorHandler(
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  {
    if (error instanceof DomainException) {
      return reply.status(400).send({ message: error.message });
    }
    if (error instanceof ZodError) {
      return reply.status(400).send({ message: error.format() });
    }
    return reply.status(500).send({ message: "Internal server error" });
  }
}
