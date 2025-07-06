import { useForm } from "@tanstack/react-form";
import { useTask } from "../../hooks/use-task";
import { useAppState } from "../../shared/providers";
import { createActivityLogRecord } from "../../db";

export const useLogActivityModal = (onClose: () => void) => {
  const { state } = useAppState();

  const { task } = useTask(state.openedModal?.params?.taskId as string);

  const form = useForm({
    defaultValues: {
      datetimeStart: new Date(),
      datetimeEnd: new Date(),
      note: "",
    },
    listeners: {
      onSubmit: ({ formApi }) => {
        if (!task) return;

        const activity = {
          activityId: task.id,
          datetimeStart: formApi.state.values.datetimeStart.toISOString(),
          datetimeEnd: formApi.state.values.datetimeEnd.toISOString(),
        };

        createActivityLogRecord(activity).then(onClose);
      },
    },
  });

  return {
    form,
    title: task?.title,
  };
};
