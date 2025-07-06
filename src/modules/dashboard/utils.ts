import {
  parseISO,
  format,
  subDays,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

type Counter = { id: string; name: string };
type CounterLog = { counterId: string; date: string; value: number };

// Granularity: "week" = 7 days, "month" = 30 days
export function transformLogsForChart(
  counters: Counter[],
  logs: CounterLog[],
  granularity: "week" | "month" = "week"
): { date: string; [counterName: string]: number | string }[] {
  const today = new Date();
  const daysToShow = granularity === "month" ? 30 : 7;
  const fromDate = subDays(today, daysToShow - 1); // inclusive
  const nameMap = Object.fromEntries(counters.map((c) => [c.id, c.name]));

  // Create all days in range
  const days = eachDayOfInterval({ start: fromDate, end: today });
  const result = days.map((day) => {
    const row: { date: string; [key: string]: number | string } = {
      date: format(day, "yyyy-MM-dd"),
    };

    for (const counter of counters) {
      row[counter.name] = 0;
    }

    for (const log of logs) {
      const logDate = parseISO(log.date);
      if (isSameDay(logDate, day)) {
        const counterName = nameMap[log.counterId];
        if (counterName) {
          row[counterName] = (row[counterName] as number) + log.value;
        }
      }
    }

    return row;
  });

  return result;
}
