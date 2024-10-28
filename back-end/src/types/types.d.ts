// types.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user?: string | JwtPayload;
  }
}