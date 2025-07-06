import { FC, useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { Calendar3, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { weekDays } from "./constants";
import { getDaysForMonth, getMonths, getYMD } from "./utils";

import "./date-picker.scss";

type Props = {
  defaultDate?: Date;
  onChange: (date: Date) => void;
};

export const DatePicker: FC<Props> = (props) => {
  const { defaultDate, onChange } = props;

  const [activeDate, setActiveDate] = useState(defaultDate);

  const currentDate = useMemo(() => new Date(), []);
  const [state, setState] = useState({
    month: (activeDate ?? currentDate).getMonth(),
    year: (activeDate ?? currentDate).getFullYear(),
  });

  const months = useMemo(getMonths, []);

  const { days, startWeekDay } = getDaysForMonth(state.month, state.year);

  const handleMonthChange = useCallback((dir: -1 | 1) => {
    setState((prev) => {
      const newState = { ...prev };

      if (dir === 1) {
        if (prev.month < 11) {
          newState.month++;
        } else {
          newState.month = 0;
          newState.year++;
        }
      }

      if (dir === -1) {
        if (prev.month > 0) {
          newState.month--;
        } else {
          newState.month = 11;
          newState.year--;
        }
      }

      return newState;
    });
  }, []);

  const handleDayChange = useCallback(
    (day: number) => {
      const date = new Date(`${state.year}/${state.month + 1}/${day + 1}`);
      setActiveDate(date);
      onChange(date);
    },
    [state.month, state.year]
  );

  const totalWeeks = Math.ceil((startWeekDay + days) / 7);
  const trailingEmptyDays = totalWeeks * 7 - (startWeekDay + days);

  return (
    <div className="w-full flex flex-col p-2 gap-8 bg-white calendar">
      <div className="header">
        <div className="month-selector">
          <button
            type="button"
            className="arrow"
            onClick={() => handleMonthChange(-1)}
          >
            <ChevronLeft />
          </button>
          <div className="label">
            <Calendar3 width={12} height={12} />
            {months[state.month]}, {state.year}
          </div>
          <button
            type="button"
            className="arrow"
            onClick={() => handleMonthChange(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="week-days">
        {weekDays.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>
      <div className="days">
        {[...Array(startWeekDay).keys()].map((day) => (
          <div key={day} className="day inactive">
            {day + 1}
          </div>
        ))}
        {[...Array(days).keys()].map((day) => {
          const current = getYMD(currentDate);
          const active = activeDate && getYMD(activeDate);

          const isPrevYear = currentDate.getFullYear() < state.year;
          const isCurrentYear = state.year === current.year;
          const isCurrentMonth = state.month === current.month;
          const isToday =
            isCurrentYear && isCurrentMonth && current.day === day + 1;
          const isPrevMonth =
            isPrevYear || (isCurrentYear && state.month < current.month);
          const isPrevDay = day + 1 < current.day && isCurrentMonth;
          const isActive =
            active &&
            day + 1 === active?.day &&
            state.year === active.year &&
            state.month === active.month;
          const isDisabled = isPrevMonth || isPrevDay;

          return (
            <button
              type="button"
              key={day}
              className={clsx(
                "day",
                isToday && "today",
                isDisabled && "inactive",
                isActive && "active"
              )}
              onClick={() => !isDisabled && handleDayChange(day)}
            >
              {day + 1}
            </button>
          );
        })}
        {[...Array(trailingEmptyDays).keys()].map((day) => (
          <div key={day} className="day inactive">
            {day + 1}
          </div>
        ))}
      </div>
    </div>
  );
};
