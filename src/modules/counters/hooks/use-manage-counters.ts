import { useCallback } from "react";
import {
  createCounterRecord,
  removeCounterRecord,
  updateCounterRecord,
} from "../../../db";
import { AppEvents, eventEmitter } from "../../../constants";

export const useManageCounters = () => {
  const createCounter = useCallback(async (name: string) => {
    await createCounterRecord({ name });

    eventEmitter.emit(AppEvents.RefetchCounters);
  }, []);

  const removeCounter = useCallback(async (counterId: string) => {
    await removeCounterRecord(counterId);

    eventEmitter.emit(AppEvents.RefetchCounters);
  }, []);

  const updateCounterName = useCallback(
    async (counterId: string, name: string) => {
      await updateCounterRecord(counterId, { name });

      eventEmitter.emit(AppEvents.RefetchCounters);
    },
    []
  );

  return {
    createCounter,
    removeCounter,
    updateCounterName,
  };
};
