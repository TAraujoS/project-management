import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/types";

const Backlog = () => {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
};

export default Backlog;
