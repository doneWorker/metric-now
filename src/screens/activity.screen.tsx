import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { ActivitiesGrid, StartActivityDropdown } from "../modules/activities";
import { useActivityLogsList } from "../modules/activities/hooks/use-activity-logs-list";
import { AsideTracker } from "../modules/activities/aside-tracker";
import { AsideCalendar } from "../modules/activities/aside-calendar";
import clsx from "clsx";
import { getWeekRangeByDate } from "../utils";
import {
  addDays,
  addWeeks,
  endOfDay,
  format,
  startOfDay,
  subDays,
  subWeeks,
} from "date-fns";
import { AppEvents, eventEmitter } from "../constants";
import { LogActivityModal } from "../modules/activities/log-activity-modal";
import { Aside } from "../components";

enum ModalType {
  CreateActivity,
  LogActivity,
}

type RangeType = "week" | "day";

export const ActivityScreen: FC = () => {
  const [openedModal, setOpenedModal] = useState<ModalType>();
  const [range, setRange] = useState<RangeType>("week");
  const [date, setDate] = useState<Date>(new Date());

  const filter = useMemo(
    () =>
      range === "week"
        ? {
            dateTimeStart: getWeekRangeByDate(date)[0],
            datetimeEnd: getWeekRangeByDate(date)[1],
          }
        : {
            dateTimeStart: startOfDay(date),
            datetimeEnd: endOfDay(date),
          },
    [range, date]
  );
  const { logs = [], inProgressLogs = [] } = useActivityLogsList(filter);

  const handleChangeDate = useCallback(
    (date: Date | null) => {
      if (!date) {
        return;
      }

      setDate(date);
    },
    [range]
  );

  useEffect(() => {
    // watch for events
    const handleEvents = () => {
      setOpenedModal(ModalType.LogActivity);
    };

    eventEmitter.on(AppEvents.LogActivityOpened, handleEvents);

    return () => {
      eventEmitter.off(AppEvents.LogActivityOpened, handleEvents);
    };
  }, []);

  return (
    <>
      <div className="flex h-100vh">
        <Aside>
          <>
            {date && (
              <AsideCalendar
                rangeType={range}
                value={date}
                onChange={handleChangeDate}
              />
            )}
            <AsideTracker />
          </>
        </Aside>
        <div className="relative w-full h-full pt-8 flex flex-col bg-white">
          <div className="relative px-12 top-0 z-3 flex items-center space-between w-full h-7 p-2 border-b-1 border-gray-200">
            <div className="flex w-full items-center">
              <span className="text-md font-semibold text-gray-600">
                {format(date, range === "week" ? "MMMM y" : "dd MMMM, y")}
              </span>
            </div>
            <div className="w-full flex-center">
              <div className="flex h-4 gap-2 p-1 bg-gray-200 rounded-xl">
                {["day", "week"].map((item) => (
                  <button
                    key={item}
                    className={clsx(
                      "flex-center h-full px-8 transition-all rounded-xl text-sm font-semibold capitalize",
                      range === item && "bg-white shadow-card",
                      range !== item &&
                        "bg-transparent hover-bg-gray-100 text-gray-600"
                    )}
                    onClick={() => setRange(item as RangeType)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="w-4 h-4 flex-center border-1 border-gray-300 rounded-lg active-scale-95 hover-bg-gray-100 transition-all"
                onClick={() => {
                  setDate((prev) =>
                    range === "day" ? subDays(prev, 1) : subWeeks(prev, 1)
                  );
                }}
              >
                <ChevronLeft />
              </button>
              <button
                className="h-4 px-6 bg-white border-1 border-gray-300 font-medium text-gray-600 rounded-lg active-scale-95 hover-bg-gray-100 transition-all"
                onClick={() => setDate(new Date())}
              >
                Today
              </button>
              <button
                className="w-4 h-4 flex-center border-1 border-gray-300 rounded-lg active-scale-95 hover-bg-gray-100 transition-all"
                onClick={() => {
                  setDate((prev) =>
                    range === "day" ? addDays(prev, 1) : addWeeks(prev, 1)
                  );
                }}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <ActivitiesGrid
            activityLogs={[...logs, ...inProgressLogs]}
            selectedDate={date}
            isWeek={range === "week"}
          />
          <div className="fixed z-2 bottom-8 right-8 flex gap-4">
            <StartActivityDropdown />
          </div>
        </div>
      </div>
      <LogActivityModal
        isOpen={openedModal === ModalType.LogActivity}
        onClose={() => setOpenedModal(undefined)}
      />
    </>
  );
};
