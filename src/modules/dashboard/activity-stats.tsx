import { FC, useMemo } from "react";
import { isThisMonth, isThisWeek, isToday } from "date-fns";

import { useActivityLogsList } from "../activities";
import { StatsCard } from "./stats-card";
import { getCumulativeDuration } from "../activities/activities-grid/utils";
import { LastWeekStats } from "./last-week-stats";
import { TopListsStats } from "./top-lists-stats";

export const ActivityStats: FC = () => {
  const { logs: activityLogs = [] } = useActivityLogsList();

  const { todayActivityLogs, thisWeekActivityLogs, thisMonthActivityLogs } =
    useMemo(() => {
      const todayActivityLogs = activityLogs.filter((log) =>
        isToday(log.datetimeStart)
      );

      const thisWeekActivityLogs = activityLogs.filter((log) =>
        isThisWeek(log.datetimeStart)
      );

      const thisMonthActivityLogs = activityLogs.filter((log) =>
        isThisMonth(log.datetimeStart)
      );

      return {
        todayActivityLogs,
        thisWeekActivityLogs,
        thisMonthActivityLogs,
      };
    }, [activityLogs]);

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <StatsCard className="w-33p" title="Time spent today">
          <div className="text-xl font-semibold">
            {getCumulativeDuration(todayActivityLogs)}
          </div>
        </StatsCard>
        <StatsCard className="w-33p" title="Time spent this month">
          <div className="text-xl font-semibold">
            {getCumulativeDuration(thisMonthActivityLogs)}
          </div>
        </StatsCard>
        <StatsCard className="w-33p flex-shrink-0" title="Total time spent">
          <div className="text-xl font-semibold">
            {getCumulativeDuration(activityLogs)}
          </div>
        </StatsCard>
      </div>
      <div className="flex gap-4">
        <StatsCard className="w-66p" title="Last week activity">
          <LastWeekStats logs={thisWeekActivityLogs} />
        </StatsCard>
        <StatsCard className="w-33p flex-shrink-0" title="Top 3 lists">
          <TopListsStats logs={activityLogs} />
        </StatsCard>
      </div>
    </div>
  );
};
