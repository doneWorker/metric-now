import { useForm } from "@tanstack/react-form";
import { useActivityLogDetails, useManageActivityLogs } from "../hooks";
import {
  add,
  addMinutes,
  differenceInMinutes,
  getHours,
  getMinutes,
} from "date-fns";

export const useEditActivityLog = (
  activityLogId: string,
  onClose: () => void
) => {
  const details = useActivityLogDetails(activityLogId);
  const taskId = details?.taskId;

  const { updateActivityLog, removeActivityLog } = useManageActivityLogs();

  const form = useForm({
    defaultValues: {
      taskId,
      note: "",
      date: details?.datetimeStart
        ? new Date(details?.datetimeStart)
        : new Date(),
      timeStartHours: details?.datetimeStart
        ? getHours(details?.datetimeStart)
        : 0,
      timeStartMinutes: details?.datetimeStart
        ? getMinutes(details?.datetimeStart)
        : 0,
      duration: details?.datetimeEnd
        ? differenceInMinutes(
            new Date(details?.datetimeEnd),
            new Date(details.datetimeStart)
          )
        : 0,
    },
    listeners: {
      onSubmit: ({ formApi }) => {
        const values = formApi.state.values;

        const date = values.date;
        date.setHours(0);
        date.setMinutes(0);

        const datetimeStart = add(date, {
          hours: values.timeStartHours ?? 0,
          minutes: values.timeStartMinutes,
        });

        const payload = {
          datetimeStart: datetimeStart.toISOString(),
          datetimeEnd: addMinutes(datetimeStart, values.duration).toISOString(),
          taskId: values.taskId,
          note: values.note,
        };

        updateActivityLog(activityLogId, payload).then(onClose);
      },
    },
  });

  return {
    form,
    removeActivityLog,
  };
};
