import { format } from "date-fns";

export function getCounterDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
