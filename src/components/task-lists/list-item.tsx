import clsx from "clsx";
import { FC, ReactNode, useState } from "react";
import { Tooltip } from "../tooltip";
import { Trash } from "react-bootstrap-icons";
import { ActionButton } from "../action-button";

type Props = {
  isActive: boolean;
  label: ReactNode;
  icon: ReactNode;
  count: number;
  hideActions?: boolean;
  onClick: () => void;
  onDeleteClick: () => void;
};

export const ListItem: FC<Props> = (props) => {
  const { label, icon, count, isActive, hideActions, onClick, onDeleteClick } =
    props;

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <Tooltip showArrow={false} overlay={label}>
      <div
        className={clsx(
          "relative list-item",
          isActive && "active",
          isMenuVisible && "menu-visible"
        )}
        onClick={onClick}
      >
        <span>{icon}</span>
        <span className="label">{label}</span>
        <div className="badge">{count}</div>
        {!hideActions && (
          <ActionButton
            className={clsx("actions absolute right-6 opacity-0 bg-white")}
            buttons={[
              {
                icon: <Trash width={14} />,
                key: "remove",
                label: "Remove list",
                danger: true,
              },
            ]}
            onClick={(key) => {
              const map = {
                remove: onDeleteClick,
              };
              map[key as keyof typeof map]?.();
            }}
            onVisibleChange={setIsMenuVisible}
          />
        )}
      </div>
    </Tooltip>
  );
};
