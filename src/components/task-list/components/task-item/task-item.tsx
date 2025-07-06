import {
  ArrowCounterclockwise,
  Clock,
  ClockHistory,
} from "react-bootstrap-icons";
import { CSSProperties, FC, useMemo } from "react";
import clsx from "clsx";
import { Bool, Task, TaskTypeEnum } from "../../../../types";
import { Checkbox } from "../../../checkbox";
import { getDateLabel } from "../../utils";
import { TaskActions } from "./task-actions";
import { TaskTitle } from "./task-title";

import "./task-item.scss";

type Props = {
  task: Task;
  style?: CSSProperties;
  inProgress?: boolean;
  toggleCompletion: (completed: Bool) => void;
  toggleFavorite: () => void;
  onRemoveTask: () => void;
  onClick: () => void;
};

export const TaskItem: FC<Props> = (props) => {
  const {
    task,
    style,
    inProgress = false,
    toggleCompletion,
    onRemoveTask,
    toggleFavorite,
    onClick,
  } = props;

  const dateLabel = useMemo(() => {
    return task.scheduledDate ? getDateLabel(task.scheduledDate) : null;
  }, [task.scheduledDate]);

  return (
    <div
      style={style}
      className={clsx(
        "task-item shadow-card",
        task.completed && "completed",
        task.priority && `priority-${task.priority}`,
        inProgress && "in-progress"
      )}
      onClick={onClick}
      onKeyDown={onClick}
    >
      <div className="absolute line" />
      <div className="complete items-center">
        {task.taskType === TaskTypeEnum.Activity && (
          <div
            className={clsx(
              "text-lg",
              task.priority && `color-priority-${task.priority}`
            )}
          >
            <ClockHistory width={16} height={16} />
          </div>
        )}
        {task.taskType === TaskTypeEnum.Counter && (
          <div
            className={clsx(
              "text-lg",
              task.priority && `color-priority-${task.priority}`
            )}
          >
            <ArrowCounterclockwise width={16} height={16} />
          </div>
        )}
        {task.taskType === TaskTypeEnum.Regular && (
          <Checkbox
            priority={task.priority}
            defaultChecked={Boolean(task.completed)}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              toggleCompletion(Number(event.currentTarget.checked) as Bool);
            }}
          />
        )}
        {inProgress && (
          <div className="progress-dot w-6 h-6 rounded-full bg-blue-600" />
        )}
      </div>
      <TaskTitle title={task.title} favorite={task.favorite} />
      {dateLabel && (
        <span
          className={clsx(
            "date h-3 bg-gray-100 text-gray-600",
            dateLabel.isOverdue && "overdue"
          )}
        >
          <Clock width={12} height={12} />
          {dateLabel.label}
        </span>
      )}
      <TaskActions
        taskId={task.id}
        taskType={task.taskType}
        favorite={task.favorite}
        onClick={onClick}
        onRemoveTask={onRemoveTask}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};
