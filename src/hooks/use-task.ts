import { useCallback, useEffect, useState } from "react";
import { Task } from "../types";
import { getFullTaskRecord } from "../db";

export const useTask = (id?: string | null) => {
  const [task, setTask] = useState<Task>();

  const fetchTask = useCallback(async () => {
    if (!id) return;

    const fetchedList = await getFullTaskRecord(id);
    setTask(fetchedList);
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, []);

  return { task, refetch: fetchTask };
};
