import { useCallback, useEffect, useState } from "react";

import { List } from "../types";
import {
  createListRecord,
  getListRecords,
  removeListRecord,
  updateListRecord,
} from "../db";
import { AppEvents, eventEmitter } from "../constants";

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);

  const fetchLists = useCallback(async () => {
    const lists = await getListRecords();
    setLists(lists);
  }, []);

  const createList = useCallback(async (list: Partial<List>) => {
    await createListRecord(list);
    eventEmitter.emit(AppEvents.RefetchLists);
  }, []);

  const updateList = useCallback(
    async (listId: string, updates: Partial<List>) => {
      await updateListRecord(listId, updates);
      eventEmitter.emit(AppEvents.RefetchLists);
    },
    []
  );

  const removeList = useCallback(async (listId: string) => {
    await removeListRecord(listId);
    eventEmitter.emit(AppEvents.RefetchLists);
  }, []);

  useEffect(() => {
    eventEmitter.on(AppEvents.RefetchLists, fetchLists);
    fetchLists();
  }, []);

  return {
    lists,
    updateList,
    createList,
    removeList,
  };
};
