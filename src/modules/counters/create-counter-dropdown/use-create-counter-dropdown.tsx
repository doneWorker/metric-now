import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { Button, Input } from "../../../components";
import { PlusCircle } from "react-bootstrap-icons";
import { useManageCounters } from "../hooks";

export const useCreateCounterDropdown = () => {
  const [dropdownOpened, setDropdownOpened] = useState(false);

  const { createCounter } = useManageCounters();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    listeners: {
      onSubmit: ({ formApi }) => {
        const { name } = formApi.state.values;

        if (name) {
          createCounter(name).then(() => setDropdownOpened(false));
        }
      },
    },
  });

  const overlay = useMemo(
    () => (
      <div className="w-32 p-4 rounded-lg bg-white shadow-card">
        <div className="flex flex-col gap-4">
          <form.Field name="name">
            {(field) => (
              <Input
                placeholder="Counter name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            )}
          </form.Field>
          <Button startIcon={<PlusCircle />} onClick={form.handleSubmit}>
            Create counter
          </Button>
        </div>
      </div>
    ),
    [form]
  );

  useEffect(() => {
    if (!dropdownOpened) {
      form.reset();
    }
  }, [dropdownOpened, form]);

  return { overlay, form, dropdownOpened, setDropdownOpened };
};
