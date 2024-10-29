import { Task } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import PriorityTag from "../PriorityTag";

type TaskCardProps = {
  task: Task;
};
const TaskCard = ({ task }: TaskCardProps) => {
  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "dd/MM/yyyy")
    : "";

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "dd/MM/yyyy")
    : "";

  return (
    <div className="mb-4 h-fit min-w-[280px] rounded-md bg-white shadow dark:bg-dark-secondary">
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`https://pm-s3-th-images.s3.us-east-1.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="mb-3 flex justify-between">
          <h4 className="text-lg font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
        </div>

        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-base text-gray-600 dark:text-neutral-500">
          <strong>Período: </strong>
          {formattedStartDate && <span>{formattedStartDate}</span>}
          {formattedDueDate && <span> - {formattedDueDate}</span>}
        </div>

        <p className="my-2 text-base text-gray-600 dark:text-neutral-500">
          <strong>Descrição:</strong> {task.description}
        </p>

        <p className="text-base text-gray-600 dark:text-neutral-500">
          <strong>Projeto:</strong> {task.project.name} - {task.projectId}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col overflow-hidden">
            <p className="flex items-center gap-2">
              <strong>Autor:</strong>{" "}
              {task.author && (
                <Image
                  key={task.author.userId}
                  src={`https://pm-s3-th-images.s3.us-east-1.amazonaws.com/${task.author.profilePictureUrl!}`}
                  alt={task.author.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
              {task.author ? task.author.username : "Nenhum"}
            </p>{" "}
            <p className="flex items-center gap-2">
              <strong>Responsável:</strong>{" "}
              {task.assignee && (
                <Image
                  key={task.assignee.userId}
                  src={`https://pm-s3-th-images.s3.us-east-1.amazonaws.com/${task.assignee.profilePictureUrl!}`}
                  alt={task.assignee.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
              {task.assignee ? task.assignee.username : "Nenhum"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
