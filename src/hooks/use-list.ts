import { useEffect, useState } from "react";
import { List } from "../types";
import { getListRecord } from "../db";
import { AppEvents, eventEmitter } from "../constants";

export const useList = (id?: string | null) => {
  const [list, setList] = useState<List>();

  useEffect(() => {
    const fetchList = async () => {
      if (!id) return;

      const fetchedList = await getListRecord(id);
      setList(fetchedList);
    };

    eventEmitter.on(AppEvents.UpdateList, fetchList);
    fetchList();

    return () => {
      eventEmitter.off(AppEvents.UpdateList, fetchList);
    };
  }, [id]);

  return list;
};
