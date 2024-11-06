import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { TPass } from "../types/TPass";
import {
  createPassword,
  deletePassword,
  getPasswords,
  updateStatus,
} from "../services/passwordService";
import { PasswordStatus } from "@prisma/client";
import {
  broadcastCallAgain,
  broadcastCalledPassword,
  broadcastSincQueue,
} from "../services/webSocketService";
import { exec } from "child_process";
import path from "path";

export async function passwordRouter(fastify: FastifyInstance) {
  fastify.post(
    "/create-password",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = request.body as TPass;
        const pass = await createPassword(data);

        if ("password" in pass) {
          const scriptPath = path.join(__dirname, "..", "utils", "printer.py");

          exec(
            `python "${scriptPath}" ${pass.password}`,
            (err, stdout, stderr) => {
              if (err) {
                console.error("Erro ao executar o script Python:", err);
                return reply
                  .status(500)
                  .send({ message: "Erro ao imprimir a senha" });
              }

              if (stderr) {
                console.error("Erro no script Python:", stderr);
                return reply
                  .status(500)
                  .send({ message: "Erro no script Python" });
              }

              console.log("Script Python executado com sucesso:", stdout);
              return reply.send({
                message: "Senha gerada e impressa com sucesso",
                password: pass.password,
              });
            }
          );
        } else {
          return reply
            .status(400)
            .send({ message: "Senha não gerada corretamente" });
        }
      } catch (err) {
        console.error("Erro ao criar a senha:", err);
        return reply.status(500).send({ message: "Erro ao criar a senha" });
      }
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
        const { status, guiche, userId } = request.body as {
          status: string;
          guiche: number;
          userId: number;
        };
        const pass = await updateStatus(Number(id), status as PasswordStatus);

        console.log(guiche);

        if (status === "C") {
          broadcastCalledPassword(pass.password, guiche);
        }
        console.log("esse é o id do user: ", userId);
        broadcastSincQueue(pass);

        reply.code(200).send(pass);
      } catch (error) {}
    }
  );

  fastify.post(
    "/call-again",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { password, guiche } = request.body as {
          password: string;
          guiche: number;
        };

        broadcastCallAgain(password, guiche);
      } catch (error) {}
    }
  );
}
