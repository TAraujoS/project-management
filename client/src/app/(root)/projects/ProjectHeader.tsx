import React, { useState } from "react";
import { useDeleteProjectMutation } from "@/state/api/projectsApi";
import Header from "@/components/Header";
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
  Trash2,
} from "lucide-react";
import ModalNewProject from "./ModalNewProject";
import { TabType } from "@/types";
import ModalDelete from "./ModalDelete";
import { useParams } from "next/navigation";

type ProjectHeaderProps = {
  activeTab: string;
  setActiveTab: (tabName: TabType) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: ProjectHeaderProps) => {
  const params = useParams();
  const [deleteProject] = useDeleteProjectMutation();
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [isModalDeleteProjectOpen, setIsModalDeleteProjectOpen] =
    useState(false);

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <ModalDelete
        isOpen={isModalDeleteProjectOpen}
        onClose={() => setIsModalDeleteProjectOpen(false)}
        name="Excluir Projeto"
        onDelete={() => {
          deleteProject(Number(params.id));
          setIsModalDeleteProjectOpen(false);
        }}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name="Desenvolvimento de Produto"
          buttonComponent={
            <div className="flex gap-3">
              <button
                className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsModalNewProjectOpen(true)}
              >
                <PlusSquare className="mr-2 h-5 w-5" /> Novo Projeto
              </button>
              <button
                className="flex items-center rounded-md bg-red-400 px-3 py-2 text-white hover:bg-red-600"
                onClick={() => setIsModalDeleteProjectOpen(true)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          }
        />
      </div>

      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name={TabType.Board}
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name={TabType.Timeline}
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name={TabType.Table}
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Filter className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar Tarefa"
              className="rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            />
            <Grid3x3 className="absolute left-3 top-2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: TabType;
  icon: React.ReactNode;
  setActiveTab: (tabName: TabType) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;