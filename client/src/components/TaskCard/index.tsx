import { priorityTranslations, statusTranslations } from "@/lib/utils";
import { Task } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type TaskCardProps = {
  task: Task;
};
const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
      {task.attachments && task.attachments.length > 0 && (
        <div>
          <strong>Anexos:</strong>
          <div className="flex flex-wrap">
            {task.attachments && task.attachments.length > 0 && (
              <Image
                src={`/${task.attachments[0].fileURL}`}
                alt={task.attachments[0].fileName}
                width={400}
                height={200}
                className="rounded-t-md"
              />
            )}
          </div>
        </div>
      )}

      <p>
        <strong>ID:</strong> {task.id}
      </p>
      <p>
        <strong>Título:</strong> {task.title}
      </p>
      <p>
        <strong>Descrição:</strong> {task.description || "Sem descrição"}
      </p>
      <p>
        <strong>Status:</strong> {statusTranslations[task.status || "-"]}
      </p>
      <p>
        <strong>Prioridade:</strong>{" "}
        {priorityTranslations[task.priority || "-"]}
      </p>
      <p>
        <strong>Tags:</strong> {task.tags || "Sem tags"}
      </p>
      <p>
        <strong>Data de Início:</strong>{" "}
        {task.startDate
          ? format(new Date(task.startDate), "dd/MM/yyyy")
          : "Não definido"}
      </p>
      <p>
        <strong>Data de Término:</strong>{" "}
        {task.dueDate
          ? format(new Date(task.dueDate), "dd/MM/yyyy")
          : "Não definido"}
      </p>
      <p>
        <strong>Autor:</strong> {task.author ? task.author.username : "Nenhum"}
      </p>
      <p>
        <strong>Responsável:</strong>{" "}
        {task.assignee ? task.assignee.username : "Nenhum"}
      </p>
    </div>
  );
};

export default TaskCard;
