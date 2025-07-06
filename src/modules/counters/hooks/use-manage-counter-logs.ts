import { useCallback } from "react";
import { updateCounterLogRecord } from "../../../db";
import { AppEvents, eventEmitter } from "../../../constants";

export const useManageCounterLogs = () => {
  const updateCounterLog = useCallback(
    async (counterId: string, date: string, value: number) => {
      await updateCounterLogRecord(counterId, date, value);

      eventEmitter.emit(AppEvents.RefetchCounterLogs);
    },
    []
  );

  return {
    updateCounterLog,
  };
};
