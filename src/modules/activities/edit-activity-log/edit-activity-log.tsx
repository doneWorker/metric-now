import { FC, forwardRef, Ref } from "react";
import { useEditActivityLog } from "./use-edit-activity-log";
import { SelectTask } from "../start-activity-dropdown/select-task";
import { Button, Textarea } from "../../../components";
import DatePicker from "react-datepicker";
import clsx from "clsx";
import { Trash } from "react-bootstrap-icons";
import { IconButton } from "../../../components/button/icon-button";

type Props = {
  id: string;
  onClose: () => void;
};

const CustomDateInput = forwardRef(
  (
    {
      value,
      className,
      onClick,
    }: { className: string; value?: string; onClick?: () => void },
    ref: Ref<HTMLButtonElement>
  ) => (
    <button
      className={clsx(
        "h-4 w-full px-4 rounded-lg bg-gray-100 hover-bg-gray-200",
        className
      )}
      ref={ref}
      onClick={onClick}
    >
      {value}
    </button>
  )
);

export const EditActivityLog: FC<Props> = (props) => {
  const { id, onClose } = props;

  const { form, removeActivityLog } = useEditActivityLog(id, onClose);

  return (
    <div className="w-32 p-4 border-1 border-gray-300 rounded-lg shadow-card bg-white">
      <div className="flex flex-col gap-4">
        <form.Field name="taskId">
          {(field) => (
            <SelectTask
              defaultValue={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <hr />
        <form.Field name="date">
          {(field) => (
            <div className="flex gap-4 items-center space-between">
              <label className="w-full">Date</label>
              <DatePicker
                selected={field.state.value}
                customInput={
                  <CustomDateInput className="example-custom-input" />
                }
                onChange={(date) => {
                  field.handleChange(date ?? field.state.value);
                }}
                required
              />
            </div>
          )}
        </form.Field>
        <div className="flex gap-2">
          <form.Field name="timeStartHours">
            {(field) => (
              <div className="w-full flex flex-col">
                <label>HH</label>
                <input
                  className="h-4 px-4 border-none rounded-lg bg-gray-100 hover-bg-gray-200"
                  type="number"
                  placeholder="HH"
                  min={0}
                  max={24}
                  value={field.state.value}
                  onBlur={(event) => {
                    let value = Number(event.target.value);
                    value = Math.min(value, 24);
                    field.handleChange(value);
                  }}
                  onChange={(event) => {
                    field.handleChange(Number(event.target.value));
                  }}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="timeStartMinutes">
            {(field) => (
              <div className="w-full flex flex-col">
                <label>MM</label>
                <input
                  className="h-4 px-4 border-none rounded-lg bg-gray-100 hover-bg-gray-200"
                  type="number"
                  placeholder="MM"
                  value={field.state.value}
                  onBlur={(event) => {
                    let value = Number(event.target.value);
                    value = Math.min(value, 60);
                    field.handleChange(value);
                  }}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                />
              </div>
            )}
          </form.Field>
        </div>
        <hr />
        <form.Field name="duration">
          {(field) => (
            <div className="flex gap-4 items-center space-between">
              <label>Duration (mins)</label>
              <input
                className="h-4 px-4 border-none bg-gray-100 hover-bg-gray-200 rounded-lg"
                type="number"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(parseInt(event.target.value, 10))
                }
              />
            </div>
          )}
        </form.Field>
        <form.Field name="note">
          {(field) => (
            <Textarea
              placeholder="Note"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
        <div className="flex gap-2">
          <Button className="w-full" onClick={form.handleSubmit}>
            Update
          </Button>
          <IconButton
            className="flex-shrink-0 text-white bg-red-600"
            icon={<Trash />}
            onClick={() => removeActivityLog(id)}
          />
        </div>
      </div>
    </div>
  );
};
