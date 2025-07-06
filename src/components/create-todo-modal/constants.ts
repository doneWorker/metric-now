import { TaskPriorityEnum } from "../../constants";

export const priorityToClassname: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.Critical]: "priority-critical",
  [TaskPriorityEnum.High]: "priority-high",
  [TaskPriorityEnum.Medium]: "priority-medium",
  [TaskPriorityEnum.Low]: "priority-low",
};
