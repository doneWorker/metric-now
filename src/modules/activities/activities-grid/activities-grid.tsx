import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { ActivityLogWithTitle } from "../../../types";
import { HoursLines } from "./hours-lines";
import { DayColumn } from "./day-column";
import { getWeekDays } from "../../../utils";
import { getTopOffsetByDate } from "./day-column/utils";
import { getCumulativeDuration, groupByWeekday } from "./utils";
import clsx from "clsx";
import { size } from "lodash";
import { addDays, isThisWeek, startOfWeek } from "date-fns";
import { HourglassSplit } from "react-bootstrap-icons";

const hourHeight = 100;
const wrapperHeight = 24 * hourHeight;

type Props = {
  activityLogs: ActivityLogWithTitle[];
  selectedDate: Date;
  isWeek: boolean;
};

export const ActivitiesGrid: FC<Props> = (props) => {
  const { activityLogs, isWeek, selectedDate } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    return groupByWeekday(activityLogs ?? [], isWeek);
  }, [activityLogs, isWeek]);

  const scrollToNow = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }

    const wrapper = wrapperRef.current;
    const topOffset =
      getTopOffsetByDate(new Date(), wrapperHeight) - wrapper.offsetHeight / 2;

    wrapper.scrollTo({ top: topOffset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToNow();

    document.addEventListener("dblclick", scrollToNow);

    return () => {
      document.removeEventListener("dblclick", scrollToNow);
    };
  }, [scrollToNow]);

  return (
    <div className="flex flex-col overflow-hidden h-full bg-gray-100">
      {isWeek && (
        <div className="ml-32 z-2 flex border-l-1 border-gray-300 text-gray-500 font-medium shadow-lg">
          {getWeekDays(selectedDate).map((label, index) => {
            const currentDate = new Date();
            const isToday =
              currentDate.getDay() === index + 1 && isThisWeek(selectedDate);
            const totalHours = getCumulativeDuration(columns[index]);

            return (
              <div
                key={label}
                className="w-full flex-col flex-center h-7 sticky z-10 border-b-1 border-r-1 border-gray-300"
                {...(isToday
                  ? {
                      style: {
                        borderBottom: "4px solid var(--blue-500)",
                      },
                    }
                  : {})}
              >
                <span>{label}</span>
                <span className="mt-2 flex gap-2 text-xs font-normal text-gray-500">
                  <HourglassSplit />
                  {totalHours}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div
        className="relative w-full h-full pl-32 overflow-y-auto"
        ref={wrapperRef}
      >
        <HoursLines hourHeight={hourHeight} />
        <div
          className={clsx(
            "w-full h-full grid gap-0",
            `grid-cols-${size(columns)}`
          )}
        >
          {Object.keys(columns).map((key, index) => (
            <DayColumn
              key={key}
              date={addDays(
                startOfWeek(selectedDate, { weekStartsOn: 1 }),
                index
              )}
              activityLogs={columns[key as unknown as number]}
              wrapperHeight={wrapperHeight}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
