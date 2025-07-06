import { useCallback, useEffect, useState } from "react";
import { CounterLog } from "../../../types";
import { getCounterLogRecords } from "../../../db";
import { AppEvents, eventEmitter } from "../../../constants";

type Params = {
  dateFrom?: Date;
  dateTo?: Date;
};

export const useCounterLogs = (params: Params) => {
  const { dateFrom, dateTo } = params;

  const [logs, setLogs] = useState<CounterLog[]>([]);

  const fetchLogs = useCallback(async () => {
    const records = await getCounterLogRecords({
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
    });

    setLogs(records);
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchLogs();
    eventEmitter.on(AppEvents.RefetchCounterLogs, fetchLogs);

    return () => {
      eventEmitter.off(AppEvents.RefetchCounterLogs, fetchLogs);
    };
  }, [fetchLogs]);

  return logs;
};
