import { SearchResults, Team, User } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("@user:token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  // Define tipos de tags que serão usados para cache e invalidação de dados. Cada "tag" agrupa dados relacionados para facilitar a atualização automática do cache.
  endpoints: (builder) => ({
    getAuthUser: builder.query<User, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    signup: builder.mutation<User, Partial<User>>({
      query: (user) => ({
        url: "auth/signup",
        method: "POST",
        body: user,
      }),
    }),
    getUser: builder.query<User, Partial<User>>({
      query: (userId) => `users/${userId}`,
      providesTags: ["Users"],
    }),
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    signin: builder.mutation<
      { user: Partial<User>; token: string },
      Partial<User>
    >({
      query: (user) => ({
        url: "auth/signin",
        method: "POST",
        body: user,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== "undefined") {
            localStorage.clear();
            localStorage.setItem("@user:token", data.token);
          }
        } catch (error) {
          console.error("Erro ao fazer login:", error);
        }
      },
    }),
    signout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/signout",
        method: "POST",
      }),
      onQueryStarted(args, { dispatch, queryFulfilled }) {
        queryFulfilled.then(() => {
          localStorage.removeItem("@user:token");
        });
      },
    }),
    updateUser: builder.mutation<User, { userId: number; user: Partial<User> }>(
      {
        query: ({ userId, user }) => ({
          url: `users/${userId}`,
          method: "PATCH",
          body: { user },
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "Users", userId: userId },
        ],
      },
    ),
    getTeams: builder.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: builder.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useSearchQuery,
  useSignupMutation,
  useSigninMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetAuthUserQuery,
  useSignoutMutation,
} = baseApi;
