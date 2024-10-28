import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  deleteAttendant,
  getAttendants,
  login,
  register,
  updateAttendant,
} from "../services/authService";
import { TAttendant, TLogin } from "../types/TAttendant";
import { broadcastCreatedAttendant } from "../services/webSocketService";
import { verifyJWT } from "../utils/jwt/verifyJwt";

export async function authRouter(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = request.body as TAttendant;
      console.log(data);

      try {
        const result = await register(data);
        console.log("resultado da criação do usuario: ", result);
        reply.send({ success: true, result });

        broadcastCreatedAttendant(data.name, data.cpf, data.role);
      } catch (error) {}
    }
  );

  fastify.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { property, password } = request.body as TLogin;

      const result = await login(property, password);

      reply.code(result!.status).send(result);
    }
  );

  fastify.get(
    "/get-attendants",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const attendants = await getAttendants();
        reply.code(200).send(attendants);
      } catch (error) {}
    }
  );

  fastify.put(
    "/update-attendants/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const { name, cpf, role, password } = request.body as {
        name?: string;
        cpf?: string;
        role?: string;
        password?: string;
      };

      try {
        const updatedAttendant = await updateAttendant(Number(id), {
          name,
          cpf,
          role,
          password,
        });
        return reply.code(200).send({
          message: "Atendente atualizado com sucesso",
          attendant: updatedAttendant,
        });
      } catch (error: Error | any) {
        if ((error as Error).message === "Atendente não encontrado") {
          return reply.status(404).send({ message: error.message });
        }
        console.error(error);
        return reply
          .status(500)
          .send({ message: "Erro ao atualizar atendente" });
      }
    }
  );

  fastify.delete('/delete-attendants/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      await deleteAttendant(Number(id));
      return reply.code(200).send({ message: 'Atendente excluído com sucesso' });
    } catch (error: Error | any) {
      if ((error as Error).message === 'Acesso negado') {
        return reply.status(403).send({ message: error.message });
      }
      console.error(error);
      return reply.status(500).send({ message: 'Erro ao excluir atendente' });
    }
  });
}
