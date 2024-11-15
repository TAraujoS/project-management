import React, { useState } from "react";
import { Task as TaskType } from "@/types";
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/state/api/tasksApi";
import {
  EllipsisVertical,
  MessageSquareMore,
  Plus,
  TrashIcon,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Image from "next/image";
import { statusTranslations } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";
import EmptyTasks from "@/components/EmptyTasks";
import ModalDelete from "../ModalDelete";
import PriorityTag from "@/components/PriorityTag";
import toast from "react-hot-toast";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading)
    return (
      <div className="flex px-4">
        <div className="flex flex-col justify-between gap-3 px-2 py-4">
          <Skeleton variant="rectangular" width={300} height={50} />
          <Skeleton variant="rectangular" width={300} height={185} />
        </div>
        <div className="flex flex-col justify-between gap-3 px-2 py-4">
          <Skeleton variant="rectangular" width={300} height={50} />
          <Skeleton variant="rectangular" width={300} height={185} />
        </div>
        <div className="flex flex-col justify-between gap-3 px-2 py-4">
          <Skeleton variant="rectangular" width={300} height={50} />
          <Skeleton variant="rectangular" width={300} height={185} />
        </div>
        <div className="flex flex-col justify-between gap-3 px-2 py-4">
          <Skeleton variant="rectangular" width={300} height={50} />
          <Skeleton variant="rectangular" width={300} height={185} />
        </div>
      </div>
    );

  if (error) return <div>An Error ocurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
      {!tasks?.length && (
        <EmptyTasks setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    "To Do": "#2563eb",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 xl-px-2 rounded-lg py-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {statusTranslations[status]}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

type TaskProps = {
  task: TaskType;
};

const Task = ({ task }: TaskProps) => {
  const [isModalCommentsOpen, setIsModalCommentsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isModalDeleteTaskOpen, setIsModalDeleteTaskOpen] = useState(false);
  const [deleteTask] = useDeleteTaskMutation();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "dd/MM/yyyy")
    : "";

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "dd/MM/yyyy")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  return (
    <>
      <ModalDelete
        isOpen={isModalDeleteTaskOpen}
        onClose={() => setIsModalDeleteTaskOpen(false)}
        name="Excluir Task"
        onDelete={() => {
          try {
            deleteTask({ taskId: Number(task.id) });
            toast.success("Task excluida com sucesso!");
          } catch (error) {
            toast.error("Erro ao excluir task");
          } finally {
            setIsModalDeleteTaskOpen(false);
          }
        }}
        isProject={false}
      />

      <div
        ref={(instance) => {
          drag(instance);
        }}
        className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? "opacity-50" : ""}`}
      >
        {task.attachments && task.attachments.length > 0 && (
          <Image
            src={`/${task.attachments[0].fileURL}`}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="h-auto w-full rounded-t-md"
          />
        )}
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between">
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
            <button
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setIsTaskMenuOpen(!isTaskMenuOpen);
              }}
              className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
            >
              <EllipsisVertical size={26} />
            </button>
            <Menu
              id="basic-menu"
              open={isTaskMenuOpen}
              anchorEl={anchorEl}
              onClose={() => setIsTaskMenuOpen(false)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  setIsTaskMenuOpen(false);
                  setIsModalDeleteTaskOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <TrashIcon height={15} width={15} /> Excluir
              </MenuItem>
            </Menu>
          </div>

          <div className="my-3 flex justify-between">
            <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
            {typeof task.points === "number" && (
              <div className="text-xs font-semibold dark:text-white">
                {task.points} pts
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span>{formattedStartDate}</span>}
            {formattedDueDate && <span> - {formattedDueDate}</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-neutral-500">
            {task.description}
          </p>
          <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-[6px] overflow-hidden">
              {task.assignee && (
                <Image
                  key={task.assignee.userId}
                  src={`/${task.assignee.profilePictureUrl!}`}
                  alt={task.assignee.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
              {task.author && (
                <Image
                  key={task.author.userId}
                  src={`/${task.author.profilePictureUrl!}`}
                  alt={task.author.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
            </div>

            <button
              className={`flex items-center rounded p-1 text-gray-500 ${numberOfComments !== 0 && "hover:bg-gray-100 dark:text-neutral-500 dark:hover:bg-gray-700"}`}
              onClick={() => setIsModalCommentsOpen(true)}
              disabled={numberOfComments === 0}
            >
              <MessageSquareMore size={20} />
              <span className="ml-1 text-sm dark:text-neutral-400">
                {numberOfComments}
              </span>
            </button>
          </div>
        </div>
        {task.comments && task.comments.length > 0 && (
          <Dialog
            open={isModalCommentsOpen}
            onClose={() => setIsModalCommentsOpen(false)}
          >
            <DialogTitle>Comentários</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setIsModalCommentsOpen(false)}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <X size={18} />
            </IconButton>
            <DialogContent dividers>
              <DialogContentText className="flex space-x-3">
                <MessageSquareMore size={20} />
                {task.comments.map((comment) => (
                  <span key={comment.id}>{comment.text}</span>
                ))}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default BoardView;
