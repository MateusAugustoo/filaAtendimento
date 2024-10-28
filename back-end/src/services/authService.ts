import { prisma } from "../prisma";
import { TAttendant } from "../types/TAttendant";
import { checkPassword, hasPassword } from "../utils/bcrypt/bcrypt";
import { generateJWT } from "../utils/jwt/generetorJwt";

export const register = async (data: TAttendant) => {
  console.log("Dados recebidos:", data);

  const hashedPassword = await hasPassword(data.password);

  let service = null;
  if (data.typeService) {
    service = await prisma.service.findUnique({
      where: { typeService: data.typeService },
    });

    console.log("Serviço encontrado:", service);
  }

  if (data.typeService && !service) {
    return {
      success: false,
      message: "Serviço não encontrado",
    };
  }

  const attendant = await prisma.attendant.create({
    data: {
      name: data.name,
      cpf: data.cpf,
      password: hashedPassword,
      service: service ? { connect: { id: service.id } } : undefined,
      role: data.role,
    },
    include: { service: true },
  });

  console.log("Atendente criado:", attendant);

  return {
    success: true,
    result: {
      id: attendant.id,
      name: attendant.name,
      cpf: attendant.cpf,
      service: attendant.service
        ? {
            typeService: attendant.service.typeService,
          }
        : null,
    },
  };
};

export const login = async (property: string, password: string) => {
  try {
    const attendant = await prisma.attendant.findFirst({
      where: {
        OR: [{ name: property }, { cpf: property }],
      },
      include: {
        service: true,
      },
    });

    if (!attendant) {
      return {
        status: 404,
        message: "Atendente não encontrado",
      };
    }

    const isMatch = await checkPassword(password, attendant.password);

    if (!isMatch) {
      return {
        status: 401,
        message: "Senha incorreta",
      };
    }

    const role = attendant.role as "attendant" | "admin";

    const payload = {
      id: attendant.id,
      name: attendant.name,
      role,
    };

    const token = await generateJWT(payload);

    return {
      status: 200,
      user: {
        token,
        id: attendant.id,
        name: attendant.name,
        service: attendant.service
          ? {
              typeService: attendant.service.typeService,
            }
          : null,
        role,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Erro interno do servidor",
    };
  }
};

export const getAttendants = async () => {
  try {
    const attendants = await prisma.attendant.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        service: {
          select: {
            typeService: true,
          },
        },
      },
    });

    return attendants;
  } catch (error) {}
};

type UpdateAttendantData = {
  name?: string;
  cpf?: string;
  role?: string;
  password?: string;
};

export const updateAttendant = async (
  id: number,
  data: UpdateAttendantData
) => {
  try {
    const attendant = await prisma.attendant.findUnique({ where: { id } });
    if (!attendant) {
      throw new Error("Atendente não encontrado");
    }

    const updateAttendant = await prisma.attendant.update({
      where: { id },
      data: {
        ...data
      }
    })

    return updateAttendant
  } catch (error) {}
};

export const deleteAttendant = async (id: number) => {
  try {
    const attendant = await prisma.attendant.findUnique({ where: { id } });
    if (!attendant) {
      throw new Error("Atendente não encontrado");
    }

    await prisma.attendant.delete({ where: { id } });
  } catch (error) {}
};

export const logout = async () => {
  return {
    success: true,
  };
}