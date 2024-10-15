import Header from "@/components/Header";
import { useGetTasksQuery } from "@/state/api";
import { Task } from "@/types";
import React from "react";
import TaskCard from "@/components/TaskCard";
import { PlusSquare } from "lucide-react";
import EmptyTasks from "@/components/EmptyTasks";

type ListProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: ListProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An Error ocurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Lista"
          isSmallText
          buttonComponent={
            tasks &&
            tasks.length > 0 && (
              <button
                className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsModalNewTaskOpen(true)}
              >
                <PlusSquare className="mr-2 h-5 w-5" />
                Nova Tarefa
              </button>
            )
          }
        />
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
        </div>
      ) : (
        <EmptyTasks setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default ListView;
