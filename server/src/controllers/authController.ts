import { Request, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";
import { NotFoundException } from "../exceptions/not-found";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { SignUpSchema } from "../schema/users";

const prisma = new PrismaClient();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               profilePictureUrl:
 *                 type: string
 *                 default: "i1.jpg"
 *               teamId:
 *                 type: integer
 *                 default: 1
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
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
/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Incorrect password
 */

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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get the authenticated user's information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information returned successfully
 */

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign out the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully signed out
 *       401:
 *         description: Invalid token or no token provided
 */

export const signout = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedException(
      "No token provided",
      ErrorCode.UNAUTHORIZED
    );
  }

  const revokedTokens = new Set<string>();
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);

    revokedTokens.add(token);

    res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
