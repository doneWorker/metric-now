import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StopwatchButton } from "./stopwatch-button";
import { getTimeLabel } from "../../activities/utils";
import { SelectTask } from "../../activities/start-activity-dropdown/select-task";
import { useActivityLogsList, useManageActivityLogs } from "../../activities";
import { useInterval } from "usehooks-ts";
import { emit } from "@tauri-apps/api/event";
import { AppEvents } from "../../../constants";
import { last, size } from "lodash";
import { differenceInSeconds } from "date-fns";
import { ListTask } from "react-bootstrap-icons";
import { millisecondsInSecond } from "date-fns/constants";

const DEFAULT_TIME = "00:00:00";

export const StopwatchTimer: FC = () => {
  const timeRef = useRef<HTMLDivElement>(null);
  const [selectedTask, setSelectedTask] = useState<string>();

  const { inProgressLogs } = useActivityLogsList();
  const { startActivity, stopActivity } = useManageActivityLogs();

  const lastInProgressLog = useMemo(
    () => last(inProgressLogs),
    [inProgressLogs]
  );

  const handleTimerClick = useCallback(async () => {
    if (lastInProgressLog) {
      await stopActivity(lastInProgressLog.id);
      if (timeRef.current) timeRef.current.innerText = DEFAULT_TIME;
    } else {
      await startActivity({
        taskId: selectedTask,
      });
    }

    setSelectedTask(undefined);
    emit(AppEvents.UpdateActivityTray);
  }, [selectedTask, lastInProgressLog, startActivity]);

  const updateTime = useCallback(() => {
    if (!lastInProgressLog || !timeRef.current) {
      return;
    }

    timeRef.current.innerText = getTimeLabel(
      differenceInSeconds(new Date(), lastInProgressLog.datetimeStart)
    );
  }, [lastInProgressLog]);

  useEffect(() => {
    updateTime();
  }, [updateTime]);

  useInterval(updateTime, lastInProgressLog ? millisecondsInSecond : null);

  const hasInProgressLogs = useMemo(
    () => size(inProgressLogs) > 0,
    [inProgressLogs]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-full flex items-center space-between">
        <div ref={timeRef} className="px-4 text-4xl">
          {DEFAULT_TIME}
        </div>
        <StopwatchButton
          isRunning={hasInProgressLogs}
          isDisabled={!selectedTask && !hasInProgressLogs}
          onClick={handleTimerClick}
        />
      </div>
      {hasInProgressLogs && (
        <div className="h-4 flex px-4 gap-4 items-center bg-gray-200 rounded-lg text-sm">
          <span>Task in progress:</span>
          <div className="h-3 flex-center gap-2 px-4 bg-blue-500 rounded-lg text-white">
            <ListTask />
            <span>{lastInProgressLog?.title}</span>
          </div>
        </div>
      )}
      {!hasInProgressLogs && (
        <SelectTask
          className="border-1 border-gray-200"
          defaultValue={selectedTask}
          onChange={setSelectedTask}
        />
      )}
    </div>
  );
};
