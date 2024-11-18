import React, { ChangeEvent, useState } from "react";
import { useCreateTaskMutation } from "@/state/api/tasksApi";
import { Priority, Status } from "@/types";
import { addDays, formatISO } from "date-fns";
import Modal from "../Modal";
import toast from "react-hot-toast";
import { useGetUsersQuery } from "@/state/api/api";

type ModalNewTaskProps = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};
const ModalNewTask = ({ isOpen, onClose, id = null }: ModalNewTaskProps) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: users } = useGetUsersQuery();

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    status: Status.ToDo,
    priority: Priority.Backlog,
    tags: "",
    startDate: "",
    dueDate: "",
    authorUserId: "",
    assignedUserId: "",
    projectId: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResetForm = () => {
    setFormState({
      title: "",
      description: "",
      status: Status.ToDo,
      priority: Priority.Backlog,
      tags: "",
      startDate: "",
      dueDate: "",
      authorUserId: "",
      assignedUserId: "",
      projectId: "",
    });
  };

  const handleSubmit = async () => {
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      authorUserId,
      assignedUserId,
      projectId,
    } = formState;

    if (!title || !authorUserId || !(id !== null || projectId) || !status) {
      return;
    }

    const formattedStartDate = formatISO(new Date(startDate || new Date()), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(
      new Date(dueDate || addDays(new Date(), 7)),
      {
        representation: "complete",
      },
    );

    try {
      const response = await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: parseInt(authorUserId),
        assignedUserId: parseInt(assignedUserId),
        projectId: id !== null ? Number(id) : Number(projectId),
      });
      if (response.data) {
        toast.success("Tarefa criada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao criar tarefa");
    } finally {
      handleResetForm();
      onClose();
    }
  };

  const isFormValid = () => {
    const { title, status, authorUserId, projectId } = formState;
    return title && authorUserId && !(id !== null && projectId) && status;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleResetForm();
        onClose();
      }}
      name="Criar Nova Tarefa"
    >
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          name="title"
          type="text"
          className={inputStyles}
          placeholder="Título"
          value={formState.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          className={inputStyles}
          placeholder="Descrição"
          value={formState.description}
          onChange={handleInputChange}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            name="status"
            className={selectStyles}
            value={formState.status}
            onChange={handleInputChange}
          >
            <option value="">Selecione o Status</option>
            <option value={Status.ToDo}>A Fazer</option>
            <option value={Status.WorkInProgress}>Em Progresso</option>
            <option value={Status.UnderReview}>Em Revisão</option>
            <option value={Status.Completed}>Completo</option>
          </select>
          <select
            name="priority"
            className={selectStyles}
            value={formState.priority}
            onChange={handleInputChange}
          >
            <option value="">Selecione a Prioridade</option>
            <option value={Priority.Urgent}>Urgente</option>
            <option value={Priority.High}>Alto</option>
            <option value={Priority.Medium}>Médio</option>
            <option value={Priority.Low}>Baixo</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          name="tags"
          type="text"
          className={inputStyles}
          placeholder="Tags (vírgula para separar)"
          value={formState.tags}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            name="startDate"
            type="date"
            className={inputStyles}
            value={formState.startDate}
            onChange={handleInputChange}
          />
          <input
            name="dueDate"
            type="date"
            className={inputStyles}
            value={formState.dueDate}
            onChange={handleInputChange}
          />
        </div>

        <select
          name="authorUserId"
          id="autor-name"
          value={formState.authorUserId}
          onChange={handleInputChange}
          className={selectStyles}
        >
          <option value="" disabled>
            Nome do Autor
          </option>
          {users?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username}
            </option>
          ))}
        </select>

        <select
          name="assignedUserId"
          id="assigned-name"
          value={formState.assignedUserId}
          onChange={handleInputChange}
          className={selectStyles}
        >
          <option value="" disabled>
            Nome do Responsável
          </option>
          {users?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username}
            </option>
          ))}
        </select>

        {id === null && (
          <input
            name="projectId"
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={formState.projectId}
            onChange={handleInputChange}
          />
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Criando..." : "Criar Tarefa"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
