import { FC, ReactNode } from "react";
import clsx from "clsx";
import { InfoCircle } from "react-bootstrap-icons";
import { Tooltip } from "../tooltip";

type Props = {
  content: ReactNode;
  className?: string;
};

export const HelpTooltip: FC<Props> = (props) => {
  const { content, className } = props;

  return (
    <Tooltip overlay={content} placement="top">
      <span
        className={clsx(
          "w-2 h-2 justify-center items-center rounded-full text-gray-500",
          className
        )}
      >
        <InfoCircle />
      </span>
    </Tooltip>
  );
};
