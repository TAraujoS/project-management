import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Error retrieving users
 */

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a single user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       500:
 *         description: Error retrieving user
 */

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: +userId,
      },
    });

    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

/**
 * @swagger
 * /users/{userId}
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       200:
 *         description: Updated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       500:
 *         description: Error updating user
 */

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { username, email } = req.body.user;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId: Number(userId),
      },
      data: {
        username,
        email,
      },
    });
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
};
