import { useCallback, useEffect, useState } from "react";
import { ActivityLogWithTitle } from "../../../types";
import {
  ActivityLogsFilter,
  getActivityLogsRecords,
  getOngoingActivityLogsRecords,
} from "../../../db";
import { AppEvents, eventEmitter } from "../../../constants";
import { listen } from "@tauri-apps/api/event";

export const useActivityLogsList = (filter?: ActivityLogsFilter) => {
  const [logs, setLogs] = useState<ActivityLogWithTitle[]>();
  const [inProgressLogs, setInProgressLogs] =
    useState<ActivityLogWithTitle[]>();

  const fetchLogs = useCallback(async () => {
    const logs = await getActivityLogsRecords(filter);
    const ongoingLogs = await getOngoingActivityLogsRecords();

    setInProgressLogs(ongoingLogs);
    setLogs(logs);
  }, [filter]);

  useEffect(() => {
    eventEmitter.on(AppEvents.RefetchActivitiesLogs, fetchLogs);
    listen(AppEvents.UpdateActivityTray, fetchLogs);

    return () => {
      eventEmitter.off(AppEvents.RefetchActivitiesLogs, fetchLogs);
    };
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, inProgressLogs };
};
