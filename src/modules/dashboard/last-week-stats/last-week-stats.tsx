import { FC, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActivityLogWithTitle } from "../../../types";
import { getCumulativeMinutesPerListIdPerDay } from "./utils";
import { useLists } from "../../../hooks/use-lists";
import { isNumber, keyBy } from "lodash";
import { getCumulativeDuration } from "../../activities/activities-grid/utils";
import { NO_LIST_LABEL } from "../../../constants";

function formatMinutesToHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

type Props = {
  logs: ActivityLogWithTitle[];
};

export const LastWeekStats: FC<Props> = (props) => {
  const { logs } = props;

  const { lists } = useLists();

  const data = useMemo(() => {
    return getCumulativeMinutesPerListIdPerDay(logs);
  }, [logs]);

  const listIdToLabel = useMemo(() => {
    return keyBy(lists, "id");
  }, [lists]);

  return (
    <div className="w-full">
      <div className="text-xl font-semibold">{getCumulativeDuration(logs)}</div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="var(--gray-500)" />
            <YAxis
              padding={{ top: 20, bottom: 10 }}
              tickFormatter={formatMinutesToHours}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value, name) => [
                isNumber(value) ? formatMinutesToHours(value) : value,
                listIdToLabel[name]?.label ?? NO_LIST_LABEL,
              ]}
            />
            <Legend
              formatter={(value) =>
                listIdToLabel[value]?.label ?? NO_LIST_LABEL
              }
            />
            {lists
              .filter((list) => list.id !== "favorites")
              .map((list) => (
                <Bar
                  key={list.id}
                  dataKey={list.id}
                  stackId="a"
                  fill={list.color ?? "#ccc"}
                  opacity={0.5}
                  activeBar={{
                    opacity: 1,
                  }}
                />
              ))}
            <Bar
              dataKey="unassigned"
              stackId="a"
              fill="#ccc"
              opacity={0.5}
              activeBar={{
                opacity: 1,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
