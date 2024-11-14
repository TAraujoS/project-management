import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Project created successfully
 *       500:
 *         description: Error creating a project
 */

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};

/**
 * @swagger
 * /projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Retrieve all projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all projects
 *       500:
 *         description: Failed to retrieve projects
 */

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to retrieve projects: ${error.message}` });
  }
};

/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: ID of the project to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       500:
 *         description: Failed to delete project
 */

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  try {
    const deletedProject = await prisma.project.delete({
      where: {
        id: Number(projectId),
      },
    });
    res.json(deletedProject);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Failed to delete project: ${error.message}` });
  }
};
