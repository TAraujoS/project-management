import { Project, SearchResults, Task, Team, User } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  // Define tipos de tags que serão usados para cache e invalidação de dados. Cada "tag" agrupa dados relacionados para facilitar a atualização automática do cache.
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
      // Informa ao Redux quais tags estão associadas a essa query. Aqui, está associando os projetos retornados com a tag "Projects" para controle de cache.
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
      // Serve para invalidar o cache das tags especificadas. Ao criar um novo projeto, o cache de "Projects" é invalidado, forçando a atualização da lista de projetos.
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id })) // Se houver um resultado, ele mapeia cada task retornada, associando a cada uma uma tag do tipo "Tasks" com o ID específico da task. Isso permite que o cache de cada task seja invalidado individualmente.
          : [{ type: "Tasks" as const }], // Se não houver resultado (nenhuma task), ainda retorna uma tag "Tasks" genérica, garantindo que o cache possa ser invalidado de forma segura mesmo sem tasks específicas.
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
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
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
} = api;
