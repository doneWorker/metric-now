import { useCallback, useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Task } from "../../types";
import { removeTaskRecord, updateTaskRecord } from "../../db";
import { AppEvents, eventEmitter } from "../../constants";
import { useTask } from "../../hooks/use-task";

export const useFullTaskDrawer = (taskId: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const { task, refetch } = useTask(taskId);

  const form = useForm({
    defaultValues: {
      title: task?.title,
      taskType: task?.taskType,
      description: task?.description,
      priority: task?.priority,
      scheduledDate: task?.scheduledDate,
    },
    listeners: {
      onSubmit: ({ formApi }) => {
        if (formApi.getFieldValue("title") === "") {
          formApi.setFieldValue("title", task?.title);
        }

        updateTask(formApi.state.values);
      },
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
      onChangeDebounceMs: 500,
    },
  });

  const removeTask = useCallback(async () => {
    await removeTaskRecord(taskId);
  }, [taskId]);

  const updateTask = useCallback(
    async (updates: Partial<Task>) => {
      if (!task) return;

      await updateTaskRecord(task.id, updates);
      eventEmitter.emit(AppEvents.RefetchTasks);
      refetch();
    },
    [task, refetch]
  );

  useEffect(() => {
    refetch();
  }, [taskId, refetch]);

  useEffect(() => {
    setIsOpen(true);

    return () => setIsOpen(false);
  }, []);

  return {
    isOpen,
    task,
    form,
    removeTask,
  };
};
