import { prisma } from "../prisma";
import { TPass } from "../types/TPass";
import { broadcastDeletePassword, broadcastNewPassword } from "./webSocketService";
import { addHours } from "date-fns";
import { PasswordStatus } from "@prisma/client";

export const createPassword = async (data: TPass) => {
  const isExistingPassword = await prisma.password.findFirst({
    where: {
      password: data.password,
      status: data.status,
    },
  });

  if (isExistingPassword) {
    return {
      status: 400,
      message: "Password already exists",
    };
  }

  const currentDate = addHours(new Date(), -3);

  const newPassword = await prisma.password.create({
    data: {
      password: data.password,
      status: data.status,
      day: currentDate,
      service: data.typeService
        ? { connect: { typeService: data.typeService } }
        : undefined,
    },
  });

  broadcastNewPassword(newPassword);

  return newPassword;
};

export const getPasswords = async () => {
  return await prisma.password.findMany({
    include: { service: true },
  });
};

export const deletePassword = async (id: number) => {

  broadcastDeletePassword(id)

  return await prisma.password.delete({
    where: { id },
  });
};

export const updateStatus = async (id: number, status: PasswordStatus) => {
  return await prisma.password.update({
    where: { id },
    data: { status },
  });
};
