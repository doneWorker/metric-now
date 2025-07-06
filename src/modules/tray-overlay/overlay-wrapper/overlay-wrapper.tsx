import { FC, useEffect, useState } from "react";
import { StopwatchTimer } from "../stopwatch-timer";
import { RecentTasks } from "../recent-tasks";

const cardBg = "rgba(255,255,255,.5)";

export const OverlayWrapper: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // check for visibility
    const onVisibilityChange = () => {
      setVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="p-4 flex flex-col gap-4 w-full h-full rounded-lg">
      <div
        className="w-full p-4 rounded-lg shadow-card"
        style={{
          background: cardBg,
        }}
      >
        <StopwatchTimer />
      </div>
      <div
        className="w-full p-4 rounded-lg shadow-card"
        style={{
          background: cardBg,
        }}
      >
        <RecentTasks />
      </div>
    </div>
  );
};
