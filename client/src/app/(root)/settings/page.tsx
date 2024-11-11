"use client";

import React from "react";
import Header from "@/components/Header";
import { useGetAuthUserQuery } from "@/state/api/api";

const Settings = () => {
  const { data: currentUser } = useGetAuthUserQuery({});

  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

  return (
    <div className="p-8">
      <Header name="Configurações" />
      <div className="w-64 space-y-4">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={textStyles}>
            {currentUser?.user.username || userSettings.username}
          </div>
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>-</div>
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
    </div>
  );
};

export default Settings;
