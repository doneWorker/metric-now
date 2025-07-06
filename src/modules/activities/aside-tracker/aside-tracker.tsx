import { FC, useCallback, useMemo, useRef } from "react";
import { Ban, PlayFill, StopFill, Stopwatch } from "react-bootstrap-icons";
import { useActivityLogsList, useManageActivityLogs } from "../hooks";
import { last } from "lodash";
import { getTimeLabel } from "../utils";
import { differenceInSeconds } from "date-fns";
import { useInterval } from "usehooks-ts";
import { Tooltip } from "../../../components";
import { millisecondsInSecond } from "date-fns/constants";

export const AsideTracker: FC = () => {
  const timeRef = useRef<HTMLSpanElement>(null);

  const { inProgressLogs } = useActivityLogsList();
  const { stopActivity } = useManageActivityLogs();

  const lastInProgressLog = useMemo(
    () => last(inProgressLogs),
    [inProgressLogs]
  );

  const updateTime = useCallback(() => {
    if (!lastInProgressLog || !timeRef.current) {
      return;
    }

    timeRef.current.innerText = getTimeLabel(
      differenceInSeconds(new Date(), lastInProgressLog.datetimeStart)
    );
  }, [lastInProgressLog]);

  useInterval(updateTime, lastInProgressLog ? millisecondsInSecond : null);

  return (
    <div className="relative h-10 flex flex-col border-1 border-gray-300 overflow-hidden rounded-lg">
      <div className="h-5 px-6 flex items-center gap-4 bg-white border-b-1 border-gray-300">
        <Stopwatch />
        <span className="font-semibold">Running stopwatch</span>
      </div>
      {!lastInProgressLog && (
        <div className="px-6 h-5 flex items-center gap-4 text-sm text-gray-500">
          <Ban width={14} height={14} /> There's no ongoing activity
        </div>
      )}
      {lastInProgressLog && (
        <div className="h-5 px-4 flex items-center space-between gap-4 bg-gray-200">
          <div className="flex gap-2">
            <PlayFill className="text-blue-500" width={18} height={18} />
            <span ref={timeRef} className="font-semibold">
              00:00:00
            </span>
          </div>
          <Tooltip overlay={<>Stop ongoing activity</>}>
            <button
              className="w-3 h-3 bg-red-600 flex-center rounded-md text-white hover-opacity-70 active-scale-95"
              onClick={() => stopActivity(lastInProgressLog.id)}
            >
              <StopFill width={14} height={14} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
