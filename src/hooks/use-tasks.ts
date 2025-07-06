import { useCallback, useEffect, useState } from "react";
import {
  Bool,
  SearchDatePresetsEnum,
  SearchSortPresetsEnum,
  Task,
} from "../types";
import {
  createTaskRecord,
  getTaskRecords,
  removeTaskRecord,
  updateTaskRecord,
} from "../db";
import { AppEvents, eventEmitter } from "../constants";
import {
  getTaskDBFilter,
  playSoundEffect,
  SoundEffectEnum,
  toggleBool,
} from "../utils";

type Params = {
  listId: string | null;
  datePreset: SearchDatePresetsEnum | null;
  sortPreset: SearchSortPresetsEnum | null;
};

export const useTasks = (params: Params) => {
  const { listId, datePreset, sortPreset } = params;

  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    let filter = getTaskDBFilter({ listId, datePreset, sortPreset });
    const tasks = await getTaskRecords(filter);
    setTasks(tasks);
  }, [listId, datePreset, sortPreset]);

  const createTask = useCallback(
    async (task: Partial<Task>) => {
      await createTaskRecord(task);
      eventEmitter.emit(AppEvents.RefetchLists);
      fetchTasks();
    },
    [fetchTasks]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      playSoundEffect(SoundEffectEnum.Remove);
      await removeTaskRecord(taskId);
      fetchTasks();
      eventEmitter.emit(AppEvents.RefetchLists);
    },
    [fetchTasks]
  );

  const setTaskCompletion = useCallback(
    async (taskId: string, completed: Bool) => {
      playSoundEffect(SoundEffectEnum.Complete);

      await updateTaskRecord(taskId, {
        completed,
      });
      fetchTasks();
    },
    [fetchTasks]
  );

  const toggleFavorite = useCallback(
    async (taskId: string) => {
      const task = tasks.find((task) => task.id === taskId);
      if (!task) return;
      await updateTaskRecord(taskId, {
        favorite: toggleBool(task?.favorite),
      });
      eventEmitter.emit(AppEvents.RefetchLists);
      fetchTasks();
    },
    [tasks, fetchTasks]
  );

  useEffect(() => {
    fetchTasks();
  }, [listId, datePreset, sortPreset, fetchTasks]);

  useEffect(() => {
    const fn = fetchTasks;

    eventEmitter.on(AppEvents.RefetchTasks, fn);

    return () => {
      eventEmitter.off(AppEvents.RefetchTasks, fn);
    };
  }, [fetchTasks]);

  return {
    tasks,
    createTask,
    removeTask,
    setTaskCompletion,
    toggleFavorite,
  };
};
