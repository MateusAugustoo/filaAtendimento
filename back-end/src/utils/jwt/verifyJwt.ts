import  jwt  from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";
const dotenv = require('dotenv')

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

interface UserPayload {
  id: number
  role: 'admin' | 'attendant'
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply, requiredRole?: 'admin' | 'attendant') {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as UserPayload

    if (requiredRole && decoded.role !== requiredRole) {
      return reply.status(403).send({ message: 'Acesso negado' });
    }
    request.user = decoded
  } catch (error) {
    return reply.status(401).send({ message: 'Token inválido' })
  }
}