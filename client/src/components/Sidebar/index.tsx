"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useGetAuthUserQuery, useSignoutMutation } from "@/state/api/api";
import { useGetProjectsQuery } from "@/state/api/projectsApi";
import { setIsSidebarCollapsed } from "@/state/globalSlice";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const { data: currentUser } = useGetAuthUserQuery();
  const [signout, { isLoading }] = useSignoutMutation();
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const handleSignOut = async () => {
    try {
      await signout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!currentUser) return null;

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
  transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;
  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Lista {currentUser?.username || ""}
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
              }
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.png" alt="Logo" width={60} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              Meu Time
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[01.rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Privado</p>
            </div>
          </div>
        </div>

        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Buscar" href="/search" />
          <SidebarLink icon={Settings} label="Configurações" href="/settings" />
          <SidebarLink icon={User} label="Usuários" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projetos</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showProjects && projects && projects.length > 0 ? (
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))
        ) : (
          <SidebarLink icon={Plus} label="Criar Novo Projeto" href={`/`} />
        )}

        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Prioridade</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgente"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="Alta"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Média"
              href="/priority/medium"
            />
            <SidebarLink
              icon={AlertOctagon}
              label="Baixa"
              href="/priority/low"
            />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
      <div
        className={`${showPriority ? "mt-96" : "mt-32"} z-10 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden`}
      >
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUser?.profilePictureUrl ? (
              <Image
                src={`/${currentUser?.profilePictureUrl}`}
                alt={currentUser?.username || "User profile picture"}
                width={100}
                height={50}
                className="h-auto w-full rounded-t-md"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUser?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
