import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/types";

const High = () => {
  return <ReusablePriorityPage priority={Priority.High} />;
};

export default High;
