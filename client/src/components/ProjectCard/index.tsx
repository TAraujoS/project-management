import React from "react";
import { Project } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="mb-3 cursor-pointer rounded border bg-white p-4 text-lg shadow hover:shadow-lg dark:bg-dark-secondary dark:text-white">
        <h3>
          <strong>Nome:</strong> {project.name}
        </h3>
        <p>
          <strong>Descrição: </strong> {project.description}
        </p>
        <p>
          <strong>Data de Início:</strong>{" "}
          {project.startDate
            ? format(new Date(project.startDate), "dd/MM/yyyy")
            : "Não definido"}
        </p>
        <p>
          <strong>Data de Término:</strong>{" "}
          {project.endDate
            ? format(new Date(project.endDate), "dd/MM/yyyy")
            : "Não definido"}
        </p>
        <p>
          <strong>Número de Tarefas:</strong>{" "}
          {project.tasks?.length ? project.tasks.length : 0}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
