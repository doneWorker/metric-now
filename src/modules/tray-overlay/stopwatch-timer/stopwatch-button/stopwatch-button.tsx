import { FC } from "react";
import clsx from "clsx";
import { Tooltip } from "../../../../components";
import { PlayFill, StopFill } from "react-bootstrap-icons";

import "./stopwatch-button.scss";

type Props = {
  isRunning: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

export const StopwatchButton: FC<Props> = (props) => {
  const { isRunning, isDisabled, onClick } = props;

  return (
    <Tooltip
      overlay={isDisabled ? "Please choose task first" : "Stop/Start activity"}
      placement="left"
    >
      <div
        className={clsx(
          "StopwatchButton relative w-6 h-6 cursor-pointer flex-center transition-all rounded-full text-white bg-blue-500 hover-bg-blue-600 border-3 border-blue-300 outline-blue-700 active-scale-95",
          isRunning && "running",
          isDisabled && "opacity-50"
        )}
        onClick={() => {
          if (isDisabled) {
            return;
          }

          onClick();
        }}
      >
        {!isRunning && <PlayFill className="ml-2" width={28} height={28} />}
        {isRunning && <StopFill width={28} height={28} />}
      </div>
    </Tooltip>
  );
};
