import { FC } from "react";
import DatePicker from "react-datepicker";
import clsx from "clsx";

import "./aside-calendar.scss";

type Props = {
  rangeType: "week" | "day";
  value: Date;
  onChange: (date: Date | null) => void;
};

export const AsideCalendar: FC<Props> = (props) => {
  const { rangeType, value, onChange } = props;

  return (
    <div className={clsx("AsideCalendar", rangeType)}>
      <DatePicker
        calendarStartDay={1}
        selected={value}
        showWeekPicker={rangeType === "week"}
        onChange={onChange}
        inline
      />
    </div>
  );
};
