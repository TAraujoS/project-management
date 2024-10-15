import React from "react";

type EmptyTasksProps = {
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
const EmptyTasks = ({ setIsModalNewTaskOpen }: EmptyTasksProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-4 pb-5 pt-1">
      <p className="text-lg font-semibold dark:text-white">
        Este projeto ainda não possui tarefas.
      </p>
      <button
        className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
        onClick={() => setIsModalNewTaskOpen(true)}
      >
        Adicionar Nova Tarefa
      </button>
    </div>
  );
};

export default EmptyTasks;
