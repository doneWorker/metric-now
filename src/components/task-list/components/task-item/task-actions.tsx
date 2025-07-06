import { FC, useMemo } from "react";
import { Bool, ModalType, TaskTypeEnum } from "../../../../types";
import { Tooltip } from "../../../tooltip";
import { ActionButton } from "../../../action-button";
import { Pencil, Play, Plus, Star, Trash } from "react-bootstrap-icons";
import { useAppState } from "../../../../shared/providers";

type Props = {
  taskId: string;
  taskType: TaskTypeEnum;
  favorite?: Bool;
  toggleFavorite: () => void;
  onRemoveTask: () => void;
  onClick: () => void;
};

export const TaskActions: FC<Props> = (props) => {
  const { taskId, favorite, taskType, onRemoveTask, onClick, toggleFavorite } =
    props;

  const { setState } = useAppState();

  const actionButtons = useMemo(() => {
    return [
      {
        key: "edit",
        icon: <Pencil width={12} height={12} />,
        label: "Edit task",
      },
      {
        key: "important",
        icon: <Star className="text-yellow-500" width={12} height={12} />,
        label: (
          <span className="text-yellow-600">
            {favorite ? "Mark as not important" : "Mark as important"}
          </span>
        ),
      },
      {
        key: "remove",
        icon: <Trash width={12} height={12} />,
        label: "Remove task",
        danger: true,
      },
    ];
  }, [favorite]);

  return (
    <div className="flex gap-2">
      {taskType === TaskTypeEnum.Activity && (
        <div className="flex flex-shrink-0 gap-2">
          <Tooltip overlay="Log activity">
            <button
              className="bg-gray-100 text-gray-600 p-3 flex-center rounded-sm"
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  openedModal: {
                    id: ModalType.LogActivity,
                    params: { taskId },
                  },
                }));
              }}
            >
              <Plus width={12} height={12} />
            </button>
          </Tooltip>
          <Tooltip overlay="Start time">
            <button className="bg-gray-100 text-gray-600 p-3 flex-center rounded-sm">
              <Play width={12} height={12} />
            </button>
          </Tooltip>
        </div>
      )}
      <ActionButton
        className="bg-gray-100 shadow-none"
        buttons={actionButtons}
        onClick={(key) => {
          const map = {
            remove: onRemoveTask,
            edit: onClick,
            important: toggleFavorite,
          };
          map[key as keyof typeof map]?.();
        }}
      />
    </div>
  );
};
