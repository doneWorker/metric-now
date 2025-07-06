import { FC, useState } from "react";
import { Aside } from "../components";
import { ActivityStats, CountersStats } from "../modules/dashboard";
import clsx from "clsx";

enum ActiveTab {
  Activities = "Time Spent",
  Counters = "Counters",
}

export const DashboardScreen: FC = () => {
  const [activeTab, setActiveTab] = useState(ActiveTab.Activities);

  return (
    <div className="flex h-100vh">
      <Aside />
      <div className="w-full h-full p-6">
        <div className="w-full h-6 flex gap-4">
          {Object.values(ActiveTab).map((item) => {
            const isActive = activeTab === item;

            return (
              <button
                key={item}
                className={clsx(
                  "w-full border-1 border-gray-200 shadow-card rounded-lg font-medium transition-all",
                  isActive && "bg-black text-white",
                  !isActive && "bg-white hover-bg-gray-100"
                )}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
        {activeTab === ActiveTab.Activities && <ActivityStats />}
        {activeTab === ActiveTab.Counters && <CountersStats />}
      </div>
    </div>
  );
};
