import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /teams:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Retrieve all teams with additional user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of teams with product owner and project manager usernames
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   teamId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   productOwnerUserId:
 *                     type: integer
 *                   projectManagerUserId:
 *                     type: integer
 *                   productOwnerUsername:
 *                     type: string
 *                   projectManagerUsername:
 *                     type: string
 *       500:
 *         description: Error retrieving teams
 */

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team) => {
        const productOwner = await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId! },
          select: { username: true },
        });

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );
    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};
