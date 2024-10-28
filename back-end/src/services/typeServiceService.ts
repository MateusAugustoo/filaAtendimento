import { prisma } from "../prisma";
import { TService } from "../types/TService";
import { broadcastCreateService } from "./webSocketService";

export const registerService = async (data: TService) => {
  const type = data.typeService

  broadcastCreateService(type)

  return await prisma.service.create({
    data: {
      typeService: type
    },
  });
};

export const getServices = async () => {
  return await prisma.service.findMany();
};

export const deleteService = async (id: number) => {
  return await prisma.service.delete({
    where: { id },
  });
};
