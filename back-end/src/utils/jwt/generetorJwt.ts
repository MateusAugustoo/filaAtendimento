import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function generateJWT(
  payload: { id: number; role: "admin" | "attendant" },
  signOptions: SignOptions = {}
) {
  return jwt.sign(payload, JWT_SECRET!, {
    ...signOptions,
  });
}

