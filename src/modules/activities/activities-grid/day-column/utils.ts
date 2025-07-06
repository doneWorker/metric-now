import { getUnixTime } from "date-fns";
import { ActivityLogWithTitle } from "../../../../types";
import { secondsInDay } from "date-fns/constants";

export function getTopOffsetByDate(date: Date, wrapperHeight: number) {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const dayStartSeconds = getUnixTime(dayStart);
  const seconds = getUnixTime(date) - dayStartSeconds;

  return (seconds / secondsInDay) * wrapperHeight;
}

export function getActivityBoundary(
  activity: ActivityLogWithTitle,
  wrapperHeight: number
) {
  const { datetimeStart, datetimeEnd } = activity;

  const start = getUnixTime(new Date(datetimeStart));
  const end = datetimeEnd
    ? getUnixTime(new Date(datetimeEnd))
    : getUnixTime(new Date());

  const dayStart = new Date(datetimeStart);
  dayStart.setHours(0, 0, 0, 0);
  const dayStartSeconds = getUnixTime(dayStart);

  const duration = end - start;
  const startOffset = start - dayStartSeconds;

  const top = (startOffset / secondsInDay) * wrapperHeight;
  const height = (duration / secondsInDay) * wrapperHeight;

  return {
    top,
    height,
  };
}

export function hasOverlaps(
  targetItem: { top: number; height: number },
  item: { top: number; height: number }
): boolean {
  const aTop = targetItem.top;
  const aBottom = targetItem.top + Math.max(targetItem.height, 18);
  const bTop = item.top;
  const bBottom = item.top + Math.max(item.height, 18);

  return aTop < bBottom && bTop < aBottom;
}
