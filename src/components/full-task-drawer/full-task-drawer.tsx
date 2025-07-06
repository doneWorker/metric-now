import { FC } from "react";
import { ChevronRight, Flag, Trash } from "react-bootstrap-icons";
import { useFullTaskDrawer } from "./use-full-task-drawer";
import { IconButton } from "../button/icon-button";
import { Input } from "../input";
import clsx from "clsx";
import { format } from "date-fns";
import { Tooltip } from "../tooltip";
import { SelectDateDropdown } from "./components";
import { Select } from "../select";
import { TaskPriorityEnum } from "../../constants";

type Props = {
  taskId: string;
  onClose: () => void;
};

export const FullTaskDrawer: FC<Props> = (props) => {
  const { taskId, onClose } = props;

  const { form, task, isOpen, removeTask } = useFullTaskDrawer(taskId);

  return (
    <div
      className={clsx(
        "relative flex-shrink-0 w-33p transition-all translate-x-100p max-w-64 bg-white shadow-card overflow-hidden",
        isOpen && "translate-x-0"
      )}
    >
      {task && isOpen && (
        <form className="absolute mt-16 mb-8 mx-8 inset-0 flex flex-col gap-8">
          <form.Field name="title">
            {(field) => (
              <Input
                value={field.state.value}
                placeholder="Title"
                onChange={(e) => field.handleChange(e.target.value)}
                highlightTags
                required
              />
            )}
          </form.Field>
          <form.Field name="priority">
            {(field) => (
              <Select
                placeholder={
                  <div className="flex items-center gap-4">
                    <Flag /> Priority not specified
                  </div>
                }
                options={Object.values(TaskPriorityEnum).map((value) => ({
                  value,
                  label: (
                    <div className="flex gap-4 items-center">
                      <div className={`dot bg-priority-${value}`}></div> {value}
                    </div>
                  ),
                }))}
                value={field.state.value}
                onChange={(priority) => {
                  const newValue = priority as TaskPriorityEnum | undefined;

                  field.handleChange(
                    newValue === field.state.value ? undefined : newValue
                  );
                }}
              />
            )}
          </form.Field>
          <form.Field name="scheduledDate">
            {(field) => (
              <SelectDateDropdown
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <textarea
                placeholder="Description"
                className=" bg-gray-100 hover-bg-gray-200 p-4 rounded-md border-none resize-v"
                defaultValue={field.state.value}
              />
            )}
          </form.Field>

          <div className="absolute w-full flex items-center space-between bottom-0 gap-4">
            <Tooltip overlay="Collapse" placement="right">
              <IconButton icon={<ChevronRight />} onClick={onClose} />
            </Tooltip>
            <Tooltip overlay="Date created" placement="top">
              <p className="text-gray-600 text-sm">
                {format(new Date(task.dateCreated), "PPpp")}
              </p>
            </Tooltip>
            <Tooltip overlay="Remove task" placement="left">
              <IconButton
                className="text-white bg-red-500"
                icon={<Trash />}
                onClick={removeTask}
              />
            </Tooltip>
          </div>
        </form>
      )}
    </div>
  );
};
