"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api/api";
import { debounce } from "lodash";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchText, {
    skip: searchText.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="p-8">
      <Header name="Pesquisar" />
      <div>
        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-1/2 rounded border p-3 shadow"
          onChange={handleSearch}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occured while fetchig search results</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <h2 className="mb-3 text-xl font-semibold dark:text-white">
                Tarefas
              </h2>
            )}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.tasks?.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {searchResults.projects && searchResults.projects.length > 0 && (
              <h2 className="mb-3 text-xl font-semibold dark:text-white">
                Projetos
              </h2>
            )}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
              {searchResults.projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {searchResults.users && searchResults.users.length > 0 && (
              <h2 className="mb-3 text-xl font-semibold dark:text-white">
                Usuários
              </h2>
            )}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.users?.map((user) => (
                <UserCard key={user.userId} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
