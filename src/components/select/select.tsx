import { FC, Key, ReactNode, useMemo, useState } from "react";
import Dropdown from "rc-dropdown";
import clsx from "clsx";

export type OptionItem = { label: ReactNode; value: Key };

type Props = {
  options: OptionItem[];
  placeholder?: ReactNode;
  value?: Key;
  startIcon?: ReactNode;
  onChange: (newValue: Key) => void;
};

export const Select: FC<Props> = (props) => {
  const { startIcon, options, placeholder, value, onChange } = props;

  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [value, options]
  );

  const menu = useMemo(
    () => (
      <div className="bg-white shadow-card border p-3 flex flex-col gap-2 border-gray-100 rounded-lg">
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full h-4 flex capitalize items-center gap-3 justify-start px-4 py-1 cursor-pointer rounded-md",
                isActive && "bg-blue-500 text-white",
                !isActive && "text-gray-800 hover-bg-gray-100"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    ),
    [options, onChange]
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      animation="slide-up"
      visible={isOpen}
      onVisibleChange={setIsOpen}
    >
      <div
        className={clsx(
          "bg-gray-100 hover-bg-gray-200 px-6 h-4 leading-7 gap-4 flex items-center rounded-sm cursor-pointer capitalize",
          isOpen && "outline-2 outline-solid outline-blue-500"
        )}
      >
        {startIcon}
        {selectedOption && <span>{selectedOption.label}</span>}
        {!selectedOption && (
          <span className="text-gray-400">
            {placeholder ?? "Not specified"}
          </span>
        )}
      </div>
    </Dropdown>
  );
};
