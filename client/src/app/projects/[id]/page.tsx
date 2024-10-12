"use client";

import { TabType } from "@/types";
import React, { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import BoardView from "../BoardView";

type ProjectProps = {
  params: {
    id: string;
  };
};

const Project = ({ params }: ProjectProps) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState(TabType.Board);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === TabType.Board && (
        <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
