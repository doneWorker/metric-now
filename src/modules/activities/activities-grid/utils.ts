import { differenceInSeconds, getDay, parseISO } from "date-fns";
import { groupBy } from "lodash";
import { ActivityLog, ActivityLogWithTitle } from "../../../types";

export function getHourLabel(index: number, is12Hours = false) {
  if (is12Hours) {
    const suffix = index > 11 ? "PM" : "AM";
    return `${(index % 12) + 1} ${suffix}`;
  }

  return index + 1;
}

export function groupByWeekday(
  logs: ActivityLogWithTitle[],
  isWeek: boolean = true
): Record<number, ActivityLogWithTitle[]> {
  const grouped = groupBy(logs, (log) => {
    const date = parseISO(log.datetimeStart);
    const jsDay = getDay(date);
    return jsDay === 0 ? 6 : jsDay - 1;
  });

  if (isWeek === false) return grouped;

  const result: Record<number, ActivityLogWithTitle[]> = {};
  for (let i = 0; i < 7; i++) {
    result[i] = grouped[i] ?? [];
  }

  return result;
}

export function getCumulativeDuration(
  logs: Pick<ActivityLog, "datetimeStart" | "datetimeEnd">[],
  formatResult: boolean = true
) {
  const totalSeconds = logs.reduce((total, log) => {
    const start = parseISO(log.datetimeStart);
    const end = log.datetimeEnd ? parseISO(log.datetimeEnd) : new Date();
    return total + differenceInSeconds(end, start);
  }, 0);

  if (formatResult) {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  return totalSeconds;
}
