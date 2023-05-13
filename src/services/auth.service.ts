import HttpException from "../httpExeption";
import { User } from "../models/user.model";
import prisma from "../utils/prismaClient";
import bcrypt from "bcryptjs";

const checkUserUniqueness = async (email: string): Promise<void> => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (!existingUserByEmail) return;

  throw new HttpException(422, {
    errors: {
      email: `${email} has already been taken`,
    },
  });
};

export const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  if (!name) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  await checkUserUniqueness(email);

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    ...user,
  };
};

export const login = async (email: string, password: string): Promise<User> => {
  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    throw new HttpException(403, {
      errors: "email is invalid",
    });

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match)
    throw new HttpException(403, {
      errors: "password is invalid",
    });

  return {
    ...user,
  };
};
