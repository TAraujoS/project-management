"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import ModalNewTask from "@/components/ModalNewTask";
import TaskCard from "@/components/TaskCard";
import {
  dataGridClassNames,
  dataGridSxStyles,
  priorityTranslations,
  statusTranslations,
} from "@/lib/utils";
import { useGetAuthUserQuery, useGetTasksByUserQuery } from "@/state/api";
import { Priority, Task } from "@/types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useState } from "react";

type PriorityProps = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Título",
    width: 100,
  },
  {
    field: "description",
    headerName: "Descrição",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {statusTranslations[params.value]}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Prioridade",
    width: 75,
    renderCell: (params) => priorityTranslations[params.value],
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Data de Início",
    width: 130,
    renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
  },
  {
    field: "dueDate",
    headerName: "Data de Término",
    width: 130,
    renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
  },
  {
    field: "author",
    headerName: "Autor",
    width: 150,
    renderCell: (params) => params.value?.author || "Nenhum",
  },
  {
    field: "assignee",
    headerName: "Responsável",
    width: 150,
    renderCell: (params) => params.value?.assignee || "Nenhum",
  },
];

const ReusablePriorityPage = ({ priority }: PriorityProps) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: currentUser } = useGetAuthUserQuery({});
  const userId = currentUser?.userDetails?.userId ?? null;
  const {
    data: tasks,
    isLoading,
    isError: isTaskError,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: userId === null,
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority,
  );

  if (isTaskError || !tasks)
    return <div>An Error ocurred while fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Prioridade"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Adicionar Tarefa
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === "list" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("list")}
        >
          Lista
        </button>
        <button
          className={`px-4 py-2 ${
            view === "table" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("table")}
        >
          Tabela
        </button>
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTasks && (
          <div className="z-0 w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
