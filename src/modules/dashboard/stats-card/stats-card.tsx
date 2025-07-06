import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  title: string;
  className?: string;
};

export const StatsCard: FC<Props> = (props) => {
  const { children, title, className } = props;

  return (
    <div
      className={clsx(
        "px-4 py-6 flex flex-col gap-4 rounded-lg bg-white shadow-card",
        className
      )}
    >
      <div className="text-xs text-gray-700 uppercase font-medium">{title}</div>
      <div>{children}</div>
    </div>
  );
};
