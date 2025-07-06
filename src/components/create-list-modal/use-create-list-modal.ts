import { useForm } from "@tanstack/react-form";
import { last } from "lodash";
import { listColors } from "../../constants";
import { useState } from "react";
import { useLists } from "../../hooks/use-lists";

export enum DropdownType {
  Emoji,
  Color,
}

type Params = {
  onClose: () => void;
};

export const useCreateListModal = (params: Params) => {
  const { onClose } = params;

  const [dropdownOpened, setDropdownOpened] = useState<DropdownType>();

  const { createList } = useLists();

  const form = useForm({
    defaultValues: {
      label: "",
      icon: "📝",
      color: last(listColors),
    },
    listeners: {
      onSubmit: ({ formApi }) => {
        createList(formApi.state.values).then(onClose);
      },
    },
  });

  return {
    dropdownOpened,
    setDropdownOpened,
    form,
  };
};
