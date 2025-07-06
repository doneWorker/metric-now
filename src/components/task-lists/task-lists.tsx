import { FC } from "react";
import { List } from "../../types";
import { Button } from "../button";
import { ListItem } from "./list-item";
import { useConfirm } from "../../shared/providers";

import "./tasks-list.scss";

type Props = {
  lists: List[];
  activeId: string | null;
  onOpenCreateListModal?: () => void;
  onClick: (listId: string) => void;
  onRemoveList: (listId: string) => void;
};

export const TaskLists: FC<Props> = (props) => {
  const { lists, activeId, onClick, onOpenCreateListModal, onRemoveList } =
    props;

  const { confirm } = useConfirm();

  return (
    <div className="flex flex-col gap-4">
      <h2>Lists</h2>
      <div className="list flex flex-col gap-2">
        {lists.map(({ id, icon, label, count }) => (
          <ListItem
            key={id}
            label={label}
            count={count}
            icon={icon}
            isActive={id === activeId}
            onClick={() => onClick(id)}
            onDeleteClick={async () => {
              confirm({
                description: (
                  <>
                    Are you sure you want to delete the category?
                    <br /> This action cannot be undone.
                  </>
                ),
                onConfirm: (confirmed: boolean) => {
                  if (!confirmed) return;
                  onRemoveList(id);
                },
              });
            }}
            hideActions={["favorites"].includes(id)}
          />
        ))}
      </div>
      <Button
        variant="contained"
        color="gray"
        size="lg"
        data-hotkeys="shift+c"
        startIcon={<span style={{ fontSize: 25 }}>+</span>}
        endIcon={
          <div>
            <span className="flex gap-2">
              <kbd data-code="shift">⇧</kbd>
              <kbd data-code="c">C</kbd>
            </span>
          </div>
        }
        onClick={onOpenCreateListModal}
        rounded
      >
        Create list
      </Button>
    </div>
  );
};
