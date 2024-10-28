import { FastifyInstance, FastifyReply } from 'fastify'
import { handleWebSocketConnection } from '../services/webSocketService'

export async function websocketRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/ws',
    handler: (_, reply: FastifyReply) => { reply.send({error: "Use websocket to connect"}) },
    wsHandler: (conn, req) => {
      handleWebSocketConnection(fastify)(conn, req)
    }
  })
}