import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/types";

const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
};

export default Urgent;
