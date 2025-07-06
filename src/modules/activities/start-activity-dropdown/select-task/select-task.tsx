import { FC, useEffect, useMemo, useState } from "react";
import Dropdown from "rc-dropdown";
import { useLists } from "../../../../hooks/use-lists";
import { useTasks } from "../../../../hooks/use-tasks";
import { Clipboard2Check } from "react-bootstrap-icons";
import { List, Task } from "../../../../types";
import clsx from "clsx";
import { getFullTaskRecord } from "../../../../db";

type Props = {
  className?: string;
  defaultValue?: string; // taskId
  onChange: (taskId: string) => void;
};

export const SelectTask: FC<Props> = (props) => {
  const { className, defaultValue, onChange } = props;

  const [isOpened, setIsOpened] = useState(false);
  const [listId, setListId] = useState<string>();
  const [taskId, setTaskId] = useState<string>();
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [selectedList, setSelectedList] = useState<List>();

  const { lists: allLists } = useLists();

  const lists = useMemo(
    () => allLists.filter((item) => item.id !== "favorites"),
    [allLists]
  );

  useEffect(() => {
    setTaskId(undefined);
    setSelectedTask(undefined);
  }, [listId]);

  useEffect(() => {
    const runAsync = async () => {
      if (!defaultValue) {
        return;
      }

      if (defaultValue) {
        const task = await getFullTaskRecord(defaultValue);

        if (task) {
          setListId(task.listId);
          setSelectedList(lists.find((list) => list.id === task.listId));
          setSelectedTask(task);
          setTaskId(task.id);
        }
      }
    };

    runAsync();
  }, [defaultValue, lists]);

  const { tasks } = useTasks({
    listId: listId ?? "not_found_list", // FIXME: load appropriate tasks only when list selected
    datePreset: null,
    sortPreset: null,
  });

  const overlay = useMemo(() => {
    return (
      <div className="relative p-2 h-14 flex bg-white overflow-hidden rounded-lg shadow-card">
        <div
          className="px-2 flex w-50p flex-col gap-2 h-14 overflow-auto"
          style={{ borderRight: "1px solid #ccc" }}
        >
          {lists.map((list) => (
            <div
              className="p-2 flex items-center gap-2 hover-bg-gray-100 cursor-pointer"
              key={list.id}
              onMouseEnter={() => {
                setListId(list.id);
                setSelectedList(list);
              }}
            >
              <span>{list.icon}</span>
              <span>{list.label}</span>
            </div>
          ))}
        </div>
        <div className="px-2 flex w-50p flex-col gap-2 h-14 overflow-auto">
          {tasks?.map((task) => (
            <div
              className="p-2 flex items-center gap-2 hover-bg-gray-100 cursor-pointer"
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                setTaskId(task.id);
                onChange(task.id);
                setIsOpened(false);
              }}
            >
              <span>
                <Clipboard2Check />
              </span>
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [lists, tasks]);

  return (
    <Dropdown
      trigger={["click"]}
      overlay={overlay}
      visible={isOpened}
      onVisibleChange={setIsOpened}
    >
      <div
        className={clsx(
          "h-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover-bg-gray-200 cursor-pointer outline-2 outline-solid transition-all",
          isOpened && "outline-blue-400",
          !isOpened && "outline-transparent",
          className
        )}
      >
        {selectedList && selectedTask && (
          <>
            <div className="flex items-center gap-2">
              <span>{selectedList.icon}</span>
              <span>{selectedList.label}</span>
            </div>
            /{selectedTask.title}
          </>
        )}
        {!taskId && <span className="text-sm text-gray-500">Select Task</span>}
      </div>
    </Dropdown>
  );
};
