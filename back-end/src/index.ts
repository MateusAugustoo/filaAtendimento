import Fastify from "fastify";
import { authRouter } from "./routers/authRounter";
import cors from "@fastify/cors";
import WebsocketPlugin from "@fastify/websocket";
import { serviceRouter } from "./routers/typeServiceRouter";
import { passwordRouter } from "./routers/passwordRouter";
import { websocketRouter } from "./routers/webSocketRouter";

const fastify = Fastify({ logger: true });
const port = 3334

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
});
fastify.register(WebsocketPlugin)

fastify.register(authRouter);
fastify.register(serviceRouter)
fastify.register(passwordRouter)
fastify.register(websocketRouter)

fastify.get("/ping", async (request, reply) => {
  reply.send({ hello: "world" });
});

const start = async () => {
  try {
    await fastify.listen({host: "0.0.0.0", port: port });
    console.log(`server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();