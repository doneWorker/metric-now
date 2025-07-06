import clsx from "clsx";
import Dropdown from "rc-dropdown";
import { FC, Key, ReactNode, useMemo, useState } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";

type Props = {
  buttons: { key: Key; icon: ReactNode; label: ReactNode; danger?: boolean }[];
  className?: string;
  onClick?: (key: Key) => void;
  onVisibleChange?: (visible: boolean) => void;
};

export const ActionButton: FC<Props> = (props) => {
  const { buttons, className, onClick, onVisibleChange } = props;

  const [open, setOpen] = useState(false);

  const overlay = useMemo(
    () => (
      <div className="bg-white border p-2 min-w-16 flex flex-col shadow-card border-gray-100 rounded-lg rounded p-2">
        {buttons.map(({ key, label, icon, danger = false }) => (
          <button
            key={key}
            className={clsx(
              "w-full h-4 flex items-center gap-4 justify-start px-4 py-1 cursor-pointer rounded-sm",
              !danger && "text-gray-700 hover-bg-gray-100",
              danger && "text-red-500 hover-bg-red-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(key);
              setOpen(false);
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    ),
    [buttons, onClick]
  );

  return (
    <Dropdown
      overlay={overlay}
      visible={open}
      trigger={["hover"]}
      animation="slide-up"
      onVisibleChange={(open) => {
        setOpen(open);
        onVisibleChange?.(open);
      }}
    >
      <button
        className={clsx(
          "w-3 h-3 flex-shrink-0 flex flex-center active-scale-95 shadow-card rounded-md outline-2 outline-solid transition-all",
          open && "outline-blue-200",
          !open && "outline-transparent",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ThreeDotsVertical />
      </button>
    </Dropdown>
  );
};
