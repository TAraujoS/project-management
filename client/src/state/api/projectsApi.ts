import { Project } from "@/types";
import { baseApi } from "./api";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
      // Informa ao Redux quais tags estão associadas a essa query. Aqui, está associando os projetos retornados com a tag "Projects" para controle de cache.
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
      // Serve para invalidar o cache das tags especificadas. Ao criar um novo projeto, o cache de "Projects" é invalidado, forçando a atualização da lista de projetos.
    }),
    deleteProject: builder.mutation<void, number>({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
