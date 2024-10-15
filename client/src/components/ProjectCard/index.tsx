import { Project } from "@/types";
import { format } from "date-fns";
import React from "react";

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="mb-3 rounded border bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
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
    </div>
  );
};

export default ProjectCard;
