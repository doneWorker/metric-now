import { FC, useEffect } from "react";
import { Button, DatetimeField, Modal, Textarea } from "../../../components";
import { useForm } from "@tanstack/react-form";
import { PlusCircle } from "react-bootstrap-icons";
import { useManageActivityLogs } from "../hooks";
import { AppEvents, eventEmitter } from "../../../constants";
import { SelectTask } from "../start-activity-dropdown/select-task";
import { addMinutes, setSeconds } from "date-fns";
import { secondsInMinute } from "date-fns/constants";

type FormValues = {
  taskId: string;
  note: string;
  datetimeStart: Date;
  duration: number;
};

const defaultValues: FormValues = {
  taskId: "",
  note: "",
  datetimeStart: new Date(),
  duration: 0,
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const LogActivityModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  const { createActivityLog } = useManageActivityLogs();

  const form = useForm({
    defaultValues,
    listeners: {
      onSubmit: ({ formApi }) => {
        const values = formApi.state.values;

        const payload = {
          datetimeStart: values.datetimeStart.toISOString(),
          datetimeEnd: addMinutes(
            values.datetimeStart,
            values.duration
          ).toISOString(),
          taskId: values.taskId,
          note: values.note,
        };

        createActivityLog(payload).then(onClose);
      },
    },
  });

  useEffect(() => {
    // watch for events
    const handleEvents = (payload: {
      date: Date;
      timeFrom: number;
      duration: number;
    }) => {
      if (payload.date) {
        const d = setSeconds(payload.date, payload.timeFrom);
        form.setFieldValue("datetimeStart", d);
      }

      if (payload.duration) {
        form.setFieldValue("duration", payload.duration / secondsInMinute);
      }
    };

    eventEmitter.on(AppEvents.LogActivityOpened, handleEvents);

    return () => {
      eventEmitter.off(AppEvents.LogActivityOpened, handleEvents);
    };
  }, [form]);

  return (
    <Modal
      isOpen={isOpen}
      title="Log activity"
      style={{ width: 400 }}
      onClose={onClose}
    >
      <form className="flex flex-col gap-4">
        <form.Field name="taskId">
          {(field) => <SelectTask onChange={field.handleChange} />}
        </form.Field>
        <form.Field name="datetimeStart">
          {(field) => (
            <div className="flex gap-4 items-center space-between">
              <label className="w-full">Date</label>
              <DatetimeField
                selected={field.state.value}
                onChange={(date) => {
                  field.handleChange(date ?? field.state.value);
                }}
                required
              />
            </div>
          )}
        </form.Field>
        <form.Field name="duration">
          {(field) => (
            <div className="flex gap-4 items-center space-between">
              <label>Duration (mins)</label>
              <input
                className="h-4 px-4 border-none bg-gray-100 rounded-lg"
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
              value={field.state.value}
              placeholder="Note"
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        </form.Field>
        <div className="flex justify-end">
          <Button startIcon={<PlusCircle />} onClick={form.handleSubmit}>
            Log activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};
