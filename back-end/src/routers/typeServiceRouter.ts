import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TService } from "../types/TService";
import { deleteService, getServices, registerService } from "../services/typeServiceService";
import { broadcastSincQueue } from "../services/webSocketService";

export async function serviceRouter(fastify: FastifyInstance) {
  fastify.get(
    "/get-services",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await getServices();
      reply.status(200).send(result);
    }
  );

  fastify.post(
    "/register-service",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = request.body as TService;
      const result = await registerService(data);

      reply.status(200).send(result);
    }
  );

  fastify.delete(
    "/delete-service/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const pass = await deleteService(Number(id))

      broadcastSincQueue(pass);
      reply.status(200).send(pass);
    }
  );
}
