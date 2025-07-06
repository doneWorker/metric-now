import { FC, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { groupBy, keyBy, orderBy } from "lodash";
import { ActivityLogWithTitle } from "../../../types";
import { getCumulativeDuration } from "../../activities/activities-grid/utils";
import { getTimeLabel } from "../../activities/utils";
import { useLists } from "../../../hooks/use-lists";
import { NO_LIST_LABEL } from "../../../constants";

type Props = {
  logs: ActivityLogWithTitle[];
};

export const TopListsStats: FC<Props> = (props) => {
  const { logs } = props;

  const { lists } = useLists();

  const listIdToLabel = useMemo(() => {
    return keyBy(lists, "id");
  }, [lists]);

  const data = useMemo(() => {
    let groupedLogs = groupBy(logs, (item) => item.listId ?? NO_LIST_LABEL);

    const values = Object.keys(groupedLogs).reduce<
      { name: string; value: number; color: string }[]
    >((acc, key) => {
      acc.push({
        name: key ?? NO_LIST_LABEL,
        value: getCumulativeDuration(groupedLogs[key], false) as number,
        color: groupedLogs[key][0]?.listColor ?? "#ccc",
      });

      return acc;
    }, []);

    const sortedValues = orderBy(values, "value", "desc");
    sortedValues.length = 3;

    return sortedValues;
  }, [logs]);

  return (
    <div className="w-full">
      <div className="w-full h-32">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={60}
              cornerRadius={20}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col px-6">
        {data.map((item) => (
          <div key={item.name} className="h-3 flex space-between">
            <div className="flex gap-8">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ background: item.color }}
              />
              <span>{listIdToLabel[item.name]?.label ?? NO_LIST_LABEL}</span>
            </div>
            <span className="font-medium">{getTimeLabel(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
