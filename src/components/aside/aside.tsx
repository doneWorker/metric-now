import { FC, PropsWithChildren, useState } from "react";
import { Navigation } from "../navigation";
import { Gear } from "react-bootstrap-icons";
import { SettingsModal } from "../../modules/settings";

export const Aside: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [settingsOpened, setSettingsOpened] = useState(false);

  return (
    <>
      <aside className="w-20vw p-0 h-full bg-white border-r-1 border-gray-200">
        <div className="w-full h-7 mt-16">
          <img
            alt="logo"
            className="w-full h-full object-contain hover-grayscale transition-all active-scale-95"
            src="/logo.png"
          />
        </div>
        <div className="px-8 flex flex-col gap-8">
          <hr />
          <Navigation />
          <hr />
          {children}
        </div>
        <div className="fixed w-full h-5 bottom-1">
          <div className="flex px-8 items-center space-between gap-2">
            <button
              className="w-full h-4 px-4 flex items-center gap-4 hover-bg-gray-100 rounded-lg"
              onMouseEnter={(event) =>
                event.currentTarget.children[0].classList.add("animate-spin")
              }
              onMouseLeave={(event) =>
                event.currentTarget.children[0].classList.remove("animate-spin")
              }
              onClick={() => setSettingsOpened(true)}
            >
              <Gear />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
      <SettingsModal
        isOpen={settingsOpened}
        onClose={() => setSettingsOpened(false)}
      />
    </>
  );
};
