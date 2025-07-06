import Dropdown from "rc-dropdown";
import { Play, Stopwatch } from "react-bootstrap-icons";
import { FC, useMemo } from "react";
import { Button, HelpTooltip, Textarea, Tooltip } from "../../../components";
import { SelectTask } from "./select-task";
import { useStartActivityDropdown } from "./use-start-activity-dropdown";

export const StartActivityDropdown: FC = () => {
  const { form, isOpen, setIsOpen } = useStartActivityDropdown();

  const overlay = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 w-32 p-4 rounded-lg shadow-card bg-white">
        <div className="flex flex-col gap-2">
          <h4>Choose task</h4>
          <form.Field name="taskId">
            {(field) => (
              <SelectTask
                onChange={(taskId) => {
                  field.handleChange(taskId);
                }}
              />
            )}
          </form.Field>
        </div>
        <div className="flex flex-col gap-2">
          <h4>
            Add quick note
            <HelpTooltip
              className="inline-flex ml-2"
              content="I'm hurry, complete it later"
            />
          </h4>
          <form.Field name="note">
            {(field) => (
              <Textarea
                className="w-full"
                placeholder="Quick note"
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
              />
            )}
          </form.Field>

          <div className="flex justify-end">
            <Button startIcon={<Stopwatch />} onClick={form.handleSubmit}>
              Start
            </Button>
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <Dropdown
      trigger={["click"]}
      visible={isOpen}
      overlay={overlay}
      onVisibleChange={setIsOpen}
    >
      <Tooltip overlay="Start activity">
        <button className="p-4 flex-center bg-blue-600 hover-bg-blue-700 text-white rounded-full shadow-2xl active-scale-95">
          <Play width={16} height={16} />
        </button>
      </Tooltip>
    </Dropdown>
  );
};
