import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
