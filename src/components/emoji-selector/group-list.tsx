import clsx from "clsx";
import { FC } from "react";
import { groupToIcon } from "./constants";

type Props = {
  activeGroup: string;
  onGroupClick: (groupName: string) => void;
};

export const GroupList: FC<Props> = (props) => {
  const { activeGroup, onGroupClick } = props;

  return (
    <div className="group-list">
      {Object.keys(groupToIcon).map((groupName) => (
        <button
          type="button"
          className={clsx("group-item", groupName === activeGroup && "active")}
          key={groupName}
          title={groupName}
          onClick={() => onGroupClick(groupName)}
        >
          {groupToIcon[groupName]}
        </button>
      ))}
    </div>
  );
};
