import { FC, useEffect, useMemo, useRef, useState } from "react";
import { debounce, partition } from "lodash";
import { Bool, Task } from "../../types";
import { TaskItem } from "./components";
import { VirtualList } from "../virtual-list/virtual-list";

import "./task-list.scss";

// TODO:FIXME: REARRANGE TASKS AFTER LIST UPDATED
type Props = {
  tasks: Task[];
  toggleTask: (taskId: string, completed: Bool) => void;
  onTaskClick: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
  toggleFavorite: (taskId: string) => void;
};

export const TaskList: FC<Props> = (props) => {
  const { tasks, toggleTask, onRemoveTask, onTaskClick, toggleFavorite } =
    props;

  const isEmpty = tasks.length === 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>();

  const list = useMemo(() => {
    const [completed, notCompleted] = partition(
      tasks,
      (todo) => todo.completed
    );

    return [...notCompleted, ...completed];
  }, [tasks]);

  useEffect(() => {
    const adjustContainerHeight = debounce(() => {
      const h = containerRef.current?.getBoundingClientRect().height;
      setListHeight(h);
    }, 50);

    adjustContainerHeight();
    window.addEventListener("resize", adjustContainerHeight);

    return () => {
      window.removeEventListener("resize", adjustContainerHeight);
    };
  }, []);

  return (
    <div className="task-list mt-8" ref={containerRef}>
      {isEmpty && (
        <div className="empty">
          <span className="icon">📂</span>
          <h2>No tasks found.</h2>
        </div>
      )}
      {listHeight && (
        <VirtualList
          items={list}
          itemHeight={45}
          listHeight={listHeight}
          listClassName="p-30 pt-0"
          gap={8}
          renderItem={({ index }) => {
            const item = tasks[index];

            return (
              <TaskItem
                key={index}
                task={item}
                onClick={() => onTaskClick(item.id)}
                onRemoveTask={() => onRemoveTask(item.id)}
                toggleCompletion={(completed) => toggleTask(item.id, completed)}
                toggleFavorite={() => toggleFavorite(item.id)}
              />
            );
          }}
        />
      )}
    </div>
  );
};
