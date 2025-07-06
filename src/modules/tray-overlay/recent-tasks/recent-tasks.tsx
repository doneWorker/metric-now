import { FC, useMemo } from "react";
import { useActivityLogsList } from "../../activities";
import { keyBy, last } from "lodash";
import { useLists } from "../../../hooks/use-lists";
import { listColors } from "../../../constants";
import { getTimeLabel } from "../../activities/utils";
import { differenceInSeconds } from "date-fns";
import { Stopwatch } from "react-bootstrap-icons";

const filter = { limit: 5 };

export const RecentTasks: FC = () => {
  const { logs } = useActivityLogsList(filter);
  const { lists } = useLists();

  const listMap = useMemo(() => {
    return keyBy(lists, "id");
  }, [lists]);

  return (
    <div className="flex flex-col gap-2">
      <span>Recent activity</span>
      {logs?.map((log) => {
        const listColor = log.listId
          ? listMap[log.listId]?.color
          : last(listColors);

        return (
          <div
            key={log.id}
            className="h-3 flex items-center space-between px-2 gap-2 w-full bg-gray-100 shadow-card rounded-sm"
          >
            <div className="flex gap-2 items-center">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: listColor }}
              />
              <span className="text-sm">{log.title ?? log.note}</span>
            </div>
            <div className="flex gap-2 text-gray-600 text-sm">
              <Stopwatch />
              {getTimeLabel(
                differenceInSeconds(
                  log.datetimeEnd ?? new Date(),
                  log.datetimeStart
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
