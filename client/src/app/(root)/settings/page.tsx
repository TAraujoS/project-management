"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { useGetAuthUserQuery, useUpdateUserMutation } from "@/state/api/api";
import { PencilIcon } from "lucide-react";
import Modal from "@/components/Modal";

const Settings = () => {
  const { data: currentUser } = useGetAuthUserQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full flex justify-between border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";
  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const handleSubmit = async () => {
    try {
      if (currentUser && currentUser.userId !== undefined) {
        await updateUser({
          userId: currentUser!.userId,
          user: {
            username,
            email,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="p-8">
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name="Editar Perfil"
        width="w-80"
      >
        <form
          className="mt-4 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <p>Username</p>
            <input
              type="text"
              className={inputStyles}
              placeholder={currentUser?.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <p>Email</p>
            <input
              type="text"
              className={inputStyles}
              placeholder={currentUser?.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-blue-600 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Atualizando..." : "Alterar"}
          </button>
        </form>
      </Modal>

      <Header name="Configurações" />

      <div className="flex h-10 gap-8">
        <div className="w-64 space-y-4">
          <div>
            <label className={labelStyles}>Username</label>
            <div className={textStyles}>
              {currentUser?.username || userSettings.username}
            </div>
          </div>
          <div>
            <label className={labelStyles}>Email</label>
            <div className={textStyles}>
              {currentUser?.email || userSettings.email}
            </div>
          </div>
          <div>
            <label className={labelStyles}>Team</label>
            <div className={textStyles}>{userSettings.teamName}</div>
          </div>
          <div>
            <label className={labelStyles}>Role</label>
            <div className={textStyles}>{userSettings.roleName}</div>
          </div>
        </div>
        <button
          className="flex cursor-pointer gap-2 rounded-md border border-gray-300 bg-blue-400 p-2 text-white hover:bg-blue-600"
          onClick={() => setIsOpen(true)}
          disabled={isLoading || !currentUser}
        >
          Editar Perfil
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Settings;
