import { FC, useMemo, useState } from "react";
import { Calendar3 } from "react-bootstrap-icons";
import Dropdown from "rc-dropdown";
import { DatePicker } from "../../date-picker";
import { format } from "date-fns";

type Props = {
  value?: string;
  onChange: (newValue: string) => void;
};

export const SelectDateDropdown: FC<Props> = (props) => {
  const { value, onChange } = props;

  const [open, setOpen] = useState(false);

  const overlay = useMemo(
    () => (
      <div className="bg-white w-32 shadow-card border p-2 flex flex-col border-gray-100 rounded-lg rounded p-2">
        <DatePicker onChange={(value) => onChange(value.toISOString())} />
      </div>
    ),
    [onChange]
  );

  return (
    <Dropdown
      overlay={overlay}
      visible={open}
      trigger={["click"]}
      animation="slide-up"
      onVisibleChange={setOpen}
    >
      <div className="bg-gray-100 px-6 h-4 leading-7 gap-4 flex items-center rounded-sm cursor-pointer capitalize">
        <div className="flex-center">
          <Calendar3 width={12} />
        </div>
        {value && (
          <span className="text-gray-700">{format(value, "yyyy-MM-dd")}</span>
        )}
        {!value && <span className="text-gray-400">Scheduled date</span>}
      </div>
    </Dropdown>
  );
};
