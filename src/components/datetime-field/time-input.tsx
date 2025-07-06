import { padStart } from "lodash";
import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string;
  onChange?: (time: string) => void;
};

export const TimeInput = (props: Props) => {
  const { value: defaultValue, onChange } = props;

  const [value, setValue] = useState(
    (defaultValue?.split(":") as [string, string]) ?? ["0", "0"]
  );

  useEffect(() => {
    const newValue = value.join(":");
    newValue && onChange?.(newValue);
  }, [value]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={ref}>{value.join(":")}</div>
      <div className="relative w-14 h-15 flex bg-white shadow-card py-2 rounded-lg text-gray-500 overflow-hidden">
        <div className="w-7 px-2 overflow-auto">
          {Array.from(Array(24).keys()).map((item) => {
            const hh = padStart(item.toString(), 2, "0");

            return (
              <div
                className="h-3 cursor-pointer flex-center rounded-lg hover-bg-blue-500 hover-text-white"
                key={item}
                onClick={() => setValue((prev) => [hh, prev[1]])}
              >
                {hh}
              </div>
            );
          })}
        </div>
        <div className="h-full w-1px bg-gray-200" />
        <div className="w-7 px-2 overflow-auto">
          {Array.from(Array(60).keys()).map((item) => {
            const mm = padStart(item.toString(), 2, "0");

            return (
              <div
                className="h-3 cursor-pointer flex-center rounded-lg hover-bg-blue-500 hover-text-white"
                key={item}
                onClick={() => setValue((prev) => [prev[0], mm])}
              >
                {mm}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
