import { FastifyInstance } from "fastify";
import { WebSocket } from "@fastify/websocket";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

interface WebSocketClient {
  socket: WebSocket;
  userId?: number
}

const clients: WebSocketClient[] = [];

export const handleWebSocketConnection = (fastify: FastifyInstance) => {
  return (conn: WebSocket, req: any) => {
    // const userId = getUserIdFromRequest(req)
    
    clients.push({ socket: conn });
    console.log("clients connected:", clients.length);

    conn.on("close", () => {
      const index = clients.findIndex((clients) => clients.socket === conn);

      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
  };
};

// const getUserIdFromRequest = (req: any): number => {
//   const token = req.query.token;

//   if (!token) {
//     console.error("Token JWT não encontrado na requisição WebSocket.");
//     throw new Error("Não autorizado"); 
//   }

//   try {
//     const jwt = require('jsonwebtoken'); 
//     const decoded = jwt.verify(token, JWT_SECRET);
//     return decoded.id; 
//   } catch (err) {
//     console.error("Erro ao verificar o token JWT:", err);
//     throw new Error("Não autorizado"); 
//   }
// };

export const broadcastNewPassword = (newPassword: any) => {
  console.log("Broadcasting new password:", newPassword);
  clients.forEach((client) => {
    if (client.socket.readyState === client.socket.OPEN) {
      client.socket.send(
        JSON.stringify({ event: "new-password", data: newPassword })
      );
    }
  });
};

export const broadcastCalledPassword = (password: string, guiche: number) => {
  console.log("broadcast called password:", password, "guiche:", guiche);

  clients.forEach((client) => {
    if (client.socket.readyState === client.socket.OPEN) {
      client.socket.send(
        JSON.stringify({
          event: "called-password",
          data: {
            password: password,
            guiche: guiche,
          },
        })
      );
    }
  });
};

export const broadcastCreatedAttendant = (
  name: string,
  cpf: string,
  role: string
) => {
  clients.forEach((client) => {
    if (client.socket.readyState === client.socket.OPEN) {
      client.socket.send(
        JSON.stringify({
          event: "created-attendant",
          data: {
            name: name,
            cpf: cpf,
            role: role,
          },
        })
      );
    }
  });
};

export const broadcastCreateService = (typeService: string) => {
  clients.forEach((client) => {
    if (client.socket.readyState === client.socket.OPEN) {
      client.socket.send(
        JSON.stringify({
          event: "created-service",
          data: {
            typeService: typeService,
          },
        })
      );
    }
  });
};

export const broadcastSincQueue = (pass: any, userId?: number) => {
  clients.forEach((client) => {
    if (client.socket.readyState === client.socket.OPEN) {
      client.socket.send(
        JSON.stringify({
          event: "sinc-queue",
          data: { 
            day: pass.day,
            id: pass.id,
            password: pass.password,
            status: pass.status,
            typeService: pass.service?.typeService,
           }
        })
      )
    }
  })
}
