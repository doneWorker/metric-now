import { FC, useMemo, useState } from "react";
import { StatsCard } from "./stats-card";
import { useCounterLogs, useCounters } from "../counters/hooks";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { transformLogsForChart } from "./utils";
import { Select } from "../../components";
import { Calendar3, Repeat } from "react-bootstrap-icons";

type DateRange = "week" | "month";

export const CountersStats: FC = () => {
  const [selectedCounter, setSelectedCounter] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<DateRange>("month");

  const logs = useCounterLogs({});
  const counters = useCounters();

  const data = useMemo(() => {
    return transformLogsForChart(
      counters.filter((counter) => counter.id === selectedCounter),
      logs,
      selectedDate
    );
  }, [counters, logs, selectedCounter, selectedDate]);

  const counterNames = counters.map((c) => c.name);

  const colors = ["#8884d8", "#82ca9d", "#ffc658"];

  const counterOptions = useMemo(
    () =>
      counters.map((counter) => ({
        label: counter.name,
        value: counter.id,
      })),
    [counters]
  );

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <StatsCard className="w-full" title="Counters chart">
          <div className="flex gap-2 items-center">
            <Select
              startIcon={<Repeat />}
              placeholder="Choose counter"
              options={counterOptions}
              value={selectedCounter}
              onChange={(value) => setSelectedCounter(value as string)}
            />
            <Select
              startIcon={<Calendar3 />}
              placeholder="Choose counter"
              options={[
                {
                  label: "This month",
                  value: "month",
                },
                {
                  label: "Last week",
                  value: "week",
                },
              ]}
              value={selectedDate}
              onChange={(value) => setSelectedDate(value as DateRange)}
            />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {counterNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colors[i % colors.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </StatsCard>
      </div>
    </div>
  );
};
