import Dropdown from "rc-dropdown";
import { FC } from "react";
import { useCreateCounterDropdown } from "./use-create-counter-dropdown";
import { PlusCircle } from "react-bootstrap-icons";

export const CreateCounterDropdown: FC = () => {
  const { overlay, dropdownOpened, setDropdownOpened } =
    useCreateCounterDropdown();

  return (
    <Dropdown
      openClassName="bg-red-100"
      trigger={["click"]}
      overlay={overlay}
      visible={dropdownOpened}
      onVisibleChange={setDropdownOpened}
    >
      <button className="h-4 mt-4 mx-auto w-90p flex-center gap-4 rounded-lg bg-blue-600 hover-bg-blue-700 text-white transition-all">
        <PlusCircle />
        <span>Add counter</span>
      </button>
    </Dropdown>
  );
};
