import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import {
  dataGridClassNames,
  dataGridSxStyles,
  priorityTranslations,
  statusTranslations,
} from "@/lib/utils";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { PlusSquare } from "lucide-react";
import React from "react";

type TableProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Título",
    width: 100,
  },
  {
    field: "description",
    headerName: "Descrição",
    width: 200,
    renderCell: (params) => params.value || "-",
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
    renderCell: (params) => params.value || "-",
  },
  {
    field: "startDate",
    headerName: "Data de Início",
    width: 130,
    renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
  },
  {
    field: "dueDate",
    headerName: "Data de Término",
    width: 130,
    renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy"),
  },
  {
    field: "autor",
    headerName: "Autor",
    width: 150,
    renderCell: (params) => params.value?.author || "Nenhum",
  },
  {
    field: "assignee",
    headerName: "Responsável",
    width: 150,
    renderCell: (params) => params.value?.assignee || "Sem Responsável",
  },
];
const TableView = ({ id, setIsModalNewTaskOpen }: TableProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An Error ocurred while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Tabela"
          isSmallText
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" />
              Nova Tarefa
            </button>
          }
        />
      </div>

      <DataGrid
        rows={tasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  );
};

export default TableView;
