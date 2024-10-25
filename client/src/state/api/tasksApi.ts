import { Task } from "@/types";
import { baseApi } from "./api";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id })) // Se houver um resultado, ele mapeia cada task retornada, associando a cada uma uma tag do tipo "Tasks" com o ID específico da task. Isso permite que o cache de cada task seja invalidado individualmente.
          : [{ type: "Tasks" as const }], // Se não houver resultado (nenhuma task), ainda retorna uma tag "Tasks" genérica, garantindo que o cache possa ser invalidado de forma segura mesmo sem tasks específicas.
    }),
    getTasksByUser: builder.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: builder.mutation<
      Task,
      { taskId: number; status: string }
    >({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
      // Invalida o cache especificamente da task com o ID fornecido. Isso força a atualização dessa task no cache, garantindo que, após a mudança de status, a interface tenha os dados mais recentes.
    }),
    deleteTask: builder.mutation<void, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetTasksByUserQuery,
  useDeleteTaskMutation,
} = tasksApi;
