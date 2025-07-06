import { FC, useEffect, useMemo, useState } from "react";
import { Modal } from "../modal";
import { List, Task } from "../../types";
import { TaskPriorityEnum } from "../../constants";
import { Button } from "../button";
import { Tabs } from "../tabs";
import { getTabs } from "./utils";
import { Input } from "../input";

import "./create-todo-modal.scss";

type Props = {
  isOpen: boolean;
  lists: List[];
  defaultListId?: string;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
};

export const CreateTodoModal: FC<Props> = (props) => {
  const { isOpen, lists, defaultListId, onClose, onSubmit } = props;

  const [activeList, setActiveList] = useState<List>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [priority, setPriority] = useState<TaskPriorityEnum>();
  const [description, setDescription] = useState<string>();

  const tabs = useMemo(
    () =>
      getTabs({
        lists,
        activeList,
        selectedDate,
        selectedPriority: priority,
        description,
        onListChange: (listId) => {
          setActiveList(lists.find((list) => list.id === listId));
        },
        onDateChange: setSelectedDate,
        onPriorityChange: setPriority,
        onDescriptionChange: setDescription,
      }),
    [lists, activeList, selectedDate, priority, description]
  );

  useEffect(() => {
    const defaultList = lists.find((item) => item.id === defaultListId);
    setActiveList(defaultList);
    setSelectedDate(undefined);
    setDescription(undefined);
    setPriority(undefined);
  }, [isOpen, defaultListId]);

  return (
    <Modal
      className="create-todo-modal"
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <form
        className="flex flex-col gap-4"
        id="create-todo-form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const data = Object.fromEntries(formData.entries());
          onSubmit(data as Partial<Task>);
        }}
      >
        <input
          name="listId"
          value={activeList?.id ?? undefined}
          required
          readOnly
          hidden
        />
        <input name="priority" value={priority} readOnly hidden />
        <input
          name="scheduledDate"
          value={selectedDate?.toISOString()}
          readOnly
          hidden
        />
        <Input
          name="title"
          className="min-h-4"
          placeholder="Type a task title"
          autoFocus
          highlightTags
          required
        />
        <Tabs defaultTabKey="category" tabs={tabs} />
        <Button
          size="md"
          color="primary"
          variant="contained"
          htmlType="submit"
          rounded
        >
          Create task
        </Button>
      </form>
    </Modal>
  );
};
