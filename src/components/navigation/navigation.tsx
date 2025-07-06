import { FC } from "react";
import {
  ArrowRepeat,
  ClockHistory,
  ListTask,
  Speedometer2,
} from "react-bootstrap-icons";
import { NavLink } from "./components";

export const Navigation: FC = () => {
  return (
    <div className="flex flex-col gap-4 font-medium">
      <NavLink icon={<ListTask />} link="/" title="Tasks" />
      <NavLink icon={<ClockHistory />} link="/activities" title="Time track" />
      <NavLink icon={<ArrowRepeat />} link="/counters" title="Daily counters" />
      <NavLink icon={<Speedometer2 />} link="/dashboard" title="Dashboard" />
    </div>
  );
};
