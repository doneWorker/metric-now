import { FC, useCallback, useMemo } from "react";
import { ActivityLogWithTitle } from "../../../../types";
import { getActivityBoundary, hasOverlaps } from "./utils";
import { ActivityLogCard } from "../activity-log-card";
import { useInterval } from "usehooks-ts";
import { last } from "lodash";
import { PlusCircle } from "react-bootstrap-icons";
import { AppEvents, eventEmitter } from "../../../../constants";
import { secondsInMinute } from "date-fns/constants";

type Props = {
  date: Date;
  wrapperHeight: number;
  activityLogs: ActivityLogWithTitle[];
};

export const DayColumn: FC<Props> = (props) => {
  const { activityLogs, date, wrapperHeight } = props;

  const inProgressLogs = useMemo(
    () => activityLogs.filter((log) => !log.datetimeEnd),
    [activityLogs]
  );

  const listWithBoundaries = useMemo<
    Array<ActivityLogWithTitle & { top: number; height: number }>
  >(() => {
    return activityLogs.map((log) => ({
      ...getActivityBoundary(log, wrapperHeight),
      ...log,
    }));
  }, [activityLogs, wrapperHeight]);

  const getCardOffset = useCallback(
    (targetIndex: number) => {
      const activeCard = listWithBoundaries[targetIndex];
      let finalWidth = 1;
      let finalLeft = 0;

      listWithBoundaries.forEach((item, index) => {
        if (targetIndex === index) {
          return;
        }

        if (hasOverlaps(activeCard, item)) {
          finalWidth += 1;

          if (index < targetIndex) {
            finalLeft += 1;
          }
        }
      });

      return [100 / finalWidth, finalLeft];
    },
    [listWithBoundaries]
  );

  const handleUpdateInProgressLog = useCallback(() => {
    const log = last(inProgressLogs);

    if (log) {
      const logElement = document.querySelector<HTMLDivElement>(
        `[data-id=${log.id}]`
      );

      if (!logElement) {
        return;
      }

      logElement.style.height =
        getActivityBoundary(log, wrapperHeight).height + "px";
    }
  }, [inProgressLogs]);

  useInterval(handleUpdateInProgressLog, 1_000);

  return (
    <div className="w-full h-full bg-white">
      <div className="relative z-1 border-r-1 border-gray-300">
        <div className="relative" style={{ height: wrapperHeight }}>
          <div className="w-full h-full">
            {Array.from(Array(24 * 2).keys()).map((item) => (
              <div
                key={item}
                className="cursor-pointer flex-center opacity-0 p-2 transition-all hover-opacity-100"
                style={{
                  height: 50,
                }}
              >
                <div
                  className="w-full h-full text-sm font-medium flex-center gap-2 rounded-lg bg-blue-100 text-blue-600"
                  onDoubleClick={() => {
                    eventEmitter.emit(AppEvents.LogActivityOpened, {
                      date,
                      timeFrom: item * 30 * secondsInMinute,
                      duration: 15 * secondsInMinute,
                    });
                  }}
                >
                  <PlusCircle />
                  Log time here
                </div>
              </div>
            ))}
          </div>

          {listWithBoundaries.map((log, index) => {
            const [width, left] = getCardOffset(index);

            return (
              <ActivityLogCard
                id={log.id}
                key={log.id}
                color={log.listColor}
                style={{
                  height: log.height,
                  width: `${width}%`,
                  left: `${left * width}%`,
                  transform: `translateY(${log.top}px)`,
                }}
                title={log.title}
                note={log.note}
                dateStart={log.datetimeStart}
                dateEnd={log.datetimeEnd}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
