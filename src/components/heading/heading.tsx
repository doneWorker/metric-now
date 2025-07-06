import { FC, useRef } from "react";
import {
  ArrowDownUp,
  Calendar3,
  ThreeDotsVertical,
} from "react-bootstrap-icons";
import Dropdown from "rc-dropdown";
import { getGreetingText } from "./utils";
import { getDatePresetLabel, getSortPresetLabel } from "../../utils";
import { HeadingButton } from "./heading-button";
import { useHeading } from "./use-heading";

import "./heading.scss";
import { useResizeObserver } from "usehooks-ts";
import clsx from "clsx";

type Props = {
  username: string;
  listTitle?: string;
};

export const Heading: FC<Props> = (props) => {
  const { username, listTitle } = props;

  const ref = useRef<HTMLDivElement>(null!);
  const { width = 0 } = useResizeObserver({
    ref,
    box: "border-box",
  });
  const isEnoughSpace = width > 400;

  const { sortPreset, datePreset, sortOverlay, dateOverlay, settingsOverlay } =
    useHeading();

  return (
    <div ref={ref} className="heading mx-30 my-15">
      <div className={clsx("flex space-between", !isEnoughSpace && "flex-col")}>
        <h2 className="text-lg h-4">
          {listTitle ?? getGreetingText(username)}
        </h2>
        <div className="flex gap-4">
          <Dropdown
            trigger={["click"]}
            animation="slide-up"
            overlay={sortOverlay}
          >
            <HeadingButton icon={<ArrowDownUp width={12} height={12} />}>
              {getSortPresetLabel(sortPreset).label}
            </HeadingButton>
          </Dropdown>
          <Dropdown
            trigger={["click"]}
            animation="slide-up"
            overlay={dateOverlay}
          >
            <HeadingButton icon={<Calendar3 width={12} height={12} />}>
              {getDatePresetLabel(datePreset)}
            </HeadingButton>
          </Dropdown>

          {settingsOverlay && (
            <Dropdown
              trigger={["click"]}
              animation="slide-up"
              overlay={settingsOverlay}
              onOverlayClick={(e) => e.preventDefault()}
            >
              <HeadingButton>
                <ThreeDotsVertical width={16} height={16} />
              </HeadingButton>
            </Dropdown>
          )}
        </div>
      </div>
      {isEnoughSpace && <time>Today, {new Date().toDateString()}</time>}
    </div>
  );
};
