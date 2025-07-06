import { FC, useState } from "react";
import { AsideCalendar } from "../modules/activities/aside-calendar";
import { CountersTable } from "../modules/counters/counters-table";
import { Aside } from "../components";

export const CountersScreen: FC = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex h-100vh">
      <Aside>
        <AsideCalendar
          rangeType="week"
          value={date}
          onChange={(date) => date && setDate(date)}
        />
      </Aside>
      <div className="w-full h-full">
        <CountersTable date={date} />
      </div>
    </div>
  );
};
