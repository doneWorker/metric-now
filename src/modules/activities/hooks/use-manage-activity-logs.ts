import { useCallback } from "react";
import {
  createActivityLogRecord,
  removeActivityLogRecord,
  updateActivityLogRecord,
} from "../../../db";
import { AppEvents, eventEmitter } from "../../../constants";
import { ActivityLog } from "../../../types";

export const useManageActivityLogs = () => {
  const startActivity = useCallback(
    async (payload: { note?: string; taskId?: string }) => {
      await createActivityLogRecord({
        ...payload,
        datetimeStart: new Date().toISOString(),
      });

      eventEmitter.emit(AppEvents.RefetchActivitiesLogs);
      eventEmitter.emit(AppEvents.StartActivity);
    },
    []
  );

  const stopActivity = useCallback(async (activityLogId: string) => {
    await updateActivityLogRecord(activityLogId, {
      datetimeEnd: new Date().toISOString(),
    });

    eventEmitter.emit(AppEvents.RefetchActivitiesLogs);
  }, []);

  const updateActivityLog = useCallback(
    async (activityLogId: string, updates: Partial<ActivityLog>) => {
      await updateActivityLogRecord(activityLogId, updates);

      eventEmitter.emit(AppEvents.RefetchActivitiesLogs);
    },
    []
  );

  const createActivityLog = useCallback(
    async (payload: {
      note?: string;
      taskId?: string;
      datetimeStart: string;
      datetimeEnd: string;
    }) => {
      await createActivityLogRecord({
        ...payload,
      });

      eventEmitter.emit(AppEvents.RefetchActivitiesLogs);
    },
    []
  );

  const removeActivityLog = useCallback(async (activityId: string) => {
    await removeActivityLogRecord(activityId);

    eventEmitter.emit(AppEvents.RefetchActivitiesLogs);
  }, []);

  return {
    startActivity,
    stopActivity,
    removeActivityLog,
    createActivityLog,
    updateActivityLog,
  };
};
