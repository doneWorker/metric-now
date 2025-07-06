import { useCallback, useEffect, useState } from "react";
import { Counter } from "../../../types";
import { getCounterRecords } from "../../../db";
import { AppEvents, eventEmitter } from "../../../constants";

export const useCounters = () => {
  const [counters, setCounters] = useState<Counter[]>([]);

  const fetchCounters = useCallback(async () => {
    const records = await getCounterRecords();
    setCounters(records);
  }, []);

  useEffect(() => {
    fetchCounters();

    eventEmitter.on(AppEvents.RefetchCounters, fetchCounters);

    return () => {
      eventEmitter.off(AppEvents.RefetchCounters, fetchCounters);
    };
  }, [fetchCounters]);

  return counters;
};
