"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/app/redux";
import { useGetProjectsQuery } from "@/state/api/projectsApi";
import { useGetTasksQuery } from "@/state/api/tasksApi";
import { Priority, Project, Task } from "@/types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { PlusSquare } from "lucide-react";
import ModalNewProject from "../projects/ModalNewProject";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Título", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Prioridade", width: 150 },
  { field: "dueDate", headerName: "Data Fim", width: 150 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: taskError,
  } = useGetTasksQuery({
    projectId: parseInt("1"),
  });
  const { data: projects, isLoading: projectLoading } = useGetProjectsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  if (tasksLoading || projectLoading) return <div>Loading...</div>;
  if (taskError || !tasks || !projects)
    return <div>An Error ocurred while fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completo" : "Ativo";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Dashboard - Gerenciamento de Projetos" />

      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Distribuição de prioridades de tarefas
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartColors.barGrid}
                />
                <XAxis dataKey="name" stroke={chartColors.text} />
                <YAxis stroke={chartColors.text} />
                <Tooltip
                  contentStyle={{
                    width: "min-content",
                    height: "min-content",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill={chartColors.bar} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Status Projetos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                  {projectStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Suas Tarefas
            </h3>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={tasks}
                columns={taskColumns}
                checkboxSelection
                loading={tasksLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Você ainda não possui nenhum Projeto criado.
          </h3>
          <button
            className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewProjectOpen(true)}
          >
            <PlusSquare className="mr-2 h-5 w-5" /> Criar Novo Projeto
          </button>

          <iframe
            width={500}
            height={500}
            src="https://lottie.host/embed/f1a8b120-9ab3-4957-ab3b-f713c3c9916a/pRodU2YQJA.json"
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
