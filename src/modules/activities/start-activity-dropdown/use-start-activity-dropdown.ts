import { useForm } from "@tanstack/react-form";
import { useManageActivityLogs } from "../hooks";
import { useEffect, useState } from "react";

type FormValues = {
  taskId?: string;
  note?: string;
};

export const useStartActivityDropdown = () => {
  const { startActivity } = useManageActivityLogs();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      taskId: "",
      note: "",
    } as FormValues,
    listeners: {
      onSubmit: ({ formApi }) => {
        startActivity(formApi.state.values).then(() => setIsOpen(false));
      },
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return { form, isOpen, setIsOpen };
};
