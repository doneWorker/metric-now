import { addDays, endOfWeek, getDay, isThisWeek, startOfWeek } from "date-fns";
import { FC, useMemo } from "react";
import { getWeekDays } from "../../../utils";
import { useCounterLogs, useCounters, useManageCounters } from "../hooks";
import { CreateCounterDropdown } from "../create-counter-dropdown";
import { Dash, Plus, Trash } from "react-bootstrap-icons";
import { Tooltip } from "../../../components";
import { useManageCounterLogs } from "../hooks/use-manage-counter-logs";
import { getCounterDate } from "../utils";
import { isEmpty } from "lodash";

type Props = {
  date: Date;
};

export const CountersTable: FC<Props> = (props) => {
  const { date } = props;

  const counters = useCounters();
  const logs = useCounterLogs({
    dateFrom: startOfWeek(date, { weekStartsOn: 1 }),
    dateTo: endOfWeek(date, { weekStartsOn: 1 }),
  });
  const { removeCounter } = useManageCounters();
  const { updateCounterLog } = useManageCounterLogs();

  const logGroups = useMemo(() => {
    const map = counters.reduce((acc, curr) => {
      acc[curr.id] = new Array(7).fill(0);
      return acc;
    }, {} as Record<string, number[]>);

    logs.forEach((log) => {
      const d = new Date(log.date);
      let index = getDay(d) - 1;
      if (index === -1) index = 6;
      if (Array.isArray(map[log.counterId]))
        map[log.counterId][index] = log?.value;
    });

    return map;
  }, [logs, counters]);

  return (
    <div className="flex h-full">
      <div className="w-32 h-full flex flex-col bg-white shadow-lg">
        <div className="w-full flex-shrink-0 px-4 h-6 flex-center border-b-1 border-gray-300 text-gray-700">
          Counter
        </div>
        <div className="flex flex-col">
          {isEmpty(counters) && (
            <div className="flex-center w-full h-5 border-b-1 border-gray-300 text-gray-500">
              No counters found
            </div>
          )}
          {counters.map((counter) => (
            <div
              key={counter.id}
              className="h-5 px-4 flex space-between items-center border-b-1 border-gray-300 text-gray-600"
            >
              <span>{counter.name}</span>
              <Tooltip overlay="Remove counter">
                <button
                  className="w-3 h-3 flex-center rounded-lg text-red-500 hover-bg-red-200"
                  onClick={() => removeCounter(counter.id)}
                >
                  <Trash />
                </button>
              </Tooltip>
            </div>
          ))}
          <CreateCounterDropdown />
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex bg-white">
          {getWeekDays(date).map((label, index) => {
            const currentDate = new Date();
            const isToday =
              currentDate.getDay() === index + 1 && isThisWeek(date);

            return (
              <div
                key={label}
                className="w-full flex-col flex-center h-6 font-medium text-gray-700 sticky z-10 border-b-1 border-r-1 border-gray-300"
                {...(isToday
                  ? {
                      style: {
                        borderBottom: "4px solid var(--blue-500)",
                      },
                    }
                  : {})}
              >
                <span>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="w-full grid grid-cols-7 bg-white">
          {counters.map((counter) => {
            return logGroups[counter.id].map((value, index) => {
              const currentDay = addDays(
                startOfWeek(date, { weekStartsOn: 1 }),
                index
              );
              const d = getCounterDate(currentDay);

              return (
                <div
                  key={index}
                  className="h-5 flex gap-2 items-center border-r-1 border-b-1 border-gray-200 flex-center"
                >
                  <div className="flex bg-gray-100 rounded-lg border-1 border-gray-300">
                    <button
                      className="w-2 h-3 flex-center rounded-lg active-scale-95 text-sm"
                      onClick={() => {
                        updateCounterLog(counter.id, d, value - 1);
                      }}
                    >
                      <Dash />
                    </button>
                    <input
                      className="w-3 h-3 bg-gray-100 rounded-lg border-none text-center text-xs"
                      value={value}
                      onChange={(event) => {
                        const v = Number(event.target.value);
                        if (!isNaN(v)) {
                          updateCounterLog(counter.id, d, v);
                        }
                      }}
                    />
                    <button
                      className="w-2 h-3 flex-center rounded-lg active-scale-95 text-sm"
                      onClick={() => {
                        updateCounterLog(counter.id, d, value + 1);
                      }}
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};
