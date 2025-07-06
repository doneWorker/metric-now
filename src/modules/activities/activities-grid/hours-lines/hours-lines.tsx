import { FC, useCallback, useEffect, useRef } from "react";
import { getHourLabel } from "../utils";
import { useInterval } from "usehooks-ts";
import { secondsInDay } from "date-fns/constants";

type Props = {
  hourHeight: number;
};

export const HoursLines: FC<Props> = (props) => {
  const { hourHeight } = props;

  const nowRef = useRef<HTMLDivElement>(null);

  const moveNowLine = useCallback(() => {
    if (!nowRef.current) return;

    const date = new Date();
    const seconds =
      date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    const dayPassed = seconds / secondsInDay;
    const topOffset = dayPassed * hourHeight * 24;

    nowRef.current.style.transform = `translateY(${topOffset}px)`;
  }, []);

  useEffect(() => {
    moveNowLine();
  }, []);

  useInterval(moveNowLine, 1_000);

  return (
    <div className="absolute left-0 pl-32 top-0 w-full overflow-hidden">
      <div className="absolute left-0 top-0 w-8 h-full bg-gray-100 border-r-1 border-gray-300" />
      <div
        id="now-line"
        className="absolute w-full z-5 left-28 h-2px left-4 bg-red-500"
        ref={nowRef}
      >
        <span className="absolute -translate-y-50p w-1 h-1 rounded-full bg-red-500 left-0 top-0" />
      </div>
      {Array.from(Array(24).keys()).map((item, index) => (
        <div
          key={item}
          className="relative w-full"
          style={{
            height: hourHeight,
          }}
        >
          <div className="absolute t-50p w-full h-1px bg-gray-200" />
          <div className="absolute bottom-0 w-full h-1px bg-gray-300 text-sm text-gray-500">
            <span
              className="absolute z-2"
              style={{
                transform: "translate(-45px, -50%)",
                marginTop: index === 23 ? -5 : 0,
              }}
            >
              {getHourLabel(item, true)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
