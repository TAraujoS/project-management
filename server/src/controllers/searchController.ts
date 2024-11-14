import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search tasks, projects, and users based on a query
 *     security:
 *       - bearerAuth: []  # Indica que a rota requer autenticação
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Search query string
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results containing tasks, projects, and users
 */

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
      include: {
        attachments: true,
        author: true,
        assignee: true,
        project: true,
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
      include: {
        tasks: true,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query as string } }],
      },
    });

    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};
