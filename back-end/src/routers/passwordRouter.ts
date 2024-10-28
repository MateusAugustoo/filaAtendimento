import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { TPass } from "../types/TPass";
import {
  createPassword,
  deletePassword,
  getPasswords,
  updateStatus,
} from "../services/passwordService";
import { PasswordStatus } from "@prisma/client";
import { broadcastCalledPassword, broadcastSincQueue } from "../services/webSocketService";

export async function passwordRouter(fastify: FastifyInstance) {
  fastify.post(
    "/create-password",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = request.body as TPass;
        const pass = await createPassword(data);

        reply.code(200).send(pass);
      } catch (err) {}
    }
  );

  fastify.get(
    "/get-passwords",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const passwords = await getPasswords();
        reply.code(200).send(passwords);
      } catch (err) {}
    }
  );

  fastify.delete(
    "/delete-password/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const pass = await deletePassword(Number(id));

        broadcastSincQueue(pass);

        if (!pass)
          return reply.code(404).send({ message: "Senha não encontrada" });

        reply.code(200).send(pass);
      } catch (err) {}
    }
  );

  fastify.put(
    "/update-status/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const { status, guiche, userId } = request.body as { status: string, guiche: number, userId: number };
        const pass = await updateStatus(Number(id), status as PasswordStatus);

        console.log(guiche);

        if (status === "C") {
          broadcastCalledPassword(pass.password, guiche);
        }
        console.log('esse é o id do user: ', userId)
        broadcastSincQueue(pass);

        reply.code(200).send(pass);
      } catch (error) {}
    }
  );
}
