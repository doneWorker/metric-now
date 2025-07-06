import { differenceInMinutes, parseISO, getDay } from "date-fns";

type WeekDayMap = { [listId: string]: number };

type ResultRow = {
  day: string; // e.g., "Monday"
} & WeekDayMap;

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getCumulativeMinutesPerListIdPerDay(
  logs: { datetimeStart: string; datetimeEnd?: string; listId?: string }[]
): ResultRow[] {
  const resultMap: Record<number, WeekDayMap> = {};

  for (const log of logs) {
    const start = parseISO(log.datetimeStart);
    const end = log.datetimeEnd ? parseISO(log.datetimeEnd) : new Date();

    const minutes = differenceInMinutes(end, start);
    const jsDay = getDay(start); // 0 = Sunday, ..., 6 = Saturday

    if (!resultMap[jsDay]) resultMap[jsDay] = {};
    resultMap[jsDay][log.listId ?? "unassigned"] =
      (resultMap[jsDay][log.listId ?? "unassigned"] || 0) + minutes;
  }

  // Convert to final format
  const final = [];

  for (let i = 0; i < 7; i++) {
    final.push({
      day: weekdays[i],
      ...resultMap[i],
    });
  }

  return final as ResultRow[];
}
