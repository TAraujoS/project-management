import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 *  @swagger
 *  /tasks:
 *    post:
 *     tags:
 *       - Tasks
 *      summary: Create a new task
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                status:
 *                  type: string
 *                priority:
 *                  type: string
 *                tags:
 *                  type: array
 *                  items:
 *                    type: string
 *                startDate:
 *                  type: string
 *                  format: date
 *                dueDate:
 *                  type: string
 *                  format: date
 *                points:
 *                  type: integer
 *                projectId:
 *                  type: integer
 *                authorUserId:
 *                  type: integer
 *                assignedUserId:
 *                  type: integer
 *      responses:
 *        201:
 *          description: Task created successfully
 *        500:
 *          description: Error creating a task
 */

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Retrieve all tasks for a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: query
 *         required: false
 *         description: ID of the project to filter tasks
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of tasks
 *       500:
 *         description: Error retrieving tasks
 */

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
        project: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

/**
 * @swagger
 * /tasks/{taskId}/status:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update the status of a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       500:
 *         description: Error updating task status
 */

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status,
      },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating task status: ${error.message}` });
  }
};

/**
 * @swagger
 * /tasks/user/{userId}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Retrieve tasks for a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to filter tasks
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of user's tasks
 *       500:
 *         description: Error retrieving user's tasks
 */

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
        project: true,
      },
    });
    res.json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user's tasks: ${error.message}` });
  }
};

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Error deleting task
 */

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });
    res.json(deletedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting task: ${error.message}` });
  }
};
