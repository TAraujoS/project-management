import { Request, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";
import { NotFoundException } from "../exceptions/not-found";
// import { SignUpSchema } from "@/schema/users";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  // SignUpSchema.parse(req.body);
  const {
    username,
    profilePictureUrl = "i1.jpg",
    teamId = 1,
    email,
    password,
  } = req.body;

  let user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    throw new BadRequestException(
      "User already exists",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prisma.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      username,
      profilePictureUrl,
      teamId,
    },
  });

  res.json({ message: "User created successfully", user });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_SECRET as string
  );

  res.json({ user, token });
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
